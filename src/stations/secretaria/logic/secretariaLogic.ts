import { shuffleFisherYates } from '../../flashcards/logic/flashcardEngine';
import type { SecretaraItem, SecretariaQuizQuestion } from '../data/secretariaData';

export interface ShuffledQuizQuestion extends SecretariaQuizQuestion {
  opcoes: [string, string, string, string];
}

export interface QuizRecommendation {
  tema: string;
  relatedItemId: string;
  itemTitle: string;
  recomendacao: string;
}

export interface QuizResultsSummary {
  score: number;
  total: number;
  percentage: number;
  missedQuestionIds: number[];
  recommendations: QuizRecommendation[];
  feedbackTitle: string;
  feedbackMessage: string;
}

/**
 * Shuffles the 4 answer options of a single quiz question using Fisher-Yates
 * and remaps `respostaCorreta` to the new index of the correct answer.
 */
export function shuffleQuizQuestion(
  question: SecretariaQuizQuestion,
  rng: () => number = Math.random,
): ShuffledQuizQuestion {
  const indexed = question.opcoes.map((texto, idx) => ({
    texto,
    isCorrect: idx === question.respostaCorreta,
  }));

  const shuffled = shuffleFisherYates(indexed, rng);
  const newCorrectIndex = shuffled.findIndex((entry) => entry.isCorrect);

  return {
    ...question,
    opcoes: [
      shuffled[0].texto,
      shuffled[1].texto,
      shuffled[2].texto,
      shuffled[3].texto,
    ],
    respostaCorreta: newCorrectIndex >= 0 ? newCorrectIndex : 0,
  };
}

/**
 * Shuffles the answer options for every question in the quiz so the correct
 * option appears across all positions (A, B, C, D) rather than fixed slots.
 */
export function prepareShuffledQuiz(
  questions: readonly SecretariaQuizQuestion[],
  rng: () => number = Math.random,
): ShuffledQuizQuestion[] {
  return questions.map((question) => shuffleQuizQuestion(question, rng));
}

/**
 * Computes score, percentage, missed questions, and personalized study
 * recommendations without persisting any user answers.
 */
export function computeQuizResults(
  questions: readonly ShuffledQuizQuestion[],
  selectedAnswers: Record<number, number>,
  items: readonly SecretaraItem[],
): QuizResultsSummary {
  const itemById = new Map(items.map((item) => [item.id, item]));
  let score = 0;
  const missedQuestionIds: number[] = [];
  const recommendationsByTopic = new Map<string, QuizRecommendation>();

  for (const q of questions) {
    const chosen = selectedAnswers[q.id];
    if (chosen === q.respostaCorreta) {
      score += 1;
    } else {
      missedQuestionIds.push(q.id);
      const key = `${q.relatedItemId}:${q.tema}`;
      if (!recommendationsByTopic.has(key)) {
        const linkedItem = itemById.get(q.relatedItemId);
        recommendationsByTopic.set(key, {
          tema: q.tema,
          relatedItemId: q.relatedItemId,
          itemTitle: linkedItem ? linkedItem.shortTitle : q.tema,
          recomendacao: q.recomendacao,
        });
      }
    }
  }

  const total = questions.length;
  const percentage = total === 0 ? 0 : Math.round((score / total) * 100);

  let feedbackTitle = 'Excelente desempenho!';
  let feedbackMessage =
    'Demonstrou domínio sólido das boas práticas de cibersegurança e proteção de dados na secretária escolar.';

  if (percentage < 50) {
    feedbackTitle = 'Ponto de partida para reforço';
    feedbackMessage =
      'Recomendamos percorrer novamente o Modo Exploração na secretária e rever as recomendações personalizadas abaixo.';
  } else if (percentage < 80) {
    feedbackTitle = 'Bom progresso na ciber-higiene';
    feedbackMessage =
      'Já aplica várias práticas essenciais, mas há aspetos importantes a consolidar nos temas assinalados abaixo.';
  } else if (percentage < 100) {
    feedbackTitle = 'Muito bom domínio!';
    feedbackMessage =
      'Acertou na grande maioria das situações. Consulte as recomendações específicas abaixo para fechar os últimos detalhes.';
  }

  return {
    score,
    total,
    percentage,
    missedQuestionIds,
    recommendations: Array.from(recommendationsByTopic.values()),
    feedbackTitle,
    feedbackMessage,
  };
}

/**
 * Returns the short risk description associated with the selected element
 * displayed in "Explicação Sonora" and read aloud to the user.
 */
export function buildElementSpeechText(item: SecretaraItem): string {
  return item.audioSummary;
}
