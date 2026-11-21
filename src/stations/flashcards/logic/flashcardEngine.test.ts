import test from 'node:test';
import assert from 'node:assert/strict';
import { DOMAINS, FLASHCARDS_DECK } from '../data/flashcardsData';
import {
  computeChallengeSummary,
  computeDomainMasteryChart,
  computeProgressStats,
  createChallengeSession,
  filterCardsByDomain,
  finishChallengeSession,
  getCardsToReviewIds,
  rateCurrentCard,
  recordSessionFlip,
  shuffleFisherYates,
  startReviewCycle,
} from './flashcardEngine';

test('deck contains at least 25 flashcards and at least 5 per domain', () => {
  assert.ok(FLASHCARDS_DECK.length >= 25, 'Deck must have at least 25 cards');
  assert.equal(DOMAINS.length, 5, 'Must have exactly 5 domains');

  for (const domain of DOMAINS) {
    const count = FLASHCARDS_DECK.filter((c) => c.domainId === domain.id).length;
    assert.ok(
      count >= 5,
      `Domain ${domain.id} must have at least 5 cards (found ${count})`,
    );
  }

  const uniqueIds = new Set(FLASHCARDS_DECK.map((c) => c.id));
  assert.equal(uniqueIds.size, FLASHCARDS_DECK.length, 'Card IDs must be unique');
});

test('Fisher-Yates shuffle preserves elements and does not mutate input', () => {
  const original = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const copyBefore = [...original];

  let seed = 42;
  const deterministicRng = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  const shuffled = shuffleFisherYates(original, deterministicRng);
  assert.deepEqual(original, copyBefore, 'Input array must not be mutated');
  assert.equal(shuffled.length, original.length);
  assert.deepEqual([...shuffled].sort((a, b) => a - b), original);
  assert.notDeepEqual(shuffled, original, 'Shuffled order should differ');
});

test('filterCardsByDomain selects all or specific domain cards', () => {
  const all = filterCardsByDomain(FLASHCARDS_DECK, 'all');
  assert.equal(all.length, FLASHCARDS_DECK.length);

  const authOnly = filterCardsByDomain(FLASHCARDS_DECK, 'autenticacao');
  assert.ok(authOnly.length >= 5);
  assert.ok(authOnly.every((c) => c.domainId === 'autenticacao'));
});

test('challenge mode spaced repetition handles forgot, unsure, and mastered without duplicates', () => {
  const domainCards = filterCardsByDomain(FLASHCARDS_DECK, 'autenticacao');
  let session = createChallengeSession(domainCards, 'challenge', 'autenticacao', 1000);

  assert.equal(session.queue.length, domainCards.length);
  assert.equal(session.completed, false);
  assert.equal(session.totalFlips, 0);

  const firstCard = domainCards.find((c) => c.id === session.queue[0])!;
  session = recordSessionFlip(session, firstCard.id);
  session = rateCurrentCard(session, firstCard, 'forgot', 2000);
  assert.equal(session.totalFlips, 1);
  assert.ok(session.revealedCardIds.includes(firstCard.id));
  assert.equal(session.queue[3], firstCard.id);
  assert.equal(
    session.queue.filter((id) => id === firstCard.id).length,
    1,
    'No duplicate card IDs in queue',
  );

  const secondCard = domainCards.find((c) => c.id === session.queue[0])!;
  session = recordSessionFlip(session, secondCard.id);
  session = rateCurrentCard(session, secondCard, 'unsure', 3000);
  assert.equal(session.totalFlips, 2);

  const toReviewIds = getCardsToReviewIds(session.latestRatings);
  assert.equal(toReviewIds.length, 2);
  assert.ok(toReviewIds.includes(firstCard.id));
  assert.ok(toReviewIds.includes(secondCard.id));

  let safetyCounter = 0;
  while (!session.completed && safetyCounter < 50) {
    const headId = session.queue[0];
    const headCard = domainCards.find((c) => c.id === headId)!;
    session = recordSessionFlip(session, headCard.id);
    session = rateCurrentCard(session, headCard, 'mastered', 4000 + safetyCounter);
    safetyCounter += 1;
  }

  assert.equal(session.completed, true);
  assert.equal(session.totalFlips, domainCards.length + 2);

  const summary = computeChallengeSummary(session, FLASHCARDS_DECK);
  assert.equal(summary.totalWorked, domainCards.length);
  assert.equal(summary.totalFlips, domainCards.length + 2);
  assert.equal(summary.uniqueRevealedCount, domainCards.length);
  assert.equal(summary.masteredCount, domainCards.length);
  assert.ok(summary.weakCardIds.includes(firstCard.id));
  assert.ok(summary.weakCardIds.includes(secondCard.id));
});

