import assert from 'node:assert/strict';
import test from 'node:test';
import { QUESTIONARIO_ESTACAO_2, SECRETARIA_ITEMS } from '../data/secretariaData';
import {
  buildElementSpeechText,
  computeQuizResults,
  prepareShuffledQuiz,
  shuffleQuizQuestion,
} from './secretariaLogic';

function makeSeededRng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

test('shuffleQuizQuestion preserves all option strings and remaps respostaCorreta accurately', () => {
  const base = QUESTIONARIO_ESTACAO_2[0];
  const expectedCorrectText = base.opcoes[base.respostaCorreta];

  for (let seed = 1; seed <= 25; seed += 1) {
    const shuffled = shuffleQuizQuestion(base, makeSeededRng(seed));
    assert.equal(shuffled.opcoes.length, 4);
    assert.deepEqual([...shuffled.opcoes].sort(), [...base.opcoes].sort());
    assert.equal(shuffled.opcoes[shuffled.respostaCorreta], expectedCorrectText);
    assert.ok(shuffled.respostaCorreta >= 0 && shuffled.respostaCorreta <= 3);
  }
});

test('prepareShuffledQuiz distributes correct answers across all 4 option positions (A, B, C, D)', () => {
  const seenPositions = new Set<number>();

  for (let run = 1; run <= 20; run += 1) {
    const shuffledQuiz = prepareShuffledQuiz(QUESTIONARIO_ESTACAO_2, makeSeededRng(run * 7919));
    assert.equal(shuffledQuiz.length, QUESTIONARIO_ESTACAO_2.length);

    shuffledQuiz.forEach((q, idx) => {
      const original = QUESTIONARIO_ESTACAO_2[idx];
      assert.equal(q.opcoes[q.respostaCorreta], original.opcoes[original.respostaCorreta]);
      seenPositions.add(q.respostaCorreta);
    });
  }

  assert.deepEqual([...seenPositions].sort(), [0, 1, 2, 3]);
});

test('computeQuizResults computes percentage and personalized recommendations for missed questions only', () => {
  const quiz = prepareShuffledQuiz(QUESTIONARIO_ESTACAO_2, makeSeededRng(42));
  const answers: Record<number, number> = {};

  // Answer first 8 correctly, intentionally miss last 2 (USB channel and ID badge)
  quiz.forEach((q, idx) => {
    if (idx < 8) {
      answers[q.id] = q.respostaCorreta;
    } else {
      answers[q.id] = (q.respostaCorreta + 1) % 4;
    }
  });

  const summary = computeQuizResults(quiz, answers, SECRETARIA_ITEMS);
  assert.equal(summary.score, 8);
  assert.equal(summary.total, 10);
  assert.equal(summary.percentage, 80);
  assert.deepEqual(summary.missedQuestionIds, [quiz[8].id, quiz[9].id]);
  assert.equal(summary.recommendations.length, 2);
  assert.ok(summary.recommendations.some((r) => r.relatedItemId === 'usb'));
  assert.ok(summary.recommendations.some((r) => r.relatedItemId === 'badge'));
});

test('computeQuizResults returns zero missed questions and 100% when all answers match', () => {
  const quiz = prepareShuffledQuiz(QUESTIONARIO_ESTACAO_2, makeSeededRng(99));
  const answers: Record<number, number> = {};
  for (const q of quiz) {
    answers[q.id] = q.respostaCorreta;
  }

  const summary = computeQuizResults(quiz, answers, SECRETARIA_ITEMS);
  assert.equal(summary.score, 10);
  assert.equal(summary.percentage, 100);
  assert.equal(summary.missedQuestionIds.length, 0);
  assert.equal(summary.recommendations.length, 0);
});

test('buildElementSpeechText returns the concise risk description associated with each element', () => {
  for (const item of SECRETARIA_ITEMS) {
    const spoken = buildElementSpeechText(item);
    assert.equal(spoken, item.audioSummary);
    assert.ok(spoken.length > 80 && spoken.length < 400);
    assert.ok(!spoken.startsWith('Sou '));
    assert.ok(!spoken.startsWith('Somos '));
  }
});
