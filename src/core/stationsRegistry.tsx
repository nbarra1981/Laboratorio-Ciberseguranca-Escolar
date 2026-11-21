import type { StationDefinition } from './types';
import { FlashCardsStation } from '../stations/flashcards/FlashCardsStation';

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
    id: 'estacao-2-phishing',
    number: 2,
    title: 'Detetor de Mensagens Suspeitas',
    shortTitle: 'Detetor de Phishing',
    subtitle: 'Estação 2 — Análise de Correio e Mensagens',
    description:
      'Simulador prático de inspeção de mensagens escolares para identificar remetentes falsos, hiperligações enganadoras e anexos perigosos.',
    methodology: 'Análise guiada de casos',
    estimatedTime: 'Em preparação',
    status: 'coming_soon',
    topics: ['Inspeção de cabeçalhos', 'Hiperligações falsas', 'Sinais de manipulação'],
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
