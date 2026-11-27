export interface SecretaraItem {
  id: string;
  number: number;
  title: string;
  shortTitle: string;
  theme: string;
  x: number; // percentage of image width
  y: number; // percentage of image height
  w: number; // percentage width box
  h: number; // percentage height box
  zIndex?: number;
  risk: string;
  consequences: string;
  bestPractices: string[];
  tools: string[];
  audioSummary: string;
}

export interface SecretariaQuizQuestion {
  id: number;
  tema: string;
  relatedItemId: string;
  pergunta: string;
  opcoes: [string, string, string, string];
  respostaCorreta: number;
  explicacao: string;
  recomendacao: string;
}

export const SECRETARIA_ITEMS: SecretaraItem[] = [
  {
    id: 'router',
    number: 1,
    title: 'Router Wi-Fi',
    shortTitle: 'Router Wi-Fi',
    theme: 'Segurança de redes',
    x: 2,
    y: 4,
    w: 19,
    h: 35,
    zIndex: 10,
    risk: 'Utilização de palavras-passe de fábrica, configurações inseguras e firmware desatualizado.',
    consequences:
      'Interceção de tráfego de rede, acesso não autorizado à rede doméstica ou escolar e exploração de vulnerabilidades conhecidas no equipamento.',
    bestPractices: [
      'Alterar imediatamente as credenciais de administração predefinidas de fábrica.',
      'Configurar a rede sem fios com os protocolos de cifra WPA2 ou WPA3.',
      'Atualizar regularmente o firmware do router para corrigir falhas de segurança.',
      'Evitar aceder a plataformas escolares em redes Wi-Fi públicas abertas; preferir a partilha de dados do telemóvel ou uma VPN.',
    ],
    tools: ['WPA3 / WPA2-AES', 'Painel de Administração do Router', 'Partilha de dados / VPN'],
    audioSummary:
      'Um router Wi-Fi com credenciais de fábrica, configurações inseguras ou firmware desatualizado facilita a entrada de terceiros na rede e a interceção do trabalho docente. Altere as credenciais de administração predefinidas, utilize cifra WPA2 ou WPA3 e evite redes públicas abertas ao aceder a plataformas escolares.',
  },
  {
    id: 'laptop',
    number: 2,
    title: 'Computador Portátil com Sessão Desbloqueada',
    shortTitle: 'Portátil Desbloqueado',
    theme: 'Controlo de acessos e cifra',
    x: 31.5,
    y: 11.5,
    w: 33.8,
    h: 27,
    zIndex: 10,
    risk: 'Acesso não autorizado à sessão ativa, documentos locais e plataformas escolares durante a ausência do professor.',
    consequences:
      'Consulta ou alteração indevida de classificações, envio de mensagens em nome do docente e comprometimento de ficheiros em caso de furto.',
    bestPractices: [
      'Bloquear sempre a sessão ao levantar-se com Windows + L (ou Control + Command + Q no macOS).',
      'Configurar o bloqueio automático do ecrã após poucos minutos de inatividade.',
      'Manter o sistema operativo e todas as aplicações atualizadas.',
      'Confirmar a proteção ativa de antivírus, como o Microsoft Defender.',
      'Ativar a cifra integral do disco através do BitLocker ou da Encriptação do dispositivo.',
      'Efetuar cópias de segurança regulares seguindo a regra 3-2-1.',
    ],
    tools: [
      'Windows + L',
      'Bloqueio automático',
      'Microsoft Defender',
      'BitLocker / Encriptação do dispositivo',
      'Cópias de segurança 3-2-1',
    ],
    audioSummary:
      'Deixar o computador portátil com a sessão desbloqueada permite que terceiros acedam imediatamente às plataformas escolares e a ficheiros sensíveis durante uma breve ausência. Bloqueie sempre a sessão com Windows + L ao levantar-se, ative o bloqueio automático e assegure a cifra do disco com BitLocker ou Encriptação do dispositivo.',
  },
  {
    id: 'postit',
    number: 3,
    title: 'Nota Adesiva com Credenciais de Acesso',
    shortTitle: 'Post-it com Credenciais',
    theme: 'Gestão de credenciais e MFA',
    x: 65.5,
    y: 15,
    w: 7,
    h: 15.5,
    zIndex: 30,
    risk: 'Exposição direta de nomes de utilizador e palavras-passe, frequentemente agravada pela reutilização da mesma senha noutros serviços.',
    consequences:
      'Apropriação imediata de contas institucionais e pessoais por colegas, alunos ou visitantes que passem pela secretária.',
    bestPractices: [
      'Nunca registar nomes de utilizador ou palavras-passe em post-its ou papéis junto ao ecrã.',
      'Criar palavras-passe longas, robustas e distintas para cada serviço.',
      'Utilizar um gestor de palavras-passe seguro, como o KeePassXC ou o Bitwarden.',
      'Ativar a autenticação multifator (MFA) em todas as contas escolares e pessoais.',
    ],
    tools: ['KeePassXC', 'Bitwarden', 'Autenticação Multifator (MFA)'],
    audioSummary:
      'Anotar o nome de utilizador e a palavra-passe numa nota adesiva junto ao ecrã expõe diretamente as contas escolares do professor a qualquer pessoa na sala, agravado pela reutilização de senhas. Retire os registos em papel, utilize um gestor como o KeePassXC ou o Bitwarden com senhas distintas e ative a autenticação multifator.',
  },
  {
    id: 'badge',
    number: 4,
    title: 'Cartão de Identificação do Professor',
    shortTitle: 'Cartão de Identificação',
    theme: 'Segurança física e engenharia social',
    x: 29.5,
    y: 41.5,
    w: 9,
    h: 16.5,
    zIndex: 20,
    risk: 'Exposição indevida de dados pessoais e profissionais, risco de usurpação de identidade e facilitação de engenharia social.',
    consequences:
      'Utilização abusiva da identidade do docente ou entrada indevida em espaços reservados da escola, caso o cartão possua controlo de acessos.',
    bestPractices: [
      'Guardar o cartão de identificação num local seguro e discreto quando não estiver a ser usado.',
      'Evitar deixá-lo pousado à vista em zonas comuns ou fotografá-lo em redes sociais.',
      'Comunicar de imediato aos serviços do agrupamento qualquer situação de perda ou furto para desativação.',
    ],
    tools: ['Guarda física segura', 'Comunicação imediata ao Agrupamento'],
    audioSummary:
      'O cartão de identificação deixado à vista expõe dados pessoais e profissionais do docente, facilitando tentativas de engenharia social, usurpação de identidade ou acesso físico indevido às instalações. Guarde o cartão num local seguro quando não o estiver a utilizar e comunique de imediato qualquer perda ou furto.',
  },
  {
    id: 'papers',
    number: 5,
    title: 'Documentos Impressos com Dados Pessoais e Classificações',
    shortTitle: 'Documentos e Pautas em Papel',
    theme: 'RGPD e política de secretária limpa',
    x: 6,
    y: 45,
    w: 22.5,
    h: 46,
    zIndex: 10,
    risk: 'Acesso não autorizado a pautas, testes, relatórios e dados pessoais e confidenciais dos alunos em suporte físico.',
    consequences:
      'Violação do RGPD, exposição pública de avaliações e dados sensíveis de menores e eventual responsabilização disciplinar ou legal.',
    bestPractices: [
      'Aplicar os princípios de confidencialidade e minimização de dados previstos no RGPD.',
      'Adotar uma política de secretária limpa (Clean Desk Policy) sempre que se ausenta da mesa.',
      'Armazenar pautas, testes e processos individuais em armários fechados à chave.',
      'Proceder à destruição segura (trituradora de papel) de documentos que já não necessitem de conservação.',
    ],
    tools: ['Clean Desk Policy', 'Armários fechados à chave', 'Destruidora de documentos'],
    audioSummary:
      'Pautas, testes e relatórios deixados sobre a secretária violam os princípios de confidencialidade e minimização de dados do RGPD, expondo informação pessoal dos alunos. Adote uma política de secretária limpa, guarde os documentos em armários fechados à chave e destrua com segurança o que já não necessitar.',
  },
  {
    id: 'notebook',
    number: 6,
    title: 'Caderno Aberto com Informação Confidencial e Credenciais',
    shortTitle: 'Caderno Confidencial',
    theme: 'Proteção de registos e credenciais',
    x: 73,
    y: 11,
    w: 23.5,
    h: 37,
    zIndex: 10,
    risk: 'Registo inseguro em papel de palavras-passe, códigos de autenticação e dados pessoais ou classificações de alunos.',
    consequences:
      'Acesso indevido, perda, furto ou reprodução rápida por fotografia dos dados anotados sem qualquer mecanismo de cifra.',
    bestPractices: [
      'Substituir o registo manuscrito de credenciais por um gestor de palavras-passe cifrado.',
      'Evitar manter cadernos com informações confidenciais abertos sobre a secretária.',
      'Guardar registos físicos indispensáveis em local seguro, respeitando os procedimentos do agrupamento de escolas.',
    ],
    tools: ['Gestor de palavras-passe', 'Procedimentos do Agrupamento', 'Arquivo fechado'],
    audioSummary:
      'Um caderno aberto com palavras-passe manuscritas e classificações de alunos fica vulnerável a leitura indevida, fotografia não autorizada, extravio ou furto sem qualquer proteção digital. Substitua o registo de credenciais em papel por um gestor de palavras-passe e proteja a informação segundo os procedimentos do agrupamento.',
  },
  {
    id: 'phone',
    number: 7,
    title: 'Smartphone Desbloqueado',
    shortTitle: 'Smartphone Desbloqueado',
    theme: 'Segurança móvel e autenticação',
    x: 70.2,
    y: 48.5,
    w: 9.2,
    h: 24.5,
    zIndex: 15,
    risk: 'Acesso não autorizado a mensagens, correio eletrónico institucional, aplicações escolares e códigos de autenticação.',
    consequences:
      'Leitura de comunicações privadas, compromisso da conta escolar por acesso ao segundo fator e vulnerabilidade a fraudes.',
    bestPractices: [
      'Configurar um PIN robusto, palavra-passe ou autenticação biométrica no desbloqueio.',
      'Definir um tempo curto para o bloqueio automático do ecrã.',
      'Manter o sistema operativo e as aplicações móveis permanentemente atualizados.',
      'Utilizar aplicações dedicadas de autenticação multifator, como Microsoft Authenticator ou Google Authenticator.',
      'Ativar as funções de localização, bloqueio e eliminação remota de dados em caso de perda.',
      'Desconfiar de mensagens fraudulentas (smishing) e de códigos QR de origem duvidosa.',
    ],
    tools: [
      'PIN robusto / Biometria',
      'Microsoft / Google Authenticator',
      'Localização e limpeza remota',
      'Proteção contra smishing',
    ],
    audioSummary:
      'Um smartphone desbloqueado sobre a secretária dá acesso direto a correio eletrónico institucional, mensagens, aplicações escolares e códigos de autenticação multifator. Proteja o equipamento com PIN robusto ou biometria, ative o bloqueio automático e a localização remota e desconfie de SMS fraudulentas ou códigos QR suspeitos.',
  },
  {
    id: 'usb',
    number: 8,
    title: 'Dispositivo de Armazenamento USB',
    shortTitle: 'Dispositivo USB',
    theme: 'Armazenamento amovível e malware',
    x: 77,
    y: 68.5,
    w: 8,
    h: 19.5,
    zIndex: 25,
    risk: 'Perda ou furto de dispositivos com informação escolar confidencial e risco de propagação de malware por pens desconhecidas.',
    consequences:
      'Fuga de dados pessoais de alunos em caso de extravio ou infeção do computador escolar ao ligar suportes externos não verificados.',
    bestPractices: [
      'Proteger sempre ficheiros sensíveis com cifra antes de os copiar para uma pen USB.',
      'Utilizar o 7-Zip em formato .7z com algoritmo AES-256 e opção de cifra dos nomes dos ficheiros.',
      'Criar contentores cifrados com VeraCrypt (quando autorizado e instalado) ou usar BitLocker To Go em edições compatíveis do Windows.',
      'Nunca ligar dispositivos USB de origem desconhecida ao computador da escola ou pessoal.',
      'Enviar a palavra-passe de ficheiros cifrados por um canal de comunicação distinto daquele onde enviou o ficheiro.',
    ],
    tools: ['7-Zip (.7z AES-256)', 'VeraCrypt', 'BitLocker To Go', 'Canal distinto para senhas'],
    audioSummary:
      'Transportar informação escolar numa pen USB sem cifra arrisca a fuga de dados confidenciais em caso de perda ou furto, enquanto ligar pens desconhecidas pode propagar malware. Cifre os ficheiros com 7-Zip em .7z (AES-256), VeraCrypt ou BitLocker To Go, nunca ligue dispositivos desconhecidos e envie senhas por um canal distinto.',
  },
];

