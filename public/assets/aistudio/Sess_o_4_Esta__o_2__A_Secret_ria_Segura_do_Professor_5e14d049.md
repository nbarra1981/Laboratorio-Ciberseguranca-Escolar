# Sessão 4: Estação 2, A Secretária Segura do Professor

Nov 21, 2026 · @Nelson Garcia Barra

## Objetivos da sessão

A segunda estação do Laboratório de Informática passa a mostrar a secretária de um professor: cada equipamento da imagem (portátil, pen USB, disco de cópias, telemóvel, router) é um ponto que explica em voz alta um risco real e a ferramenta que o resolve, como o VeraCrypt, o BitLocker ou um gestor de palavras-passe.

No final desta sessão, deverá ser capaz de:

- Gerar com o Nano Banana 2 Lite (gratuito) a imagem de uma secretária de professor com os equipamentos e as más práticas que a estação vai explicar, e revê-la com olhar crítico.
- Editar a imagem através de uma conversa para acrescentar, mover ou corrigir os elementos que vão ser pontos clicáveis.
- Construir no Build um quadro interativo com voz (Gemini TTS, pt-PT) em que cada ponto diz o risco, a ferramenta e o gesto concreto do professor.
- Ouvir cada explicação até ao fim, confirmar que o conteúdo técnico está certo e voltar a testar depois de cada correção.

A própria construção da app é um exercício de cibersegurança: nada de dados pessoais nos prompts, cuidado com a chave da API que o Publish cria e escolha consciente do tipo de partilha.

## Como aceder hoje (atualizado a 04/11/2026)

Os passos no AI Studio são os da ação de formação; nesta estação, o destinatário são colegas professores e as notas de segurança no fim da secção fazem parte do conteúdo.

