export type DomainId =
  | 'autenticacao'
  | 'engenharia-social'
  | 'privacidade'
  | 'equipamentos-redes'
  | 'informacao-incidentes';

export interface DomainInfo {
  id: DomainId;
  order: number;
  name: string;
  shortName: string;
  description: string;
  colorClass: string;
  softBgClass: string;
  borderClass: string;
  textClass: string;
  barClass: string;
  iconName: 'key' | 'shield-alert' | 'user-check' | 'laptop' | 'hard-drive';
}

export interface FlashCard {
  id: string;
  domainId: DomainId;
  question: string;
  answer: string;
  schoolTip: string;
}

export const DOMAINS: DomainInfo[] = [
  {
    id: 'autenticacao',
    order: 1,
    name: 'Autenticação e Segurança dos Acessos',
    shortName: 'Autenticação e Acessos',
    description:
      'Palavras-passe robustas, gestores de credenciais, autenticação multifator e encerramento seguro de sessões escolares.',
    colorClass: 'bg-sky-700 text-white',
    softBgClass: 'bg-sky-50 dark:bg-sky-950/50',
    borderClass: 'border-sky-200 dark:border-sky-800/80',
    textClass: 'text-sky-800 dark:text-sky-300',
    barClass: 'bg-sky-600 dark:bg-sky-500',
    iconName: 'key',
  },
  {
    id: 'engenharia-social',
    order: 2,
    name: 'Engenharia Social e Ameaças Digitais',
    shortName: 'Engenharia Social',
    description:
      'Identificação de phishing, smishing, anexos perigosos, falsos avisos técnicos e táticas de manipulação.',
    colorClass: 'bg-amber-700 text-white',
    softBgClass: 'bg-amber-50 dark:bg-amber-950/50',
    borderClass: 'border-amber-200 dark:border-amber-800/80',
    textClass: 'text-amber-900 dark:text-amber-300',
    barClass: 'bg-amber-600 dark:bg-amber-500',
    iconName: 'shield-alert',
  },
  {
    id: 'privacidade',
    order: 3,
    name: 'Privacidade e Proteção de Dados',
    shortName: 'Privacidade e Dados',
    description:
      'Dados pessoais, direito à imagem de colegas e docentes, permissões de aplicações e partilha responsável.',
    colorClass: 'bg-emerald-700 text-white',
    softBgClass: 'bg-emerald-50 dark:bg-emerald-950/50',
    borderClass: 'border-emerald-200 dark:border-emerald-800/80',
    textClass: 'text-emerald-900 dark:text-emerald-300',
    barClass: 'bg-emerald-600 dark:bg-emerald-500',
    iconName: 'user-check',
  },
  {
    id: 'equipamentos-redes',
    order: 4,
    name: 'Segurança de Equipamentos e Redes Escolares',
    shortName: 'Equipamentos e Redes',
    description:
      'Atualizações de sistema, bloqueio de ecrã, computadores partilhados, redes Wi-Fi abertas e cuidados com pens USB.',
    colorClass: 'bg-indigo-700 text-white',
    softBgClass: 'bg-indigo-50 dark:bg-indigo-950/50',
    borderClass: 'border-indigo-200 dark:border-indigo-800/80',
    textClass: 'text-indigo-900 dark:text-indigo-300',
    barClass: 'bg-indigo-600 dark:bg-indigo-500',
    iconName: 'laptop',
  },
  {
    id: 'informacao-incidentes',
    order: 5,
    name: 'Proteção da Informação e Gestão de Incidentes',
    shortName: 'Informação e Incidentes',
    description:
      'Cópias de segurança, regra 3-2-1, deteção de sinais de alerta e comunicação de incidentes na escola.',
    colorClass: 'bg-rose-700 text-white',
    softBgClass: 'bg-rose-50 dark:bg-rose-950/50',
    borderClass: 'border-rose-200 dark:border-rose-800/80',
    textClass: 'text-rose-900 dark:text-rose-300',
    barClass: 'bg-rose-600 dark:bg-rose-500',
    iconName: 'hard-drive',
  },
];

export const DOMAIN_MAP: Record<DomainId, DomainInfo> = DOMAINS.reduce(
  (acc, domain) => {
    acc[domain.id] = domain;
    return acc;
  },
  {} as Record<DomainId, DomainInfo>,
);

