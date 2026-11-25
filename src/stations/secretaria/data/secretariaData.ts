export interface SecretaraItem {
  id: string;
  number: number;
  title: string;
  shortTitle: string;
  x: number; // percentage width
  y: number; // percentage height
  w: number; // percentage width box
  h: number; // percentage height box
  risk: string;
  consequences: string;
  bestPractices: string[];
  tools: string[];
  speechText: string;
}

export const SECRETARIA_ITEMS: SecretaraItem[] = [
  {
    id: 'router',
    number: 1,
    title: 'Router Wi-Fi',
    shortTitle: 'Router Wi-Fi',
    x: 12,
    y: 18,
    w: 16,
    h: 22,
    risk: 'Riscos associados a palavras-passe de fábrica, configurações inseguras e firmware desatualizado.',
    consequences: 'Interceção de tráfego de rede, acesso não autorizado à rede escolar/doméstica e exploração de vulnerabilidades conhecidas do router.',
    bestPractices: [
      'Alterar imediatamente as credenciais de administração predefinidas.',
      'Utilizar protocolos de cifra robustos WPA2 ou WPA3.',
      'Atualizar regularmente o firmware do equipamento.',
      'Evitar a ligação a redes Wi-Fi públicas abertas sem VPN para aceder a plataformas sensíveis.',
    ],
    tools: ['WPA3 / WPA2-AES', 'Painel de Administração do Router', 'Rede Privada Virtual (VPN)'],
    speechText:
      'Sou o router Wi-Fi. Se mantiver as credenciais de fábrica e o firmware desatualizado, qualquer utilizador mal-intencionado pode aceder à rede e intercetar comunicações. Altere a palavra-passe de administração, utilize WPA2 ou WPA3 e atualize o firmware regularmente. Fora de escola, evite redes públicas abertas.',
  },
  {
    id: 'laptop',
    number: 2,
    title: 'Computador Portátil com Sessão Desbloqueada',
    shortTitle: 'Portátil Desbloqueado',
    x: 35,
    y: 15,
    w: 32,
    h: 55,
    risk: 'Acesso não autorizado à informação e às plataformas escolares durante a ausência do docente.',
    consequences: 'Compromisso total de dados pessoais e de alunos, envio de mensagens em nome do professor e acesso indevido a aplicações institucionais.',
    bestPractices: [
      'Bloquear sempre a sessão ao afastar-se da secretária (Windows + L ou Control + Command + Q no macOS).',
      'Configurar o bloqueio automático de ecrã por inatividade.',
      'Manter o sistema operativo e as aplicações atualizadas.',
      'Garantir a cifra do disco com BitLocker ou Encriptação do dispositivo.',
      'Realizar cópias de segurança regulares seguindo a regra 3-2-1.',
    ],
    tools: ['Windows + L / FileVault', 'Microsoft Defender', 'BitLocker / Encriptação do Dispositivo', 'Windows Update'],
    speechText:
      'Sou o portátil do professor, e estou com a sessão desbloqueada. Basta um momento de ausência para que alguém aceda a dados confidenciais. Bloqueie sempre o ecrã com Windows mais L antes de se levantar. Ative o bloqueio automático, mantenha o sistema atualizado e assegure que o disco está cifrado com BitLocker.',
  },
  {
    id: 'postit',
    number: 3,
    title: 'Nota Adesiva com Credenciais de Acesso',
    shortTitle: 'Post-it com Palavra-passe',
    x: 65,
    y: 16,
    w: 12,
    h: 16,
    risk: 'Exposição direta de nomes de utilizador e palavras-passe à vista de qualquer visitante ou colega.',
    consequences: 'Utilização indevida das credenciais institucionais, acesso não autorizado ao email e às plataformas pedagógicas.',
    bestPractices: [
      'Nunca registar palavras-passe em papel ou notas adesivas.',
      'Utilizar palavras-passe longas, robustas e distintas para cada serviço.',
      'Adotar um gestor de palavras-passe credenciado, como o KeePassXC ou o Bitwarden.',
      'Ativar a autenticação multifator (MFA) em todas as contas.',
    ],
    tools: ['KeePassXC (local e aberto)', 'Bitwarden', 'Autenticação Multifator (MFA)'],
    speechText:
      'Sou a nota adesiva colada no ecrã com a palavra-passe escrita à mão. Estou totalmente exposta a quem entrar na sala. Nunca aponte credenciais em papel. Utilize um gestor de palavras-passe como o KeePassXC ou o Bitwarden para guardar credenciais únicas e seguras, e memorize apenas a palavra-passe mestra.',
  },
  {
    id: 'badge',
    number: 4,
    title: 'Cartão de Identificação do Professor',
    shortTitle: 'Cartão de Identificação',
    x: 29,
    y: 38,
    w: 10,
    h: 18,
    risk: 'Exposição indevida de dados pessoais e profissionais e riscos de engenharia social.',
    consequences: 'Usurpação de identidade, facilitação de acesso físico não autorizado às instalações escolares caso possua chip RFID.',
    bestPractices: [
      'Guardar o cartão de identificação num local seguro quando não estiver em uso.',
      'Não exibir o cartão fora do recinto escolar de forma desnecessária.',
      'Comunicar imediatamente aos serviços administrativos e de TIC a perda ou furto do cartão.',
    ],
    tools: ['Controlo de Acessos Físicos', 'Serviços Administrativos do Agrupamento'],
    speechText:
      'Sou o cartão de identificação profissional. Deixado à vista na mesa, revela o seu nome e cargo, podendo facilitar tentativas de engenharia social ou acesso físico indevido caso inclua chip de portas. Mantenha-o seguro e comunique de imediato qualquer perda.',
  },
  {
    id: 'papers',
    number: 5,
    title: 'Documentos Impressos com Dados Pessoais',
    shortTitle: 'Documentos em Papel e Pautas',
    x: 10,
    y: 38,
    w: 24,
    h: 42,
    risk: 'Acesso não autorizado a informação pessoal e confidencial de alunos em formato físico.',
    consequences: 'Violação grave do RGPD, exposição de pautas, avaliações e relatórios pedagógicos a pessoas não autorizadas.',
    bestPractices: [
      'Adotar rigorosamente uma política de secretária limpa (Clean Desk Policy).',
      'Guardar todos os documentos impressos em armários trancados.',
      'Aplicar o princípio da minimização de dados e confidencialidade.',
      'Proceder à destruição segura (destruidor de papel) de documentos que já não precisem de ser conservados.',
    ],
    tools: ['Clean Desk Policy', 'Armários com Chave', 'Destruidor de Documentos Certificado'],
    speechText:
      'Somos os documentos impressos com pautas e avaliações de alunos em cima da secretária. O RGPD protege os dados em papel com o mesmo rigor que os dados digitais. Adote a política de secretária limpa, guarde os papéis em armários fechados à chave e destrua em segurança o que já não for necessário.',
  },
  {
    id: 'notebook',
    number: 6,
    title: 'Caderno Aberto com Informação Confidencial',
    shortTitle: 'Caderno Confidencial',
    x: 69,
    y: 14,
    w: 24,
    h: 38,
    risk: 'Registo inseguro de palavras-passe, notas sensíveis e classificações escolares em suporte de papel.',
    consequences: 'Risco elevado de perda, furto, visualização indevida ou reprodução fotográfica de dados protegidos.',
    bestPractices: [
      'Substituir o registo manuscrito de credenciais por gestores de palavras-passe.',
      'Manter cadernos com dados sensíveis fechados e guardados em local seguro.',
      'Respeitar escrupulosamente os procedimentos de salvaguarda de informação definidos pelo agrupamento.',
    ],
    tools: ['Gestores de Palavras-Passe', 'Armazenamento Físico Seguro'],
    speechText:
      'Sou o caderno aberto com apontamentos confidenciais e credenciais escritas à mão. Se perder o caderno ou alguém o fotografar, toda a informação fica comprometida. Utilize suportes digitais cifrados e evite registar dados sensíveis de alunos em cadernos desprotegidos.',
  },
  {
    id: 'phone',
    number: 7,
    title: 'Smartphone Desbloqueado',
    shortTitle: 'Smartphone Desbloqueado',
    x: 69,
    y: 44,
    w: 12,
    h: 30,
    risk: 'Acesso não autorizado a mensagens, correio eletrónico institucional e códigos de autenticação (MFA).',
    consequences: 'Compromisso das contas associadas à escola, leitura de comunicações profissionais e exfiltração de dados.',
    bestPractices: [
      'Configurar um PIN robusto, palavra-passe ou autenticação biométrica obrigatória.',
      'Ativar o bloqueio automático de ecrã após curto período de inatividade.',
      'Instalar aplicações de autenticação oficial (Microsoft / Google Authenticator).',
      'Manter o sistema operativo e as apps atualizadas.',
      'Ativar serviços de localização e eliminação remota (Find My Device).',
    ],
    tools: ['Microsoft Authenticator / Google Authenticator', 'Bloqueio Biométrico / PIN', 'Localização e Limpeza Remota'],
    speechText:
      'Sou o smartphone desbloqueado na mesa. Como recebo códigos de autenticação multifator e emails da escola, quem me aceder ganha controlo sobre as suas contas. Proteja-me com PIN robusto ou biometria, configure o bloqueio automático e ative a localização remota.',
  },
  {
    id: 'usb',
    number: 8,
    title: 'Dispositivo de Armazenamento USB',
    shortTitle: 'Dispositivo USB',
    x: 74,
    y: 65,
    w: 16,
    h: 18,
    risk: 'Perda ou furto de dados confidenciais e potencial propagação de malware através de suporte removível.',
    consequences: 'Exposição de ficheiros institucionais ou infeção do computador portátil por ransomware ou vírus transportados na pen.',
    bestPractices: [
      'Cifrar sempre os dados sensíveis antes de os colocar em dispositivos USB (VeraCrypt ou 7-Zip com AES-256).',
      'Nunca ligar dispositivos USB de origem desconhecida ou encontrados em espaços públicos.',
      'Utilizar BitLocker To Go nas edições de Windows compatíveis.',
      'Transmitir palavras-passe de ficheiros cifrados por um canal distinto (ex: SMS ou chamada).',
    ],
    tools: ['VeraCrypt (Contentores cifrados)', '7-Zip (AES-256 e nomes cifrados)', 'BitLocker To Go'],
    speechText:
      'Sou a pen USB ligada ao lado do telemóvel. Se me perder sem cifra, qualquer pessoa acede ao seu conteúdo. Utilize sempre contentores VeraCrypt ou ficheiros 7-Zip protegidos com AES-256 para os seus dados. E nunca ligue dispositivos USB de proveniência duvidosa.',
  },
];