export const QUESTIONARIO_ESTACAO_2: SecretariaQuizQuestion[] = [
  {
    id: 1,
    tema: 'Controlo de acessos e bloqueio',
    relatedItemId: 'laptop',
    pergunta:
      'Qual é a medida imediata mais eficaz a adotar ao afastar-se do portátil escolar durante uma pausa?',
    opcoes: [
      'Bloquear a sessão utilizando a combinação de teclas Windows + L.',
      'Desligar apenas o ecrã mantendo a sessão aberta.',
      'Deixar os documentos abertos para retomar o trabalho mais depressa.',
      'Minimizar as janelas para o ambiente de trabalho ficar vazio.',
    ],
    respostaCorreta: 0,
    explicacao:
      'Bloquear a sessão com Windows + L (ou Control + Command + Q no macOS) impede de imediato que terceiros acedam às plataformas escolares e aos ficheiros abertos.',
    recomendacao:
      'Rever boas práticas de bloqueio de sessão e cifra do portátil (Elemento 2).',
  },
  {
    id: 2,
    tema: 'Gestão de credenciais',
    relatedItemId: 'postit',
    pergunta:
      'Porque representa um risco grave colar uma nota adesiva com palavras-passe junto ao ecrã do computador?',
    opcoes: [
      'Porque reduz a duração da bateria do computador portátil.',
      'Porque impede o funcionamento correto do antivírus instalado.',
      'Porque expõe as credenciais a qualquer pessoa na sala, potenciando acessos indevidos às contas.',
      'Porque bloqueia as atualizações automáticas do sistema operativo.',
    ],
    respostaCorreta: 2,
    explicacao:
      'Credenciais visíveis em papel podem ser lidas ou fotografadas em segundos, comprometendo tanto a conta escolar como outros serviços onde a mesma palavra-passe tenha sido reutilizada.',
    recomendacao:
      'Substituir notas adesivas por gestores de palavras-passe como KeePassXC ou Bitwarden e ativar MFA (Elemento 3).',
  },
  {
    id: 3,
    tema: 'Gestão de credenciais e MFA',
    relatedItemId: 'postit',
    pergunta:
      'Que solução tecnológica permite guardar palavras-passe longas, robustas e únicas para cada serviço sem depender de papéis ou memória?',
    opcoes: [
      'Um ficheiro de texto simples guardado no ambiente de trabalho.',
      'A repetição da mesma palavra-passe fácil em todas as plataformas.',
      'Um caderno aberto na mesa da sala dos professores.',
      'Um gestor de palavras-passe seguro, como o KeePassXC ou o Bitwarden.',
    ],
    respostaCorreta: 3,
    explicacao:
      'Os gestores de palavras-passe armazenam credenciais únicas e complexas num cofre cifrado, protegido por uma única palavra-passe mestra.',
    recomendacao:
      'Adotar o KeePassXC ou o Bitwarden para eliminar o registo de credenciais em papel (Elementos 3 e 6).',
  },
  {
    id: 4,
    tema: 'RGPD e proteção documental',
    relatedItemId: 'papers',
    pergunta:
      'À luz do RGPD, como devem ser tratados os documentos impressos com pautas, testes e dados pessoais dos alunos?',
    opcoes: [
      'Mantidos em cima da secretária para consulta rápida durante o intervalo.',
      'Protegidos com política de secretária limpa, guardados em armários fechados e destruídos em segurança quando deixarem de ser necessários.',
      'Colocados diretamente no caixote do papel comum sem rasgar nem triturar.',
      'Partilhados por fotografia em grupos informais para agilizar reuniões.',
    ],
    respostaCorreta: 1,
    explicacao:
      'O RGPD aplica-se igualmente ao formato em papel, exigindo confidencialidade, minimização de dados, armazenamento fechado à chave e destruição segura.',
    recomendacao:
      'Aplicar a política de secretária limpa (Clean Desk Policy) e o armazenamento seguro de pautas (Elemento 5).',
  },
  {
    id: 5,
    tema: 'Segurança de dispositivos USB',
    relatedItemId: 'usb',
    pergunta:
      'Como deve agir um professor se encontrar uma pen USB de origem desconhecida no espaço escolar?',
    opcoes: [
      'Ligá-la ao computador portátil pessoal para tentar descobrir o proprietário.',
      'Formatá-la imediatamente num computador da sala de professores.',
      'Nunca a ligar a qualquer equipamento e entregá-la ao responsável de TIC do agrupamento.',
      'Testá-la num computador da biblioteca antes de a usar na aula.',
    ],
    respostaCorreta: 2,
    explicacao:
      'Dispositivos USB desconhecidos podem propagar malware ou atuar como dispositivos maliciosos ao serem ligados; a única ação segura é não os ligar.',
    recomendacao:
      'Consolidar as regras de prevenção contra dispositivos USB desconhecidos e malware (Elemento 8).',
  },
  {
    id: 6,
    tema: 'Cifra do equipamento',
    relatedItemId: 'laptop',
    pergunta:
      'Qual é a função principal da cifra do disco (como BitLocker ou Encriptação do dispositivo) num portátil docente?',
    opcoes: [
      'Impedir que terceiros leiam os ficheiros do disco interno caso o portátil seja furtado ou perdido.',
      'Aumentar a velocidade da ligação sem fios na sala de aula.',
      'Substituir a necessidade de fazer cópias de segurança periódicas.',
      'Bloquear automaticamente notificações durante uma projeção.',
    ],
    respostaCorreta: 0,
    explicacao:
      'Sem cifra do disco, alguém com acesso físico ao equipamento pode retirar o disco ou arrancar outro sistema para ler todos os ficheiros, mesmo sem saber a palavra-passe do utilizador.',
    recomendacao:
      'Verificar se o disco do portátil tem BitLocker ou Encriptação do dispositivo ativa (Elemento 2).',
  },
  {
    id: 7,
    tema: 'Segurança de redes Wi-Fi',
    relatedItemId: 'router',
    pergunta:
      'Que conjunto de medidas reforça a segurança de um router Wi-Fi usado para trabalho docente?',
    opcoes: [
      'Manter a palavra-passe de fábrica para facilitar o suporte técnico.',
      'Desativar a cifra sem fios para melhorar o alcance do sinal.',
      'Partilhar a palavra-passe de administração com todos os visitantes.',
      'Alterar as credenciais de administração predefinidas, usar WPA2 ou WPA3 e atualizar regularmente o firmware.',
    ],
    respostaCorreta: 3,
    explicacao:
      'Mudar as credenciais predefinidas, configurar WPA2/WPA3 e manter o firmware atualizado reduz o risco de intrusões e interceção de tráfego.',
    recomendacao:
      'Rever as configurações recomendadas para o router Wi-Fi e cuidados em redes públicas (Elemento 1).',
  },
  {
    id: 8,
    tema: 'Segurança móvel e MFA',
    relatedItemId: 'phone',
    pergunta:
      'Além de proteger o smartphone com PIN robusto ou biometria, porque se recomenda usar uma aplicação de autenticação (Microsoft ou Google Authenticator)?',
    opcoes: [
      'Porque elimina a necessidade de usar palavras-passe nas plataformas da escola.',
      'Porque acrescenta um segundo fator de verificação, impedindo o acesso mesmo que a palavra-passe seja descoberta.',
      'Porque corrige automaticamente vulnerabilidades em páginas web externas.',
      'Porque encripta todos os documentos impressos guardados na pasta.',
    ],
    respostaCorreta: 1,
    explicacao:
      'A autenticação multifator exige um código temporário ou aprovação no dispositivo pessoal, travando a maioria dos ataques de roubo de credenciais.',
    recomendacao:
      'Ativar autenticação multifator, bloqueio automático e localização remota no smartphone (Elemento 7).',
  },
  {
    id: 9,
    tema: 'Proteção de ficheiros em USB',
    relatedItemId: 'usb',
    pergunta:
      'Ao transportar dados confidenciais numa pen USB ou ao enviá-los em ficheiro .7z cifrado com 7-Zip (AES-256), como deve transmitir a palavra-passe ao destinatário?',
    opcoes: [
      'Através de um canal de comunicação distinto daquele usado para enviar o ficheiro.',
      'No próprio nome do ficheiro para não haver esquecimentos.',
      'No mesmo email em que segue o ficheiro cifrado em anexo.',
      'Num ficheiro de texto gravado na raiz da própria pen USB.',
    ],
    respostaCorreta: 0,
    explicacao:
      'Enviar a palavra-passe por um canal separado (por exemplo, chamada ou SMS quando o ficheiro seguiu por email) evita que a interceção de um único canal comprometa o conteúdo cifrado.',
    recomendacao:
      'Praticar a cifra de ficheiros com 7-Zip (AES-256), VeraCrypt ou BitLocker To Go e envio por canal distinto (Elemento 8).',
  },
  {
    id: 10,
    tema: 'Segurança física e identidade',
    relatedItemId: 'badge',
    pergunta:
      'Que cuidado essencial deve ter o professor com o seu cartão de identificação profissional?',
    opcoes: [
      'Deixá-lo visível na secretária da sala comum durante todo o dia.',
      'Partilhar fotografias do cartão com código e número funcional em redes sociais.',
      'Guardá-lo num local seguro quando não está em uso e comunicar de imediato qualquer perda ou furto.',
      'Emprestá-lo a terceiros para abrir portas de áreas reservadas.',
    ],
    respostaCorreta: 2,
    explicacao:
      'A exposição ou perda do cartão pode facilitar engenharia social, usurpação de identidade e acessos físicos indevidos se o cartão controlar portas ou portões.',
    recomendacao:
      'Manter o cartão de identificação guardado em segurança e reportar de imediato perdas ou furtos (Elemento 4).',
  },
];