export const FLASHCARDS_DECK: FlashCard[] = [
  // =========================================================================
  // DOMÍNIO 1 — Autenticação e Segurança dos Acessos (6 cartas)
  // =========================================================================
  {
    id: 'aut-01',
    domainId: 'autenticacao',
    question:
      'Precisas de criar uma nova palavra-passe para a tua conta institucional da escola. Que características a tornam realmente robusta e difícil de adivinhar?',
    answer:
      'Uma palavra-passe robusta deve ser longa (pelo menos 12 a 16 caracteres), única para cada serviço e sem dados pessoais óbvios, como o teu nome, turma ou data de nascimento. Uma boa técnica é construir uma frase-passe memorável combinando quatro ou cinco palavras não relacionadas com símbolos e números.',
    schoolTip:
      'Evita reutilizar a palavra-passe do Moodle noutras plataformas pessoais, como redes sociais ou jogos, para impedir que uma falha num site comprometa a tua conta escolar.',
  },
  {
    id: 'aut-02',
    domainId: 'autenticacao',
    question:
      'Tens dezenas de contas diferentes entre plataformas escolares, correio eletrónico e aplicações educativas. Como podes gerir palavras-passe únicas para todas sem as escrever em papel?',
    answer:
      'Deves utilizar um gestor de palavras-passe de confiança. Esta ferramenta guarda todas as tuas credenciais num cofre cifrado, gera palavras-passe aleatórias fortes e apenas te exige recordar uma única palavra-passe mestra.',
    schoolTip:
      'Nunca guardes palavras-passe em ficheiros de texto soltos no ambiente de trabalho nem em blocos de notas nos computadores partilhados da sala de aula.',
  },
  {
    id: 'aut-03',
    domainId: 'autenticacao',
    question:
      'Ao entrar no correio eletrónico escolar, o sistema pede-te a palavra-passe e, de seguida, um código temporário enviado para uma aplicação no telemóvel. Para que serve este segundo passo?',
    answer:
      'Chama-se autenticação multifator (MFA). Mesmo que um atacante descubra ou roube a tua palavra-passe, não conseguirá aceder à conta sem o segundo fator de verificação (como um código temporário ou uma chave física).',
    schoolTip:
      'Ativa sempre a autenticação multifator no teu correio eletrónico escolar e nunca partilhes nem aproves notificações de confirmação que não tenhas iniciado.',
  },
  {
    id: 'aut-04',
    domainId: 'autenticacao',
    question:
      'Um colega faltou à aula e pede-te por mensagem a tua palavra-passe do Moodle para consultar um enunciado urgente. Como deves reagir?',
    answer:
      'Nunca deves partilhar as tuas credenciais de acesso com ninguém, mesmo que seja um colega próximo ou amigo. As contas escolares são pessoais e intransmissíveis, e todas as ações realizadas dentro da plataforma ficam associadas ao teu utilizador.',
    schoolTip:
      'Se um colega precisar de um enunciado público da disciplina, envia-lhe o ficheiro ou indica-lhe que contacte o professor ou os serviços de apoio escolar, mantendo a tua conta protegida.',
  },
  {
    id: 'aut-05',
    domainId: 'autenticacao',
    question:
      'Terminaste um trabalho num computador da biblioteca escolar e estás com pressa para ir para o intervalo. Que passos são obrigatórios antes de te levantares?',
    answer:
      'Deves encerrar explicitamente a sessão em todas as plataformas abertas (Moodle, correio eletrónico, nuvem escolar) e fechar todas as janelas do navegador. Quando o navegador perguntar se desejas guardar a palavra-passe, escolhe sempre «Nunca».',
    schoolTip:
      'Em computadores partilhados, utiliza preferencialmente uma janela de navegação privada e confirma sempre que a tua conta foi totalmente encerrada antes de sair.',
  },
  {
    id: 'aut-06',
    domainId: 'autenticacao',
    question:
      'Queres entrar no portal escolar ou no Moodle a partir de casa, mas não tens o endereço guardado. Qual é a forma mais segura de aceder à página de início de sessão?',
    answer:
      'Deves digitar diretamente o endereço oficial da escola na barra do navegador ou usar um marcador previamente guardado por ti. Pesquisar rapidamente num motor de busca ou clicar em hiperligações aleatórias pode levar-te a páginas falsas criadas para capturar credenciais.',
    schoolTip:
      'Verifica sempre o endereço completo na barra do navegador e o cadeado de ligação segura (HTTPS) antes de introduzires o teu nome de utilizador e palavra-passe escolar.',
  },

  // =========================================================================
  // DOMÍNIO 2 — Engenharia Social e Ameaças Digitais (6 cartas)
  // =========================================================================
  {
    id: 'eng-01',
    domainId: 'engenharia-social',
    question:
      'Recebes um e-mail supostamente enviado pelos Serviços Administrativos da escola a pedir urgentemente a tua palavra-passe do Moodle para evitar o bloqueio da conta. Que tipo de ataque poderá ser este e como deves agir?',
    answer:
      'Trata-se de uma tentativa de phishing, uma técnica de engenharia social que usa mensagens falsas com tom de urgência para roubar credenciais. Os serviços reais da escola nunca pedem a tua palavra-passe por correio eletrónico.',
    schoolTip:
      'Nunca reveles a tua palavra-passe através de mensagens ou hiperligações recebidas por correio eletrónico. Em caso de dúvida, confirma a autenticidade do pedido diretamente na secretaria ou através de um canal oficial.',
  },
  {
    id: 'eng-02',
    domainId: 'engenharia-social',
    question:
      'Recebes uma mensagem SMS no telemóvel a dizer que o teu cartão escolar foi suspenso e que deves clicar numa hiperligação encurtada para o reativar. O que significa este ataque?',
    answer:
      'É um ataque de smishing (phishing através de mensagens SMS). Os atacantes aproveitam a ecrã reduzido do telemóvel e a pressa do utilizador para o levar a páginas fraudulentas que roubam dados pessoais ou instalam código malicioso.',
    schoolTip:
      'Não cliques em hiperligações desconhecidas recebidas por SMS nem respondas à mensagem. Apaga-a e verifica qualquer assunto sobre o cartão escolar diretamente nos serviços da escola.',
  },
  {
    id: 'eng-03',
    domainId: 'engenharia-social',
    question:
      'Alguém telefona-te ou envia-te uma mensagem numa rede social a dizer que pertence ao suporte informático escolar e precisa de instalar um programa de acesso remoto no teu computador. Como procedes?',
    answer:
      'Trata-se de pretexting (engenharia social baseada numa falsa identidade de autoridade). Uma equipa técnica escolar legítima segue procedimentos presenciais ou canais institucionais oficiais e não solicita acesso remoto inesperado através de redes sociais.',
    schoolTip:
      'Recusa qualquer pedido de acesso remoto ou partilha de códigos vindo de contactos não verificados e comunica imediatamente a situação a um professor ou à equipa de informática da escola.',
  },
  {
    id: 'eng-04',
    domainId: 'engenharia-social',
    question:
      'Chega à tua caixa de entrada um e-mail de um remetente desconhecido com o assunto «Fatura de material escolar» e um anexo comprimido (`.zip`) ou executável (`.exe`). Qual é o risco principal?',
    answer:
      'Anexos inesperados com extensões executáveis ou ficheiros comprimidos suspeitos são um dos principais veículos para propagar malware e ransomware, capazes de infetar o computador ou cifrar todos os teus trabalhos escolares.',
    schoolTip:
      'Nunca abras nem descarregues anexos que não estavas à espera de receber, mesmo que o assunto pareça urgente. Confirma sempre com o remetente por outro meio antes de abrir qualquer ficheiro.',
  },
  {
    id: 'eng-05',
    domainId: 'engenharia-social',
    question:
      'Um colega sugere-te descarregar gratuitamente de um site não oficial um programa pago de edição de vídeo para um trabalho escolar. Porque é que esta prática representa um risco grave?',
    answer:
      'Programas comerciais distribuídos gratuitamente em sites piratas contêm frequentemente malware escondido (como troianos, spyware ou adware) que rouba palavras-passe guardadas no navegador e compromete a segurança do equipamento.',
    schoolTip:
      'Usa apenas software oficial disponibilizado pela escola ou alternativas gratuitas e legítimas de código aberto descarregadas a partir dos respetivos sítios oficiais.',
  },
  {
    id: 'eng-06',
    domainId: 'engenharia-social',
    question:
      'Que sinais psicológicos comuns denunciam quase sempre uma tentativa de manipulação ou engenharia social numa mensagem digital?',
    answer:
      'Os atacantes recorrem a gatilhos emocionais como urgência extrema («tens 2 horas antes de perderes a conta»), medo de punição, promessas de prémios fáceis ou apelos falsos à autoridade de um diretor ou professor para te impedir de pensar com calma.',
    schoolTip:
      'Sempre que uma mensagem exigir uma decisão imediata ou prometer vantagens improváveis, faz uma pausa de alguns segundos, lê o endereço do remetente e confirma por um canal oficial.',
  },

  // =========================================================================
  // DOMÍNIO 3 — Privacidade e Proteção de Dados (6 cartas)
  // =========================================================================
  {
    id: 'pri-01',
    domainId: 'privacidade',
    question:
      'Vais participar num questionário ou aplicação online para uma atividade recreativa e pedem-te o número de cartão de cidadão, morada completa e contacto dos encarregados de educação. Deves preencher?',
    answer:
      'Não. O princípio da minimização de dados determina que apenas se devem fornecer os dados estritamente necessários para a finalidade legítima. Pedidos excessivos de informação pessoal aumentam o risco de roubo de identidade e fraude.',
    schoolTip:
      'Antes de introduzires dados pessoais em qualquer formulário digital, verifica quem é a entidade responsável e pede orientação a um professor caso a atividade não seja institucional.',
  },
  {
    id: 'pri-02',
    domainId: 'privacidade',
    question:
      'Tiraste uma fotografia divertida na sala de aula onde aparecem colegas e a professora ao fundo. Podes publicá-la livremente numa rede social pública?',
    answer:
      'Não. O direito à imagem e a proteção de dados exigem o consentimento explícito das pessoas fotografadas ou filmadas antes de qualquer publicação, especialmente em contexto escolar envolvendo menores e docentes.',
    schoolTip:
      'Respeita sempre a privacidade dos teus colegas e professores: nunca captes nem partilhes fotografias, vídeos ou gravações de aulas sem autorização expressa e conhecimento das regras da escola.',
  },
  {
    id: 'pri-03',
    domainId: 'privacidade',
    question:
      'Publicar fotografias com o uniforme da escola, o horário das aulas ou a localização em tempo real nas redes sociais pode afetar a tua segurança? Porquê?',
    answer:
      'Sim. A combinação de pequenos detalhes públicos — como o nome da escola, o trajeto habitual, a hora de saída e a geolocalização — permite a desconhecidos reconstruir as tuas rotinas diárias e expor a tua segurança física e digital.',
    schoolTip:
      'Desativa a geolocalização automática nas fotografias publicadas e evita divulgar horários, listas de turmas ou locais frequentados fora do círculo de pessoas de confiança.',
  },
  {
    id: 'pri-04',
    domainId: 'privacidade',
    question:
      'Acabaste de criar uma conta numa rede social ou plataforma de vídeo. Porque deves rever imediatamente as configurações de privacidade em vez de manter os valores predefinidos?',
    answer:
      'Muitas plataformas definem os perfis como públicos por defeito para maximizar o alcance. Configurar o perfil como privado permite controlar quem pode ver as tuas publicações, enviar mensagens ou encontrar o teu perfil através de motores de busca.',
    schoolTip:
      'Dedica alguns minutos a rever as definições de privacidade das tuas contas, limitando a visibilidade das publicações apenas a contactos aprovados e desativando a indexação pública.',
  },
  {
    id: 'pri-05',
    domainId: 'privacidade',
    question:
      'Instalas uma aplicação simples de calculadora ou lanterna no telemóvel e ela pede acesso aos contactos, microfone e localização exata. O que deves fazer?',
    answer:
      'Deves negar essas permissões ou desinstalar a aplicação. Quando uma aplicação solicita permissões sem qualquer relação com a sua função principal, pode estar a recolher dados pessoais abusivamente para venda ou rastreamento.',
    schoolTip:
      'Revê regularmente as permissões concedidas às aplicações no teu telemóvel e concede acesso à câmara, microfone ou localização apenas quando for indispensável e enquanto usas a aplicação.',
  },
  {
    id: 'pri-06',
    domainId: 'privacidade',
    question:
      'Recebeste uma pauta escolar, um documento com notas da turma ou o contacto de vários alunos num grupo de trabalho. Podes reencaminhar esse ficheiro para outros grupos ou publicá-lo online?',
    answer:
      'Não. Pautas, avaliações, moradas e contactos escolares contêm dados pessoais protegidos por lei. A divulgação não autorizada viola a privacidade dos colegas e pode expor informação sensível a terceiros.',
    schoolTip:
      'Partilha documentos escolares com dados pessoais apenas nos espaços institucionais autorizados e exclusivamente com os destinatários previstos pelo professor.',
  },

  // =========================================================================
  // DOMÍNIO 4 — Segurança de Equipamentos e Redes Escolares (6 cartas)
  // =========================================================================
  {
    id: 'eqp-01',
    domainId: 'equipamentos-redes',
    question:
      'O computador portátil mostra frequentemente avisos para atualizar o sistema operativo e o navegador, mas costumas adiar por falta de tempo. Porque é perigoso ignorar estas atualizações?',
    answer:
      'As atualizações corrigem vulnerabilidades de segurança recentemente descobertas que os atacantes exploram automaticamente. Adiar atualizações deixa o equipamento exposto a intrusões e software malicioso mesmo sem clicares em nada suspeito.',
    schoolTip:
      'Mantém o sistema operativo, o antivírus e o navegador sempre atualizados e reinicia o equipamento quando necessário para aplicar as correções de segurança.',
  },
  {
    id: 'eqp-02',
    domainId: 'equipamentos-redes',
    question:
      'Estás a trabalhar no teu portátil ou num computador da sala de informática e precisas de ir falar com o professor ao fundo da sala durante dois minutos. O que deves fazer antes de sair do lugar?',
    answer:
      'Deves bloquear imediatamente o ecrã (por exemplo, com `Win + L` no Windows ou o atalho de bloqueio equivalente). Mesmo uma ausência muito curta permite que alguém consulte os teus ficheiros, envie mensagens em teu nome ou altere configurações.',
    schoolTip:
      'Cria o hábito automático de bloquear o ecrã sempre que te afastas do computador, mesmo que seja apenas por alguns segundos dentro da sala de aula.',
  },
  {
    id: 'eqp-03',
    domainId: 'equipamentos-redes',
    question:
      'Ao utilizar um computador partilhado da escola, guardaste um trabalho no ambiente de trabalho e deixaste a tua conta da nuvem ligada. Que riscos existem para ti e para os próximos utilizadores?',
    answer:
      'Qualquer aluno que utilize o computador a seguir terá acesso direto aos teus documentos, poderá apagar trabalhos, alterar conteúdos ou enviar mensagens usando a tua conta aberta.',
    schoolTip:
      'Guarda os teus trabalhos na tua pen pessoal ou na nuvem escolar, apaga cópias temporárias deixadas no computador partilhado e encerra todas as sessões no final da aula.',
  },
  {
    id: 'eqp-04',
    domainId: 'equipamentos-redes',
    question:
      'Precisas de consultar o correio eletrónico escolar enquanto esperas num café ou centro comercial e encontras uma rede Wi-Fi gratuita sem palavra-passe. Que cuidados deves ter?',
    answer:
      'Redes Wi-Fi públicas e abertas permitem que terceiros ligados à mesma rede intercetem tráfego não cifrado ou criem pontos de acesso falsos. Evita iniciar sessão em contas sensíveis ou enviar dados confidenciais nessas redes.',
    schoolTip:
      'Dá preferência à rede Wi-Fi autenticada da escola ou aos dados móveis do teu telemóvel quando precisares de aceder ao Moodle, correio institucional ou plataformas com credenciais.',
  },
  {
    id: 'eqp-05',
    domainId: 'equipamentos-redes',
    question:
      'Encontraste uma pen USB esquecida no corredor da escola e pensas ligá-la a um computador da sala para ver a quem pertence. Esta ação é segura?',
    answer:
      'Não. Ligar uma pen USB de origem desconhecida é um risco clássico de segurança: o dispositivo pode conter malware que se executa ou propaga assim que é ligado, podendo comprometer o computador e toda a rede escolar.',
    schoolTip:
      'Nunca ligues dispositivos USB encontrados ou de origem duvidosa. Entrega qualquer pen USB perdida na secretaria, na portaria ou a um professor.',
  },
  {
    id: 'eqp-06',
    domainId: 'equipamentos-redes',
    question:
      'Ao pesquisar imagens ou documentos para um trabalho escolar, surge uma janela pop-up a dizer que o teu computador tem 5 vírus e precisa de descarregar uma ferramenta de limpeza urgente. O que é isto?',
    answer:
      'É um falso alerta conhecido como scareware. O objetivo é assustar-te para que descarregues e executes um ficheiro que, na realidade, contém malware ou software indesejado.',
    schoolTip:
      'Fecha imediatamente a janela ou separador do navegador sem clicar em nenhum botão do aviso. Se o separador bloquear, usa o gestor de tarefas ou pede ajuda ao professor.',
  },

  // =========================================================================
  // DOMÍNIO 5 — Proteção da Informação e Gestão de Incidentes (6 cartas)
  // =========================================================================
  {
    id: 'inf-01',
    domainId: 'informacao-incidentes',
    question:
      'Faltam dois dias para entregar o projeto final da disciplina e todos os ficheiros estão guardados apenas no disco do portátil. Porque é arriscado não ter cópias de segurança?',
    answer:
      'Avarias de disco, perda ou roubo do equipamento, eliminação acidental ou um ataque de ransomware podem destruir meses de trabalho num instante. Sem uma cópia de segurança atualizada, a recuperação torna-se impossível ou muito difícil.',
    schoolTip:
      'Guarda cópias de segurança regulares dos teus trabalhos escolares importantes, especialmente antes de prazos de entrega ou momentos de avaliação.',
  },
  {
    id: 'inf-02',
    domainId: 'informacao-incidentes',
    question:
      'Em que consiste a regra 3-2-1 das cópias de segurança, aplicada aos teus trabalhos e projetos escolares?',
    answer:
      'Significa manter 3 cópias dos teus ficheiros importantes (o original mais duas cópias), guardadas em 2 suportes diferentes (por exemplo, no portátil e numa pen ou disco externo), mantendo pelo menos 1 cópia num local separado ou na nuvem escolar.',
    schoolTip:
      'Combina o armazenamento no teu computador com a nuvem institucional e uma pen USB guardada em casa: assim, mesmo que um dispositivo falhe, o teu trabalho continua protegido.',
  },
  {
    id: 'inf-03',
    domainId: 'informacao-incidentes',
    question:
      'Quais são os principais sinais de alerta de que uma conta escolar ou computador pode ter sido comprometido?',
    answer:
      'Sinais comuns incluem: mensagens enviadas sem o teu conhecimento, início de sessão em locais ou horários estranhos, ficheiros renomeados ou inacessíveis, lentidão súbita com janelas desconhecidas, ou alterações inesperadas na palavra-passe.',
    schoolTip:
      'Se notares comportamentos anómalos na tua conta ou equipamento, não tentes esconder nem apagar registos apressadamente: para o que estás a fazer e procura ajuda técnica.',
  },
  {
    id: 'inf-04',
    domainId: 'informacao-incidentes',
    question:
      'Clicaste por engano numa hiperligação suspeita e introduziste a tua palavra-passe escolar antes de perceberes que a página era falsa. Qual deve ser a tua reação imediata?',
    answer:
      'Deves alterar imediatamente a palavra-passe afetada a partir de um dispositivo seguro (e em qualquer outra conta onde tenhas usado a mesma palavra-passe), encerrar sessões ativas e comunicar o incidente sem demora.',
    schoolTip:
      'Agir nos primeiros minutos reduz drasticamente o impacto do incidente. Comunica logo o sucedido para que a conta possa ser verificada e protegida.',
  },
  {
    id: 'inf-05',
    domainId: 'informacao-incidentes',
    question:
      'Num computador da sala de informática surge um aviso suspeito ou notas que alguém acedeu à tua conta escolar. A quem deves comunicar este incidente de segurança na escola?',
    answer:
      'Deves informar imediatamente o professor presente na sala, o teu diretor de turma, a equipa de informática da escola ou a direção escolar, consoante a situação e os canais internos definidos pelo agrupamento.',
    schoolTip:
      'Comunicar rapidamente um erro ou clique suspeito é uma atitude responsável que protege não só a tua conta, mas também os equipamentos e colegas de toda a escola.',
  },
  {
    id: 'inf-06',
    domainId: 'informacao-incidentes',
    question:
      'Um ficheiro na tua pen USB da escola mudou subitamente de nome para caracteres estranhos e apareceu um documento de texto a pedir dinheiro para recuperar os dados. O que está a acontecer e o que deves fazer?',
    answer:
      'É um sinal típico de ransomware, um tipo de malware que cifra ficheiros para exigir resgate. Nunca deves pagar o resgate; deves desligar o computador da rede, retirar o equipamento de circulação e reportar de imediato aos responsáveis técnicos.',
    schoolTip:
      'A melhor defesa contra o ransomware são as cópias de segurança isoladas (regra 3-2-1): desliga o computador afetado da rede escolar e avisa imediatamente o professor ou a equipa de informática.',
  },
];