export const QUESTIONARIO_ESTACAO_2 = [
  {
    id: 1,
    pergunta: 'Qual é a principal medida de segurança a adotar imediatamente quando o professor se afasta da secretária?',
    opcoes: [
      'Desligar o monitor do computador no botão de energia.',
      'Bloquear a sessão utilizando a combinação Windows + L.',
      'Deixar o documento de classificações aberto para consulta rápida no regresso.',
      'Minimizar todas as janelas ativas.',
    ],
    respostaCorreta: 1,
    explicacao:
      'Bloquear a sessão com Windows + L (ou Control+Command+Q no Mac) impede o acesso não autorizado à sessão de trabalho e às plataformas escolares durante a ausência do docente.',
  },
  {
    id: 2,
    pergunta: 'Porque é perigoso deixar notas adesivas (post-its) com palavras-passe coladas no ecrã do computador?',
    opcoes: [
      'Porque gastam papel desnecessariamente.',
      'Porque interferem com a ventilação do monitor.',
      'Porque expõem credenciais de acesso a qualquer pessoa que entre na sala, facilitando acessos indevidos.',
      'Porque atrasam o arranque do sistema operativo.',
    ],
    respostaCorreta: 2,
    explicacao:
      'Notas adesivas com palavras-passe à vista violam as regras básicas de higiene digital, permitindo que colegas, visitantes ou alunos obtenham acesso direto às contas institucionais.',
  },
  {
    id: 3,
    pergunta: 'Qual é a ferramenta recomendada para armazenar de forma segura dezenas de palavras-passe diferentes sem as memorizar todas?',
    opcoes: [
      'Um caderno de notas guardado na gaveta da secretária.',
      'Um ficheiro de texto simples no ambiente de trabalho.',
      'Um gestor de palavras-passe credenciado (como KeePassXC ou Bitwarden).',
      'Utilizar sempre a mesma palavra-passe em todas as plataformas.',
    ],
    respostaCorreta: 2,
    explicacao:
      'Os gestores de palavras-passe permitem gerar e guardar credenciais únicas e complexas cifradas num cofre seguro, exigindo apenas que memorize uma única palavra-passe mestra.',
  },
  {
    id: 4,
    pergunta: 'No âmbito do RGPD e da proteção de dados, como devem ser tratados os documentos impressos com classificações e dados dos alunos?',
    opcoes: [
      'Deixados em cima da secretária para facilitar a consulta pelos alunos.',
      'Protegidos ao abrigo de uma política de secretária limpa, guardados em armários com chave e destruídos em segurança quando já não forem necessários.',
      'Reciclados diretamente no ecoponto comum da sala de professores sem cuidados especiais.',
      'Fotografados e partilhados num grupo público de mensagens.',
    ],
    respostaCorreta: 1,
    explicacao:
      'O RGPD aplica-se integralmente aos dados em papel. Devem aplicar-se medidas rigorosas de confidencialidade, armazenamento em locais seguros e destruição certificada.',
  },
  {
    id: 5,
    pergunta: 'Como se deve proceder perante uma pen USB encontrada no chão da escola cuja proveniência é desconhecida?',
    opcoes: [
      'Ligar imediatamente ao portátil da escola para ver de quem é o conteúdo.',
      'Formatar a pen num computador pessoal.',
      'Nunca a ligar a nenhum equipamento escolar e entregá-la ao responsável de TIC do agrupamento.',
      'Deixar a pen em cima da secretária para o dono a encontrar.',
    ],
    respostaCorreta: 2,
    explicacao:
      'Dispositivos USB desconhecidos podem conter malware avançado ou simular periféricos maliciosos (BadUSB). A conduta correta é nunca os ligar e entregá-los aos serviços técnicos de TIC.',
  },
  {
    id: 6,
    pergunta: 'Qual é a utilidade da cifra do disco (ex: BitLocker ou Encriptação do dispositivo) num portátil escolar?',
    opcoes: [
      'Acelerar a velocidade de ligação à internet da escola.',
      'Garantir que, em caso de furto ou perda física do portátil, os dados armazenados permanecem ilegíveis sem a chave de recuperação.',
      'Impedir que o computador aqueça demasiado durante o uso prolongado.',
      'Atualizar automaticamente o antivírus todas as semanas.',
    ],
    respostaCorreta: 1,
    explicacao:
      'A cifra do disco protege o armazenamento interno contra extração física de dados, tornando os ficheiros inacessíveis a terceiros caso o dispositivo seja roubado ou perdido.',
  },
  {
    id: 7,
    pergunta: 'O que deve ser feito para proteger adequadamente um router Wi-Fi doméstico ou de trabalho?',
    opcoes: [
      'Manter a palavra-passe de fábrica impressa na etiqueta para maior facilidade.',
      'Desligar a firewall do router para melhorar o sinal.',
      'Alterar as credenciais de administração predefinidas, utilizar WPA2/WPA3 e manter o firmware atualizado.',
      'Partilhar a palavra-passe livremente nas redes sociais.',
    ],
    respostaCorreta: 2,
    explicacao:
      'Alterar credenciais padrão, usar cifras modernas (WPA2/WPA3) e atualizar o firmware protege a rede contra intrusões e ataques de exploração de vulnerabilidades.',
  },
  {
    id: 8,
    pergunta: 'Qual é a principal vantagem da Autenticação Multifator (MFA) configurada com uma aplicação no telemóvel?',
    opcoes: [
      'Permite aceder às contas escolares sem introduzir qualquer palavra-passe.',
      'Adiciona uma camada extra de segurança, exigindo um segundo fator verificado num dispositivo de confiança além da palavra-passe.',
      'Garante chamadas telefónicas gratuitas na escola.',
      'Evita a necessidade de atualizar o sistema operativo.',
    ],
    respostaCorreta: 1,
    explicacao:
      'Mesmo que uma palavra-passe seja comprometida por phishing, a MFA impede o acesso não autorizado por exigir a aprovação ou código num segundo dispositivo seguro (o smartphone).',
  },
  {
    id: 9,
    pergunta: 'Como se deve proceder ao transportar dados confidenciais de alunos num dispositivo de armazenamento USB?',
    opcoes: [
      'Guardar os ficheiros diretamente sem qualquer proteção.',
      'Proteger os dados através de um contentor cifrado (ex: VeraCrypt) ou arquivo comprimido com cifra AES-256.',
      'Enviar os dados por email para um endereço pessoal.',
      'Gravar a password num documento de texto na mesma pen.',
    ],
    respostaCorreta: 1,
    explicacao:
      'A cifra com VeraCrypt ou 7-Zip (AES-256) assegura que, mesmo que a pen seja perdida ou furtada, os ficheiros confidenciais não podem ser lidos por terceiros.',
  },
  {
    id: 10,
    pergunta: 'O que preconiza a política de secretária limpa (Clean Desk Policy) em ambiente escolar?',
    opcoes: [
      'Limpar o pó da secretária todas as manhãs com um pano húmido.',
      'Manter o espaço de trabalho livre de documentos confidenciais desprotegidos e dispositivos desbloqueados quando o docente se ausenta.',
      'Arrumar todos os lápis por ordem de tamanho.',
      'Desligar o disjuntor da sala de aula no final do dia.',
    ],
    respostaCorreta: 1,
    explicacao:
      'A Clean Desk Policy evita que documentos com dados pessoais, pautas, post-its com passwords e portáteis desbloqueados fiquem expostos a olhares e acessos não autorizados.',
  },
];