test('review cycle preserves all cumulative flips and interactions from challenge session', () => {
  const domainCards = filterCardsByDomain(FLASHCARDS_DECK, 'autenticacao');
  let session = createChallengeSession(domainCards, 'challenge', 'autenticacao', 1000);

  // Reveal & rate 3 cards: 1 forgot, 1 unsure, 1 mastered -> 3 flips, 3 interactions
  session = recordSessionFlip(session, domainCards[0].id);
  session = rateCurrentCard(session, domainCards[0], 'forgot', 2000);
  session = recordSessionFlip(session, domainCards[1].id);
  session = rateCurrentCard(session, domainCards[1], 'unsure', 3000);
  session = recordSessionFlip(session, domainCards[2].id);
  session = rateCurrentCard(session, domainCards[2], 'mastered', 4000);

  // Reveal 4th card without rating yet -> 4 flips, 4 unique revealed cards!
  session = recordSessionFlip(session, domainCards[3].id);
  const statsBeforeReview = computeProgressStats(
    domainCards,
    session.latestRatings,
    session.revealedCardIds,
  );
  assert.equal(statsBeforeReview.revealedUniqueCount, 4);

  // Start 'Rever cartas' with both 'forgot' and 'unsure' cards
  const reviewIds = getCardsToReviewIds(session.latestRatings);
  assert.equal(reviewIds.length, 2);
  const reviewCards = domainCards.filter((c) => reviewIds.includes(c.id));

  session = startReviewCycle(session, reviewCards, 'autenticacao', 5000);
  assert.equal(session.mode, 'review');
  assert.equal(session.totalFlips, 4, 'Preserves flips from challenge');
  assert.equal(session.history.length, 3, 'Preserves history from challenge');

  // Inside review cycle: first card marked unsure again, then both mastered
  const rCard0 = domainCards.find((c) => c.id === session.queue[0])!;
  session = recordSessionFlip(session, rCard0.id);
  session = rateCurrentCard(session, rCard0, 'unsure', 6000);

  const rCard1 = domainCards.find((c) => c.id === session.queue[0])!;
  session = recordSessionFlip(session, rCard1.id);
  session = rateCurrentCard(session, rCard1, 'mastered', 7000);

  const rCard0Again = domainCards.find((c) => c.id === session.queue[0])!;
  session = recordSessionFlip(session, rCard0Again.id);
  session = rateCurrentCard(session, rCard0Again, 'mastered', 8000);

  assert.equal(session.completed, true);
  const summary = computeChallengeSummary(session, FLASHCARDS_DECK);
  assert.equal(summary.totalFlips, 7, '4 initial reveals + 3 review reveals = 7');
  assert.equal(summary.totalAttempts, 6, '3 initial ratings + 3 review ratings = 6');
  assert.equal(summary.uniqueRevealedCount, 4);
  assert.equal(summary.masteredCount, 3);
  assert.equal(summary.toReviewCount, 0);
});

