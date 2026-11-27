import type { StationDefinition } from './types';
import { FlashCardsStation } from '../stations/flashcards/FlashCardsStation';
import { SecretariaStation } from '../stations/secretaria/SecretariaStation';

/**
 * Registo central de estações do Laboratório de Informática.
 * Para integrar uma nova estação de aprendizagem, basta criar o respetivo módulo
 * em `src/stations/` e registá-lo neste vetor.
 */
export const stationsRegistry: StationDefinition[] = [
  {
    id: 'estacao-1-flashcards',
    number: 1,
    title: 'FlashCards: Cibersegurança nas Escolas',
    shortTitle: 'FlashCards de Cibersegurança',
    subtitle: 'Estação 1 — FlashCards: Cibersegurança nas Escolas',
    description:
      'Estuda, revê e consolida 30 cenários práticos de cibersegurança escolar através de recordação ativa e repetição orientada em cinco domínios essenciais.',
    methodology: 'Recordação ativa e repetição orientada',
    estimatedTime: '10 a 20 min',
    status: 'active',
    topics: [
      'Autenticação e Acessos',
      'Engenharia Social',
      'Privacidade e Dados',
      'Equipamentos e Redes',
      'Informação e Incidentes',
    ],
    component: FlashCardsStation,
  },
  {
    id: 'estacao-2-secretaria',
    number: 2,
    title: 'A Secretária do Professor',
    shortTitle: 'Secretária Segura',
    subtitle: 'Estação 2 — A Secretária do Professor',
    description:
      'Quadro interativo sobre a secretária de um professor para identificar 8 riscos de ciber-higiene, pautas em papel, post-its, router e boas práticas com voz em português.',
    methodology: 'Quadro interativo com imagem e quiz',
    estimatedTime: '15 a 25 min',
    status: 'active',
    topics: [
      'Ciber-higiene',
      'Controlo de acessos',
      'Gestão de credenciais e MFA',
      'RGPD e proteção documental',
      'Segurança de redes e USB',
    ],
    component: SecretariaStation,
  },
  {
    id: 'estacao-3-passwords',
    number: 3,
    title: 'Oficina de Palavras-Passe e MFA',
    shortTitle: 'Oficina de Acessos',
    subtitle: 'Estação 3 — Construção de Credenciais Seguras',
    description:
      'Experiências interativas para avaliar a robustez de frases-passe fictícias e compreender o papel da autenticação multifator.',
    methodology: 'Experimentação interativa',
    estimatedTime: 'Em preparação',
    status: 'coming_soon',
    topics: ['Frases-passe', 'Gestores de credenciais', 'Segundo fator'],
  },
  {
    id: 'estacao-4-privacidade',
    number: 4,
    title: 'Auditoria de Privacidade Escolar',
    shortTitle: 'Auditoria de Privacidade',
    subtitle: 'Estação 4 — Proteção de Dados e Imagem',
    description:
      'Desafios de decisão sobre partilha de fotografias, permissões de aplicações móveis e proteção de documentos da turma.',
    methodology: 'Cenários de decisão',
    estimatedTime: 'Em preparação',
    status: 'coming_soon',
    topics: ['Direito à imagem', 'Permissões móveis', 'Minimização de dados'],
  },
];

export function getStationById(id: string | null): StationDefinition | undefined {
  if (!id) {
    return undefined;
  }
  return stationsRegistry.find((station) => station.id === id);
}