Ferramenta: [Google AI Studio](https://aistudio.google.com/) (aistudio.google.com). Imagem no Playground, app no Build:

- Imagem: seletor de modelos › Images › Nano Banana 2 Lite (os restantes modelos de imagem, vídeo e música estão marcados como pagos).
- Nos testes com uma conta gratuita, a geração de imagens dentro das apps não funcionou; a voz (TTS) e o texto funcionaram. Por isso, a imagem é gerada no Playground e anexada à app com o botão + da caixa Make changes.
- Oiça a voz até ao fim e confirme o sotaque; se sair em português do Brasil, peça em Make changes o código de idioma pt-PT e volte a ouvir. Nesta estação, confirme também a pronúncia dos nomes das ferramentas (VeraCrypt, BitLocker, KeePassXC).
- Inclua sempre na especificação: "Se o modelo estiver sobrecarregado, tenta de novo e, se continuar a falhar, usa um modelo Gemini mais leve como alternativa." Nas contas gratuitas o modelo principal dá muitas vezes o erro 503 dentro das apps; com esta frase, a app passa sozinha para um modelo mais leve.
- As contas gratuitas têm um limite diário de pedidos ao Build. Num teste a 09/11/2026, o Build bloqueou depois de cerca de 10 pedidos no mesmo dia. Teste bem antes de cada novo pedido e distribua o trabalho por vários dias.
- Share › General access › Public: Anyone with the link can view › Copy link (link para a formação).
- Publish › escolher o endereço › Publish your app: a app fica num endereço próprio (….ai.studio) que abre sem conta Google. Na primeira publicação aceitam-se os termos Starter Tier da Google.
- O Publish cria uma chave da Gemini API na sua conta: o uso da app publicada conta para o seu limite gratuito. Partilhe com os colegas a quem a estação se destina.
- Nas contas gratuitas só pode haver 2 apps publicadas ao mesmo tempo. Para publicar outra, retire uma em Publish › Manage published apps (ou Unpublish app); para o resto, use o link do Share.

Este é o único bloco a atualizar quando o interface do AI Studio mudar. Consulte também a página "[Estado atual do Google AI Studio](https://anpri.edu.pt/mod/page/view.php?id=46068)".

### Notas de segurança desta estação

- **Nada de dados pessoais nos prompts nem nas imagens.** Com a conta gratuita, a Google usa o que envia para melhorar os seus produtos e revisores humanos podem ler os pedidos e as respostas; os termos pedem expressamente que não se envie informação pessoal, sensível ou confidencial ([Termos Adicionais da Gemini API](https://ai.google.dev/gemini-api/terms)). Nada de nomes de alunos, fotografias reais, pautas ou logótipos da escola.
- **A chave da API é uma credencial.** Não a copie para o código, para prompts ou para documentos partilhados. Se suspeitar que ficou exposta, apague-a na área de chaves do AI Studio e crie outra.
- **Partilha por link só para conteúdos sem dados.** "Anyone with the link" serve para esta estação porque a app não pede nem guarda nomes, emails ou respostas.
- **Público-alvo e termos.** Os termos em vigor desde 23/03/2026 exigem 18 anos para usar as APIs, excluem apps dirigidas a menores ou que estes provavelmente usem e limitam aos serviços pagos as apps disponibilizadas a utilizadores do Espaço Económico Europeu ([Termos Adicionais da Gemini API](https://ai.google.dev/gemini-api/terms)). Esta estação destina-se a professores; antes de pôr uma app publicada com a quota gratuita nas mãos de alunos, confirme o enquadramento com os formadores da ação e com o encarregado de proteção de dados do agrupamento.

## Mapa da estação: os 10 pontos da imagem

Cada ponto liga um equipamento a um risco, a uma ferramenta e a um gesto que o professor faz amanhã. Os seis pontos marcados com (desafio) aparecem na imagem como má prática e alimentam o modo "Encontra os 6 riscos".

| # | Ponto na imagem | Risco | Ferramenta ou prática | Gesto do professor |
| --- | --- | --- | --- | --- |
| 1 | Webcam no topo do portátil (desafio: destapada) | Câmara ou microfone usados por malware ou por uma app com permissões a mais | Tampa física; permissões em Definições › Privacidade e segurança › Câmara e Microfone | Tapar fora das videochamadas; retirar permissões às apps que não precisam |
| 2 | Ecrã do portátil (desafio: desbloqueado, com uma grelha de classificações aberta) | Acesso à sessão quando o professor se afasta; notificações e plataformas visíveis no projetor | Bloqueio de sessão: Win+L (Windows), Control+Command+Q (macOS); bloqueio automático; modo Não incomodar | Bloquear sempre que se levanta; antes de projetar, fechar a plataforma de avaliações e silenciar notificações |
| 3 | Barra de tarefas: escudo e atualizações | Falhas conhecidas exploradas em sistemas desatualizados | Windows Update e Microsoft Defender; o Windows 10 deixou de ter suporte normal a 14/10/2025 | Instalar as atualizações na semana em que saem; não adiar reinícios; confirmar que o Defender está ligado |
| 4 | Corpo do portátil (disco interno) | Furto ou perda expõe todos os ficheiros, mesmo sem a palavra-passe da sessão | [BitLocker ou Encriptação do dispositivo](https://support.microsoft.com/en-us/windows/device-encryption-in-windows-cf7e2b6f-3e70-4882-9532-18633605b7df) (Windows), FileVault (macOS) | Confirmar que a cifra está ligada; guardar a chave de recuperação fora do portátil |
| 5 | Post-it com palavra-passe no ecrã (desafio) | Palavra-passe à vista e, quase sempre, repetida noutros serviços | Gestor de palavras-passe: KeePassXC (local, código aberto) ou Bitwarden; frases-passe longas | Uma palavra-passe diferente por serviço, guardada no gestor; só a palavra-passe mestra fica na cabeça |
| 6 | Telemóvel | Uma palavra-passe roubada por phishing chega para entrar na conta | Autenticação de dois fatores com app: Microsoft Authenticator, Google Authenticator, Aegis | Ativar a 2FA no email e na conta Microsoft 365 ou Google da escola; guardar os códigos de recuperação |
| 7 | Pen USB do professor, ligada ao portátil | Pen perdida com testes, pautas ou relatórios | [VeraCrypt](https://veracrypt.io/en/Home.html) (contentor cifrado); para enviar a quem não tem VeraCrypt, 7-Zip em .7z com AES-256 e nomes de ficheiros cifrados | Guardar os dados num contentor VeraCrypt; mandar a palavra-passe do .7z por outro canal (SMS ou telefone) |
| 8 | Pen USB desconhecida em cima da mesa (desafio) | Uma pen "esquecida" pode trazer malware ou fazer-se passar por teclado | Nenhum programa resolve: não ligar | Entregar ao responsável de TIC do agrupamento; nunca a ligar "só para ver de quem é" |
| 9 | Disco externo de cópias, sempre ligado (desafio) | Ransomware cifra também as cópias que estão ligadas; avaria do disco interno | Regra 3-2-1; Histórico de Ficheiros (Windows) ou Time Machine (macOS); Cryptomator antes de enviar para uma nuvem pessoal | Fazer a cópia, desligar o disco e guardá-lo noutro sítio; testar uma reposição por período |
| 10 | Router Wi-Fi com etiqueta da palavra-passe de fábrica (desafio) | Rede de casa com credenciais de origem; redes públicas abertas | WPA2 ou WPA3; mudar a palavra-passe de administração de origem; atualizar o firmware; partilha de dados do telemóvel em vez de Wi-Fi aberto | Não entrar em plataformas escolares em Wi-Fi público aberto; mudar as credenciais de fábrica do router de casa |

Três limites que a estação deve dizer com clareza:

- **VeraCrypt em computadores da escola.** Sem direitos de administrador, o VeraCrypt só funciona se o técnico o tiver instalado, e o modo portátil também exige administrador ([VeraCrypt: utilização sem privilégios de administrador](https://veracrypt.io/en/Using%20VeraCrypt%20Without%20Administrator%20Privileges.html)). A versão atual é a 1.26.31, de 02/11/2026; descarregue apenas do site oficial.
- **BitLocker nas edições Home.** O Windows Home tem a Encriptação do dispositivo, que liga sozinha ao entrar com uma conta Microsoft ou da escola e associa a chave de recuperação a essa conta; o BitLocker completo exige Pro, Enterprise ou Education ([Microsoft Support](https://support.microsoft.com/en-us/windows/device-encryption-in-windows-cf7e2b6f-3e70-4882-9532-18633605b7df)). Cifrar uma pen com BitLocker To Go também não é possível no Home ([Freedom of the Press Foundation](https://freedom.press/digisec/blog/bitlocker-go-guide/)).
- **Cifra sem chave guardada é perda de dados.** Sem a palavra-passe e sem a chave de recuperação, nem o professor nem o técnico recuperam os ficheiros.

## Passo 1: gerar a imagem no Playground

A imagem tem de mostrar os 10 elementos bem separados, sem texto legível nem marcas, porque cada um vai ser um ponto clicável. Em Playground › Images › Nano Banana 2 Lite, cole o pedido abaixo.

```text
Ilustração digital semirrealista, formato 16:9, luz natural, cores claras.
Vista a três quartos, ligeiramente de cima, da secretária de um professor
numa sala de professores de uma escola secundária. Sem pessoas.

Elementos, bem separados uns dos outros e todos inteiros dentro da imagem:
1. Ao centro, um portátil aberto e grande, com uma webcam pequena visível
   no topo do ecrã, sem tampa.
2. No ecrã do portátil, uma grelha tipo folha de cálculo com células
   coloridas, sem texto legível.
3. Na parte de baixo do ecrã, uma barra de tarefas com um pequeno ícone
   de escudo e um ícone de setas circulares de atualização.
4. Um post-it amarelo colado no canto superior direito do ecrã, com
   rabiscos ilegíveis.
5. Uma pen USB azul ligada ao lado direito do portátil.
6. Uma pen USB vermelha, sozinha, no canto inferior esquerdo da mesa.
7. Um telemóvel pousado à direita do portátil, com o ecrã apagado.
8. Um disco externo preto à esquerda do portátil, ligado por cabo.
9. Ao fundo, à direita, numa prateleira, um router Wi-Fi branco com
   duas antenas e uma etiqueta branca colada na frente.
10. Uma caneca e uma pilha de dossiês fechados como decoração.

Regras: nenhum texto legível em nenhum objeto; nenhum logótipo ou marca;
nenhum rosto; fundo simples e desfocado para os objetos se destacarem.
```

Reveja a imagem com olhar crítico antes de avançar:

- [ ] Estão lá os 10 elementos, cada um inteiro e sem tocar nos outros?
- [ ] Há texto inventado, letras deformadas ou logótipos de marcas reais (no portátil, no telemóvel, no router)?
- [ ] O ecrã mostra algo que pareça um nome, uma fotografia ou um dado pessoal real?
- [ ] Os detalhes técnicos são plausíveis: a pen está numa porta USB, o cabo do disco liga ao portátil, o router tem antenas?
- [ ] As más práticas veem-se à primeira: post-it, pen vermelha solta, webcam destapada, disco ligado, etiqueta no router?
- [ ] A imagem lê-se bem num projetor, com os objetos grandes o suficiente para um ponto clicável?

Guarde a imagem final no computador (botão de transferência no Playground) com um nome simples, por exemplo secretaria-segura.png.

## Passo 2: editar a imagem por conversa

A edição serve para dois fins: corrigir o que a revisão apanhou e criar uma segunda imagem, "Depois", com todas as boas práticas aplicadas. A app usa as duas para um botão Antes/Depois.

Correções típicas, uma por mensagem, na mesma conversa do Playground:

```text
Mantém tudo igual e afasta a pen USB vermelha do portátil, para mais perto do canto inferior esquerdo da mesa.
```

```text
Mantém tudo igual e remove qualquer letra ou logótipo da tampa do portátil, do telemóvel e do router.
```

```text
Mantém tudo igual e torna o post-it amarelo maior e mais visível no canto do ecrã.
```

Versão "Depois", pedida só quando a imagem "Antes" estiver aprovada e guardada:

```text
Mantém exatamente a mesma cena, o mesmo enquadramento e a mesma posição de todos os objetos. Altera apenas isto: tira o post-it do ecrã; mostra o ecrã bloqueado com um fundo de paisagem; tapa a webcam com uma pequena tampa deslizante; retira a pen USB vermelha da mesa; desliga o cabo do disco externo e põe o disco ao lado dos dossiês; retira a etiqueta da frente do router.
```

Compare as duas imagens lado a lado: os objetos têm de estar no mesmo sítio, senão os pontos clicáveis ficam desalinhados no "Depois". Se a edição mudar demasiado, volte à versão anterior e peça as alterações em duas ou três mensagens mais pequenas. Guarde a segunda imagem como secretaria-segura-depois.png.

## Passo 3: especificação para o Build

Cole a especificação e, na mesma mensagem, os guiões da secção seguinte: assim a app nasce completa num só pedido, o que conta para o limite diário. Se a caixa inicial do Build tiver o botão +, anexe logo as duas imagens; se não, anexe-as no primeiro Make changes com a frase "Usa a primeira imagem como Antes e a segunda como Depois."

```text
Cria uma app web chamada "Secretária Segura do Professor", em português europeu,
para professores numa formação sobre cibersegurança e proteção de dados.

IMAGEM E PONTOS
- Mostra a imagem "Antes" (anexada) a toda a largura, sem cortar.
- Por cima, 10 pontos numerados (círculos com animação suave), com posições em
  percentagem da largura e da altura da imagem, para se manterem certos em
  qualquer ecrã. Guarda as posições numa única lista no início do código.
- Posições iniciais (x%, y%), a afinar depois:
  1 Webcam (50, 14) · 2 Ecrã (45, 35) · 3 Barra de tarefas (50, 52)
  4 Disco interno do portátil (50, 68) · 5 Post-it (66, 20) · 6 Telemóvel (78, 70)
  7 Pen USB do professor (70, 60) · 8 Pen USB desconhecida (12, 85)
  9 Disco externo de cópias (22, 62) · 10 Router Wi-Fi (85, 15)
- Pontos de desafio: 1, 2, 5, 8, 9 e 10.
- Modo de afinação: ao carregar na tecla A, mostra as coordenadas (x%, y%) do
  sítio onde clico, para eu poder corrigir as posições.

PAINEL DE CADA PONTO
- Ao clicar num ponto, abre um painel ao lado com: título, risco, ferramenta ou
  prática e gesto do professor, usando exatamente os textos dos guiões abaixo.
- Botão "Ouvir" que lê o guião do ponto com Gemini TTS, voz em português
  europeu (código de idioma pt-PT), ritmo calmo. Botões Pausa e Parar.
  Só pode tocar uma voz de cada vez.
- Gera o áudio apenas quando eu carrego em "Ouvir" e guarda-o em memória para
  não repetir o pedido se ouvir o mesmo ponto outra vez.

MODOS
- "Explorar": todos os pontos visíveis.
- "Desafio: encontra os 6 riscos": pontos escondidos; quando clico perto de um
  ponto de desafio, ele aparece e o contador avança (x/6). Botão "Mostrar
  solução". No fim, mensagem de parabéns com o resumo dos 6 riscos.
- Botão "Antes / Depois" que troca para a segunda imagem anexada; no "Depois",
  cada ponto de desafio mostra uma linha "Corrigido: …" com o gesto aplicado.

ACESSIBILIDADE
- Todo o áudio tem o texto visível no painel.
- Pontos acessíveis com Tab e Enter; bom contraste; letra legível num projetor.

PRIVACIDADE E ROBUSTEZ
- A app não pede, não guarda e não envia nomes, emails ou respostas.
- Nenhuma chave de API escrita no código visível.
- Se o modelo estiver sobrecarregado, tenta de novo e, se continuar a falhar,
  usa um modelo Gemini mais leve como alternativa.
- Se a voz falhar mesmo assim, mostra "Voz indisponível de momento" e mantém o
  texto no painel.

RODAPÉ
- "Conteúdo de sensibilização. Confirme os procedimentos com o responsável de
  TIC do seu agrupamento."
```

As posições iniciais correspondem à disposição pedida no Passo 1; com a tecla A, afina-se cada ponto num único Make changes, por exemplo: "Move o ponto 8 para (10, 88) e o ponto 10 para (87, 18)."

## Guiões da voz

Cada objeto explica-se na primeira pessoa, em 25 a 35 segundos, e termina sempre com um gesto concreto. Cole este bloco logo a seguir à especificação; as linhas "Corrigido" só existem nos seis pontos de desafio.

```text
GUIÕES DOS PONTOS

1. Webcam
Risco: câmara ou microfone ligados por malware ou por apps com permissões a mais.
Ferramenta: tampa física; Definições > Privacidade e segurança > Câmara e Microfone.
Gesto: tapar fora das videochamadas e retirar permissões às apps que não precisam.
Voz: "Sou a webcam. Vejo a sala inteira, e quem tiver acesso a mim também. Um programa malicioso, ou uma app com permissões a mais, pode ligar-me sem aviso. Fora das videochamadas, tape-me com uma tampa deslizante. E, uma vez por período, abra Definições, Privacidade e segurança, Câmara e Microfone, e retire a permissão às apps que não precisam de mim."
Corrigido: webcam tapada e permissões revistas.

2. Ecrã
Risco: sessão aberta quando o professor se afasta; dados visíveis no projetor.
Ferramenta: bloqueio de sessão (Win+L; no Mac, Control+Command+Q), bloqueio automático, modo Não incomodar.
Gesto: bloquear sempre que se levanta; fechar a plataforma de avaliações antes de projetar.
Voz: "Sou o ecrã, e estou desbloqueado com uma grelha de classificações aberta. Basta um minuto longe da secretária para alguém ver ou alterar o que aqui está. Sempre que se levantar, carregue em Windows mais L; num Mac, Control, Command e Q. Configure o bloqueio automático. E, antes de ligar o projetor, feche a plataforma de avaliações e silencie as notificações."
Corrigido: ecrã bloqueado e notificações silenciadas ao projetar.

3. Barra de tarefas
Risco: falhas conhecidas exploradas em sistemas desatualizados.
Ferramenta: Windows Update e Microsoft Defender.
Gesto: instalar as atualizações na semana em que saem e não adiar o reinício.
Voz: "Sou a barra de tarefas, e estes dois ícones são o escudo do antivírus e as atualizações. A maioria dos ataques aproveita falhas que já têm correção. Instale as atualizações na semana em que saem e não adie o reinício. Confirme que o Microsoft Defender está ligado. E lembre-se: o Windows 10 deixou de ter suporte normal em outubro de 2025."

4. Disco interno do portátil
Risco: portátil roubado ou perdido com todos os ficheiros legíveis.
Ferramenta: BitLocker (Windows Pro e Education), Encriptação do dispositivo (Windows Home), FileVault (Mac).
Gesto: confirmar que a cifra está ligada e guardar a chave de recuperação fora do portátil.
Voz: "Sou o disco do portátil e guardo tudo: testes, relatórios, emails. Se o portátil for roubado, a palavra-passe da sessão não me protege: quem me retirar lê tudo. Por isso, ligue a cifra: BitLocker no Windows Pro, Encriptação do dispositivo no Windows Home, FileVault no Mac. E guarde a chave de recuperação fora do portátil, num sítio seguro."

5. Post-it
Risco: palavra-passe à vista e repetida noutros serviços.
Ferramenta: gestor de palavras-passe (KeePassXC ou Bitwarden).
Gesto: uma palavra-passe diferente por serviço; decorar só a mestra.
Voz: "Sou o post-it com a palavra-passe. Estou à vista de toda a gente e, pior, essa palavra-passe serve, de certeza, para mais do que uma conta. Troque-me por um gestor de palavras-passe, como o KeePassXC, que guarda tudo num ficheiro cifrado no seu computador, ou o Bitwarden. Cada serviço fica com uma palavra-passe diferente. Só precisa de decorar uma: a mestra, longa, uma frase que só você conhece."
Corrigido: post-it retirado e palavras-passe guardadas no gestor.

6. Telemóvel
Risco: uma palavra-passe roubada por phishing chega para entrar na conta.
Ferramenta: autenticação de dois fatores com app (Microsoft Authenticator, Google Authenticator, Aegis).
Gesto: ativar a 2FA no email e na conta da escola; guardar os códigos de recuperação.
Voz: "Sou o telemóvel, a segunda chave das suas contas. Um email falso pode roubar uma palavra-passe; com a autenticação de dois fatores, isso não chega para entrar. Ative-a no email e na conta Microsoft 365 ou Google da escola, com uma app como o Microsoft Authenticator. Guarde os códigos de recuperação num sítio seguro, para o dia em que me perder."

7. Pen USB do professor
Risco: pen perdida com testes, pautas ou relatórios.
Ferramenta: VeraCrypt (contentor cifrado); 7-Zip em .7z com AES-256 para enviar ficheiros.
Gesto: guardar os dados num contentor VeraCrypt; enviar a palavra-passe do .7z por outro canal.
Voz: "Sou a pen do professor e ando de sala em sala com testes e pautas. Se me perder, quem me encontrar lê tudo. Com o VeraCrypt, crio um cofre cifrado: um ficheiro que só abre com a sua palavra-passe. Atenção: num computador da escola, o VeraCrypt tem de ser instalado pelo técnico. Para enviar um ficheiro a um colega, use o 7-Zip com cifra AES de 256 bits e diga-lhe a palavra-passe por telefone."

8. Pen USB desconhecida
Risco: malware ou um dispositivo que se faz passar por teclado.
Ferramenta: nenhuma; a defesa é não ligar.
Gesto: entregar ao responsável de TIC do agrupamento.
Voz: "Sou uma pen que ninguém sabe de onde veio. Pareço um esquecimento, mas posso ser uma armadilha: posso trazer malware ou fingir que sou um teclado e escrever comandos sozinha. Nenhum programa resolve isto com segurança. Não me ligue, nem só para ver de quem sou. Entregue-me ao responsável de TIC do agrupamento."
Corrigido: pen entregue ao responsável de TIC, sem ser ligada.

9. Disco externo de cópias
Risco: ransomware que cifra também as cópias ligadas; avaria do disco interno.
Ferramenta: regra 3-2-1; Histórico de Ficheiros (Windows) ou Time Machine (Mac); Cryptomator para nuvem pessoal.
Gesto: copiar, desligar e guardar o disco noutro sítio; testar uma reposição por período.
Voz: "Sou o disco das cópias de segurança. Estou sempre ligado, e isso é um problema: se entrar um ransomware, cifra o portátil e cifra-me a mim também. Siga a regra três, dois, um: três cópias, em dois suportes diferentes, uma delas fora de casa ou da escola. Depois de cada cópia, desligue-me e guarde-me noutro sítio. E, uma vez por período, experimente recuperar um ficheiro."
Corrigido: disco desligado depois da cópia e guardado noutro sítio.

10. Router Wi-Fi
Risco: credenciais de fábrica à vista; redes públicas abertas.
Ferramenta: WPA2 ou WPA3, palavra-passe de administração alterada, firmware atualizado.
Gesto: mudar as credenciais de fábrica; usar os dados do telemóvel em vez de Wi-Fi aberto.
Voz: "Sou o router Wi-Fi, e a etiqueta na minha frente mostra a palavra-passe de fábrica. Qualquer visita a pode fotografar. Em casa, mude a palavra-passe de administração, use WPA2 ou WPA3 e mantenha o firmware atualizado. Fora de casa, num Wi-Fi público aberto, não entre na plataforma de avaliações: use a partilha de dados do telemóvel."
Corrigido: credenciais de fábrica alteradas e etiqueta retirada.
```

## Testar e corrigir

Com cerca de 10 pedidos por dia, cada Make changes deve juntar várias correções e só ser enviado depois deste teste completo.

Teste completo (primeira versão e antes de publicar):

- [ ] Ouvir os 10 pontos até ao fim: sotaque de Portugal, pronúncia de VeraCrypt, KeePassXC, BitLocker, WPA3 e Win+L.
- [ ] Confirmar que o que a voz diz é igual ao texto do painel e ao mapa da estação (nomes de menus, edições do Windows, datas).
- [ ] Pontos no sítio certo em "Antes" e em "Depois", num ecrã largo e num telemóvel.
- [ ] Modo desafio: os 6 pontos aparecem ao clicar perto, o contador chega a 6/6 e "Mostrar solução" funciona.
- [ ] Só toca uma voz de cada vez; Pausa e Parar funcionam; ouvir o mesmo ponto pela segunda vez é imediato.
- [ ] Tab e Enter chegam a todos os pontos.
- [ ] A app não pede nomes, emails nem respostas.
- [ ] O link do Share e o endereço do Publish abrem numa janela anónima, sem sessão iniciada.

Teste rápido (depois de cada Make changes): ouvir um ponto até ao fim, confirmar a posição de um ponto e fazer uma ronda do modo desafio.

Pedidos de correção que costumam ser precisos, juntos numa só mensagem:

```text
A voz sai com sotaque do Brasil: usa o código de idioma pt-PT em todas as chamadas de TTS.
Move o ponto 3 para (50, 55) e o ponto 9 para (20, 64).
Ao trocar para "Depois", mantém os pontos visíveis e mostra as linhas "Corrigido".
```

## Uso com colegas na ação do CFLO

A estação encaixa na ação "Proteção de dados e a Cibersegurança nas Escolas" como abertura prática de uma sessão síncrona e como tarefa assíncrona no Moodle.

- **Sessão síncrona (Teams), 10 minutos:** partilhar o ecrã com a app em modo Desafio; os formandos dizem onde está cada risco antes de se ouvir a explicação.
- **Tarefa assíncrona (Moodle):** link da app como recurso; cada formando percorre os 10 pontos e escreve os três gestos que vai aplicar nessa semana no seu próprio equipamento.
- **Variante de produção:** cada formando gera no Playground a sua própria cena (sala de aula com projetor, biblioteca, secretaria) e identifica nela três riscos, sem pessoas nem dados reais.
- **Para aprofundar:** os recursos do [Centro de Sensibilização SeguraNet](https://www.seguranet.pt/) e os conteúdos de ciber-higiene do [Centro Nacional de Cibersegurança](https://www.cncs.gov.pt/).

A imagem não cobre os dados em papel; pautas e testes impressos também são dados pessoais e podem dar um 11.º ponto (armário fechado, destruição segura).

## Fontes

Páginas consultadas a 21/11/2026; o bloco "Como aceder hoje" mantém os dados da ANPRI de 04/11/2026.

- [Gemini API Additional Terms of Service](https://ai.google.dev/gemini-api/terms) (em vigor desde 23/03/2026): uso de dados nas contas gratuitas, idade mínima, apps para menores e para o EEE.
- [VeraCrypt: página inicial](https://veracrypt.io/en/Home.html): versão 1.26.31, de 02/11/2026.
- [VeraCrypt: utilização sem privilégios de administrador](https://veracrypt.io/en/Using%20VeraCrypt%20Without%20Administrator%20Privileges.html): instalação pelo administrador e modo portátil.
- [Microsoft Support: Device encryption in Windows](https://support.microsoft.com/en-us/windows/device-encryption-in-windows-cf7e2b6f-3e70-4882-9532-18633605b7df): Encriptação do dispositivo no Home e BitLocker no Pro, Enterprise e Education.
- [Freedom of the Press Foundation: BitLocker To Go guide](https://freedom.press/digisec/blog/bitlocker-go-guide/): BitLocker To Go indisponível no Windows 11 Home.
- [Microsoft Education Blog: Windows 10 end of support](https://www.microsoft.com/en-us/education/blog/2024/04/windows-10-end-of-support-updates-for-education/): fim do suporte a 14/10/2025.
- [SeguraNet](https://www.seguranet.pt/): recursos e formação em cidadania digital para professores.