test('finishChallengeSession early preserves totalFlips and combines unsure + forgot in toReviewCount', () => {
  const domainCards = filterCardsByDomain(FLASHCARDS_DECK, 'autenticacao');
  let session = createChallengeSession(domainCards, 'challenge', 'autenticacao', 1000);

  session = recordSessionFlip(session, domainCards[0].id);
  session = rateCurrentCard(session, domainCards[0], 'forgot', 2000);
  session = recordSessionFlip(session, domainCards[1].id);
  session = rateCurrentCard(session, domainCards[1], 'unsure', 3000);
  session = recordSessionFlip(session, domainCards[2].id);
  session = rateCurrentCard(session, domainCards[2], 'mastered', 4000);

  session = finishChallengeSession(session, 5000);
  assert.equal(session.completed, true);

  const summary = computeChallengeSummary(session, FLASHCARDS_DECK);
  assert.equal(summary.totalFlips, 3);
  assert.equal(summary.totalWorked, 3);
  assert.equal(summary.masteredCount, 1);
  assert.equal(summary.unsureCount, 1);
  assert.equal(summary.forgotCount, 1);
  assert.equal(summary.toReviewCount, 2);
  assert.equal(summary.weakCardIds.length, 2);
});

test('quick10 mode selects 10 shuffled cards and finishes after 10 assessments', () => {
  let session = createChallengeSession(FLASHCARDS_DECK, 'quick10', 'all', 10000);
  assert.equal(session.queue.length, 10);
  assert.equal(session.totalInitial, 10);

  for (let i = 0; i < 10; i += 1) {
    const card = FLASHCARDS_DECK.find((c) => c.id === session.queue[0])!;
    const rating = i < 7 ? 'mastered' : i < 9 ? 'unsure' : 'forgot';
    session = recordSessionFlip(session, card.id);
    session = rateCurrentCard(session, card, rating, 10000 + (i + 1) * 1000);
  }

  assert.equal(session.completed, true);
  assert.equal(session.masteredIds.length, 7);
  assert.equal(session.totalFlips, 10);

  const summary = computeChallengeSummary(session, FLASHCARDS_DECK);
  assert.equal(summary.totalWorked, 10);
  assert.equal(summary.totalFlips, 10);
  assert.equal(summary.masteredCount, 7);
  assert.equal(summary.unsureCount, 2);
  assert.equal(summary.forgotCount, 1);
  assert.equal(summary.toReviewCount, 3);
  assert.equal(summary.performancePercentage, 70);
  assert.equal(summary.weakCardIds.length, 3);
  assert.equal(summary.durationSeconds, 10);
});

test('computeDomainMasteryChart always returns all 5 domains in order with accurate mastered vs total counts', () => {
  const autCards = filterCardsByDomain(FLASHCARDS_DECK, 'autenticacao');
  const engCards = filterCardsByDomain(FLASHCARDS_DECK, 'engenharia-social');

  const ratings = {
    [autCards[0].id]: 'mastered' as const,
    [autCards[1].id]: 'mastered' as const,
    [autCards[2].id]: 'unsure' as const,
    [autCards[3].id]: 'forgot' as const,
    [engCards[0].id]: 'mastered' as const,
  };

  const fullDeckChart = computeDomainMasteryChart(FLASHCARDS_DECK, ratings);
  assert.equal(fullDeckChart.length, 5);
  assert.deepEqual(
    fullDeckChart.map((d) => d.order),
    [1, 2, 3, 4, 5],
  );

  const autBar = fullDeckChart.find((d) => d.domainId === 'autenticacao')!;
  assert.equal(autBar.mastered, 2);
  assert.equal(autBar.total, autCards.length);
  assert.equal(autBar.percentage, Math.round((2 / autCards.length) * 100));

  const engBar = fullDeckChart.find((d) => d.domainId === 'engenharia-social')!;
  assert.equal(engBar.mastered, 1);
  assert.equal(engBar.total, engCards.length);

  const privBar = fullDeckChart.find((d) => d.domainId === 'privacidade')!;
  assert.equal(privBar.mastered, 0);
  assert.ok(privBar.total >= 5);
  assert.equal(privBar.percentage, 0);

  // Subset scope (e.g., filtered domain session) still outputs all 5 domains with 0/0 for excluded domains
  const filteredChart = computeDomainMasteryChart(autCards, ratings);
  assert.equal(filteredChart.length, 5);
  assert.equal(filteredChart[0].mastered, 2);
  assert.equal(filteredChart[0].total, autCards.length);
  assert.equal(filteredChart[2].mastered, 0);
  assert.equal(filteredChart[2].total, 0);
  assert.equal(filteredChart[2].percentage, 0);
});
