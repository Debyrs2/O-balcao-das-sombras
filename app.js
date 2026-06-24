// VARIÁVEIS GERAIS
let tempoIntervaloAtual = 20000;
let poderGanhoAtual = 20;
let paranoia = 0;
let poderInimigo = 100;
let rodadaAtual = 0;
let poderGanhoPorSegundo = 0.5;
let cronometroInimigo;
let cenasDestaPartida = [];
let nivelAtualJogado = 1;

let nivelDesbloqueado = localStorage.getItem('progressoBalcao') ? parseInt(localStorage.getItem('progressoBalcao')) : 1;
if (isNaN(nivelDesbloqueado) || nivelDesbloqueado < 1) {
    nivelDesbloqueado = 1;
}
const telaInicial = document.getElementById('tela-inicial');
const telaMenu = document.getElementById('tela-menu');
const telaHistoria = document.getElementById('tela-historia');
const telaNegociacao = document.getElementById('fase-negociacao');
const telaCombate = document.getElementById('fase-combate');
const telaGameover = document.getElementById('tela-gameover');
const telaVitoria = document.getElementById('tela-vitoria');
const gradeNiveis = document.getElementById('grade-niveis');
const btnProximaFase = document.getElementById('btn-proxima-fase');

const paranoiaValorTxt = document.getElementById('paranoia-valor');
const poderInimigoTxt = document.getElementById('poder-inimigo');
const historicoChat = document.getElementById('historico-chat');
const containerOpcoes = document.getElementById('opcoes-dialogo');
const nivelAtualTxt = document.getElementById('nivel-atual-txt');

const nomesDosNiveis = [
    // ATO I
    "O Novato", "O Colecionador", "A Sombra", "O Sussurro", "A Mente Quebrada",
    // ATO II
    "O Abismo", "A Seita", "O Rito", "O Arauto", "A Entidade Primordial",
    // ATO III
    "O Reflexo", "A Oferenda", "O Veneno", "O Cântico", "O Labirinto",
    // ATO IV
    "A Praga", "A Balança", "A Esfinge", "O Sacrifício", "O Julgamento Final"
];

function renderizarMenu() {
    gradeNiveis.innerHTML = "";

    for (let i = 1; i <= 20; i++) {
        const btn = document.createElement('button');

        if (i <= nivelDesbloqueado) {
            btn.innerText = `Nível ${i}: ${nomesDosNiveis[i - 1]}`;
            btn.onclick = () => iniciarNivel(i);
            if (i === nivelDesbloqueado) {
                btn.style.border = "1px solid #4a90e2";
            }
        } else {
            btn.innerText = `Nível ${i}: ??? (Bloqueado)`;
            btn.disabled = true;
            btn.style.opacity = "0.5";
            btn.style.cursor = "not-allowed";
            btn.style.backgroundColor = "#1a1a1a";
            btn.style.color = "#555";
        }
        gradeNiveis.appendChild(btn);
    }
}
// --- O BANCO GERAL DE SITUAÇÕES (O Jogo Sorteia a partir daqui) ---
const bancoDeNiveis = {
    // --- ATO I: O Beco (Níveis 1 a 5) ---
    1: [
        {
            falaNPC: "O que você quer aqui? Fale logo.",
            opcoes: [
                { texto: "Busco artefatos incomuns.", tipo: "normal", paranoia: 10, resposta: "Todos buscam." },
                { texto: "Ouvir dizer que você vende itens ilegais.", tipo: "normal", paranoia: 40, resposta: "Fale baixo, idiota." },
                { texto: "🎲 [Sorte 50%] Colocar moedas de ouro no balcão.", tipo: "sorte", chanceSucesso: 0.5, paranoiaSucesso: -10, respostaSucesso: "Ah, um homem prevenido.", paranoiaFalha: 40, respostaFalha: "Guarde isso! Quer chamar atenção?" }
            ]
        },
        {
            falaNPC: "O cheiro de novato exala de você. Prove que não é da guarda. Qual o sinal do corvo?",
            opcoes: [
                { texto: "Três batidas e um assobio.", tipo: "senha", correta: false, paranoia: 40, resposta: "Sinal errado. Mais um erro e você morre." },
                { texto: "Assobio rasgado e duas palmas.", tipo: "senha", correta: true, paranoia: 0, resposta: "Pode entrar." }
            ]
        }
    ],
    2: [
        {
            falaNPC: "Você voltou. Mas as sombras estão agitadas hoje. Quem te mandou?",
            opcoes: [
                { texto: "Ninguém. Vim por conta própria.", tipo: "normal", paranoia: 20, resposta: "Mentira. Ninguém vem aqui sozinho." },
                { texto: "Os sussurros me guiaram.", tipo: "normal", paranoia: 0, resposta: "Então você também os ouve..." },
                { texto: "🎲 [Blefe 40%] O Mestre do Culto exige suas cartas.", tipo: "sorte", chanceSucesso: 0.4, paranoiaSucesso: -20, respostaSucesso: "P-perdão! Não sabia que servia a ele.", paranoiaFalha: 50, respostaFalha: "O Mestre morreu há anos. Você é um impostor!" }
            ]
        },
        {
            falaNPC: "Vamos testar sua audição. As cartas me disseram um número ontem. Quantas almas foram devoradas na última lua?",
            opcoes: [
                { texto: "Treze.", tipo: "senha", correta: true, paranoia: 0, resposta: "Exato. Treze almas perdidas." },
                { texto: "Sete.", tipo: "senha", correta: false, paranoia: 35, resposta: "Errado. Você não presta atenção aos sinais." }
            ]
        }
    ],
    3: [
        {
            falaNPC: "Tem investigadores na cidade. Você está suando. Cheira a medo e a lei.",
            opcoes: [
                { texto: "É apenas o calor do beco.", tipo: "normal", paranoia: 30, resposta: "O beco é frio como gelo, mentiroso." },
                { texto: "Estou nervoso por estar aqui, admito.", tipo: "normal", paranoia: 10, resposta: "Honestidade. Uma falha, mas aceitável." },
                { texto: "🎲 [Sorte 30%] Encarar o Vendedor nos olhos sem piscar.", tipo: "sorte", chanceSucesso: 0.3, paranoiaSucesso: -30, respostaSucesso: "Frio e calculista. Gosto disso.", paranoiaFalha: 50, respostaFalha: "Não me encare assim! Está com um comunicador escondido?!" }
            ]
        }
    ],
    4: [
        {
            falaNPC: "As cartas exigem intelecto. Decifre isso: 'Sem voz, ele chora. Sem asas, ele voa. Sem dentes, ele morde.' O que é?",
            opcoes: [
                { texto: "O Morcego.", tipo: "senha", correta: false, paranoia: 40, resposta: "Burrice. Morcegos têm asas e dentes." },
                { texto: "O Vento.", tipo: "senha", correta: true, paranoia: -10, resposta: "Afiado. O vento uiva nas frestas." },
                { texto: "O Espectro.", tipo: "senha", correta: false, paranoia: 40, resposta: "Você chuta palavras ao vento." }
            ]
        }
    ],
    5: [
        {
            falaNPC: "Vamos jogar. Escondi um olho de vidro debaixo de um destes três copos: Cobre, Prata ou Ouro. O Cobre diz 'Não está aqui'. A Prata diz 'Está no Ouro'. O Ouro diz 'A Prata mente'. Apenas um copo diz a verdade. Onde está o olho?",
            opcoes: [
                { texto: "No copo de Ouro.", tipo: "senha", correta: false, paranoia: 50, resposta: "Se estivesse no ouro, Prata diria a verdade e Cobre também. Errado!" },
                { texto: "No copo de Prata.", tipo: "senha", correta: true, paranoia: -20, resposta: "Exato. O Cobre diz a verdade, os outros mentem. Inteligente." },
                { texto: "No copo de Cobre.", tipo: "senha", correta: false, paranoia: 50, resposta: "Se estivesse no cobre, todos estariam mentindo. Errado." }
            ]
        }
    ],

    // --- ATO II: A Profundeza (Níveis 6 a 10) ---
    6: [
        {
            falaNPC: "Você tem sobrevivido, mas os riscos aumentam. O que você faria se a guarda entrasse no beco agora?",
            opcoes: [
                { texto: "Eu fugiria correndo.", tipo: "normal", paranoia: 40, resposta: "Covarde. Chamaria a atenção para mim." },
                { texto: "Eu mataria os guardas.", tipo: "normal", paranoia: 30, resposta: "Psicopata. Isso traria o exército inteiro." },
                { texto: "Eu seria apenas um mendigo pedindo esmolas.", tipo: "normal", paranoia: 0, resposta: "Camuflagem perfeita. As sombras aprovam." }
            ]
        },
        {
            falaNPC: "Charada rápida: Nasço das trevas, morro na luz. Se me olha, não sou nada. Se não me olha, cresço. Quem sou?",
            opcoes: [
                { texto: "A Sombra.", tipo: "senha", correta: false, paranoia: 30, resposta: "A sombra existe na luz. Errado." },
                { texto: "O Medo.", tipo: "senha", correta: true, paranoia: -10, resposta: "Sim. O medo cresce no escuro da mente." },
                { texto: "A Morte.", tipo: "senha", correta: false, paranoia: 30, resposta: "A morte não liga se você a olha ou não." }
            ]
        }
    ],
    7: [
        {
            falaNPC: "O Ritual exige oferendas. Escolha o que me entregar no balcão.",
            opcoes: [
                { texto: "Um frasco do meu próprio sangue.", tipo: "normal", paranoia: -10, resposta: "Sangue fresco... Um tributo aceito." },
                { texto: "Um anel roubado de um cadáver.", tipo: "normal", paranoia: 15, resposta: "Itens amaldiçoados trazem má sorte." },
                { texto: "🎲 [Sorte 20%] Não oferecer nada e exigir respeito.", tipo: "sorte", chanceSucesso: 0.2, paranoiaSucesso: -40, respostaSucesso: "Uma audácia de rei! Tome suas cartas.", paranoiaFalha: 60, respostaFalha: "A insolência será o seu fim!" }
            ]
        }
    ],
    8: [
        {
            falaNPC: "Uma testemunha disse que viu você conversando com o Inquisidor Chefe ontem. Explique-se.",
            opcoes: [
                { texto: "Eu estava sendo interrogado.", tipo: "normal", paranoia: 30, resposta: "E o que você contou a ele, rato?!" },
                { texto: "Isso é impossível. Eu estava nas docas.", tipo: "normal", paranoia: 20, resposta: "Não tenho informantes nas docas para confirmar..." },
                { texto: "A testemunha está morta. Eu cortei a língua dela.", tipo: "normal", paranoia: -20, resposta: "Brutal. Mas eficiente. Estamos quites." }
            ]
        }
    ],
    9: [
        {
            falaNPC: "Coloquei seis frascos na mesa. Cinco contêm água, um contém ácido mortal. Beba um para provar sua lealdade.",
            opcoes: [
                { texto: "🎲 [Roleta Russa 83%] Beber o frasco da Esquerda.", tipo: "sorte", chanceSucesso: 0.83, paranoiaSucesso: -30, respostaSucesso: "(Gole)... Água. Você passou no teste.", paranoiaFalha: 100, respostaFalha: "(Gole)... AAAAAARGH! Sua garganta queima!" },
                { texto: "🎲 [Roleta Russa 83%] Beber o frasco do Centro.", tipo: "sorte", chanceSucesso: 0.83, paranoiaSucesso: -30, respostaSucesso: "(Gole)... Água. Você passou no teste.", paranoiaFalha: 100, respostaFalha: "(Gole)... AAAAAARGH! Ácido puro!" },
                { texto: "Me recuso a participar dessa loucura.", tipo: "normal", paranoia: 60, resposta: "Então você não é digno das cartas." }
            ]
        }
    ],
    10: [
        {
            falaNPC: "Você chegou longe. Decifre a charada do Tempo: 'O que devora todas as coisas: pássaros, feras, árvores e flores; Rói o ferro, morde o aço; Mói a pedra dura em pedaço?'",
            opcoes: [
                { texto: "O Fogo.", tipo: "senha", correta: false, paranoia: 40, resposta: "Fogo não mói pedras. Pense, mortal!" },
                { texto: "O Tempo.", tipo: "senha", correta: true, paranoia: -20, resposta: "Exato. O devorador de mundos." },
                { texto: "A Ferrugem.", tipo: "senha", correta: false, paranoia: 40, resposta: "Ferrugem não come pássaros." }
            ]
        },
        {
            falaNPC: "E agora... O que é mais leve que uma pluma, mas nem um gigante consegue segurar por muito tempo?",
            opcoes: [
                { texto: "A Respiração.", tipo: "senha", correta: true, paranoia: -20, resposta: "Sim... Sua mente está pronta para a Entidade Primordial." },
                { texto: "A Poeira.", tipo: "senha", correta: false, paranoia: 50, resposta: "Você tropeçou no último degrau." }
            ]
        }
    ],

    // --- ATO III: A Loucura (Níveis 11 a 15) ---
    11: [
        {
            falaNPC: "Tudo que você diz ecoa no vazio. Se eu estou feliz, você deve estar triste. Se eu falo a verdade, você deve...?",
            opcoes: [
                { texto: "Falar a verdade.", tipo: "senha", correta: false, paranoia: 35, resposta: "Você falhou na simetria do caos." },
                { texto: "Mentir.", tipo: "senha", correta: true, paranoia: -10, resposta: "O espelho está alinhado." }
            ]
        },
        {
            falaNPC: "Então me diga uma mentira agora. Quem é você?",
            opcoes: [
                { texto: "Eu sou o investigador que veio te prender.", tipo: "normal", paranoia: -15, resposta: "Hahaha! Uma mentira ousada. Gosto disso." },
                { texto: "Eu sou um comprador de cartas.", tipo: "normal", paranoia: 50, resposta: "Isso é a verdade! Você falhou no jogo!" }
            ]
        }
    ],
    12: [
        {
            falaNPC: "Meu estoque diminui. Quero algo em troca que não seja ouro. O que você me dá?",
            opcoes: [
                { texto: "A memória do meu primeiro amor.", tipo: "normal", paranoia: -20, resposta: "Ah... Delicioso. Uma memória pura corrompida." },
                { texto: "Dez moedas de prata raras.", tipo: "normal", paranoia: 40, resposta: "Eu disse sem ouro ou metais, idiota!" },
                { texto: "🎲 [Sorte 10%] O meu nome verdadeiro.", tipo: "sorte", chanceSucesso: 0.1, paranoiaSucesso: -50, respostaSucesso: "Um sacrifício absoluto. Você tem meu respeito.", paranoiaFalha: 80, respostaFalha: "Nomes humanos não valem nada para mim!" }
            ]
        }
    ],
    13: [
        {
            falaNPC: "Puzzle dos Venenos: Frasco Azul cura, Vermelho mata, Verde paralisa. O Azul não está no meio. O Verde está à esquerda do Vermelho. Qual cura?",
            opcoes: [
                { texto: "O frasco da Esquerda.", tipo: "senha", correta: false, paranoia: 40, resposta: "Errado. O da esquerda era o Verde." },
                { texto: "O frasco do Meio.", tipo: "senha", correta: false, paranoia: 40, resposta: "Eu disse que o Azul não está no meio!" },
                { texto: "O frasco da Direita.", tipo: "senha", correta: true, paranoia: -20, resposta: "Perfeito. Esquerda verde, Meio vermelho, Direita azul." }
            ]
        }
    ],
    14: [
        {
            falaNPC: "Complete o cântico profano: 'No mar escuro a alma afunda, onde a luz não tem poder...'",
            opcoes: [
                { texto: "E o fogo queima no abismo.", tipo: "senha", correta: false, paranoia: 40, resposta: "Heresia! Errou o cântico!" },
                { texto: "E a fera cega vem comer.", tipo: "senha", correta: true, paranoia: -15, resposta: "Você conhece os textos sagrados. Impressionante." },
                { texto: "Onde os mortos voltam a viver.", tipo: "senha", correta: false, paranoia: 40, resposta: "Clichê demais para as sombras." }
            ]
        }
    ],
    15: [
        {
            falaNPC: "O jogo do Arquiteto. Um corredor tem três portas. A primeira tem chamas eternas. A segunda tem assassinos que matam qualquer um. A terceira tem leões que não comem há 3 anos. Qual é segura?",
            opcoes: [
                { texto: "A porta dos assassinos.", tipo: "senha", correta: false, paranoia: 50, resposta: "Eles te matariam na hora." },
                { texto: "A porta das chamas.", tipo: "senha", correta: false, paranoia: 50, resposta: "Você virou cinzas." },
                { texto: "A porta dos leões.", tipo: "senha", correta: true, paranoia: -20, resposta: "Claro... Leões sem comer há 3 anos estão mortos. Você é sagaz." }
            ]
        }
    ],

    // --- ATO IV: O Sacrifício (Níveis 16 a 20) ---
    16: [
        {
            falaNPC: "A Praga está solta na cidade. Mostre-me seus braços. Você tem marcas negras?",
            opcoes: [
                { texto: "Não, estou limpo.", tipo: "normal", paranoia: 30, resposta: "Todos escondem as marcas. Suspeito." },
                { texto: "Tenho uma pequena cicatriz, mas não é a Praga.", tipo: "normal", paranoia: -10, resposta: "A meia-verdade é a melhor defesa." },
                { texto: "🎲 [Blefe 50%] Sim, estou infectado. Fique longe ou te passo.", tipo: "sorte", chanceSucesso: 0.5, paranoiaSucesso: -30, respostaSucesso: "(O Vendedor recua). Pegue logo isso e suma!", paranoiaFalha: 60, respostaFalha: "A Praga não me afeta. Mas sua mentira me insulta." }
            ]
        }
    ],
    17: [
        {
            falaNPC: "Rápido! Sem pensar! O que é mais pesado: Um quilo de ferro amaldiçoado ou um quilo de almas penadas?",
            opcoes: [
                { texto: "O ferro amaldiçoado.", tipo: "senha", correta: false, paranoia: 40, resposta: "Um quilo é um quilo, seu tolo." },
                { texto: "Pesam o mesmo.", tipo: "senha", correta: false, paranoia: 40, resposta: "Na física sim... mas aqui não seguimos a física." },
                { texto: "As almas penadas.", tipo: "senha", correta: true, paranoia: -20, resposta: "Sim. O peso do arrependimento é infinito." }
            ]
        }
    ],
    18: [
        {
            falaNPC: "Esfinge Sombria. Primeira pergunta: Eu sempre chego, mas nunca existo hoje. Quem sou?",
            opcoes: [
                { texto: "O Amanhã.", tipo: "senha", correta: true, paranoia: 0, resposta: "Sim. Próxima." },
                { texto: "A Morte.", tipo: "senha", correta: false, paranoia: 50, resposta: "A morte existe hoje. Errado!" }
            ]
        },
        {
            falaNPC: "Segunda pergunta: Quanto mais você tira de mim, maior eu fico. O que sou?",
            opcoes: [
                { texto: "O Ódio.", tipo: "senha", correta: false, paranoia: 50, resposta: "Errado!" },
                { texto: "Um Buraco.", tipo: "senha", correta: true, paranoia: -20, resposta: "Você sobreviveu à Esfinge." }
            ]
        }
    ],
    19: [
        {
            falaNPC: "Penúltimo degrau da sanidade. Você deve me entregar o nome da pessoa que você mais odeia, para que as sombras a levem.",
            opcoes: [
                { texto: "Dizer o nome de um inimigo.", tipo: "normal", paranoia: -20, resposta: "O contrato está selado. Ele sofrerá." },
                { texto: "Dizer o seu próprio nome.", tipo: "normal", paranoia: -40, resposta: "Auto-ódio... O sacrifício mais puro de todos." },
                { texto: "Me recuso a condenar alguém.", tipo: "normal", paranoia: 80, resposta: "Moralidade não tem lugar no Beco." }
            ]
        }
    ],
    20: [
        {
            falaNPC: "O Fim. A Entidade Primordial aguarda. Para liberar o selo mestre das cartas, qual é a única regra irrefutável do Balcão das Sombras?",
            opcoes: [
                { texto: "A escuridão perdoa os fracos.", tipo: "senha", correta: false, paranoia: 100, resposta: "Nunca houve perdão." },
                { texto: "Apenas os ricos sobrevivem.", tipo: "senha", correta: false, paranoia: 100, resposta: "O ouro derrete no fogo negro." },
                { texto: "Quem faz perguntas demais, morre.", tipo: "senha", correta: true, paranoia: -50, resposta: "Exato... Vá e enfrente seu destino." }
            ]
        }
    ]
};

// --- FUNÇÕES DE NAVEGAÇÃO ENTRE TELAS ---
// Mostra apenas a tela desejada e esconde as outras
function mudarTela(telaParaMostrar) {
    const telas = [telaInicial, telaMenu, telaHistoria, telaNegociacao, telaCombate, telaGameover, telaVitoria];
    telas.forEach(tela => {
        tela.className = 'tela-oculta tela-fundo';
        const video = tela.querySelector('video');
        if (video) video.pause(); // Pausa o vídeo da tela escondida
    });

    document.getElementById('efeito-sangue').classList.remove('sangue-ativo');
    document.getElementById('efeito-luz').classList.remove('luz-ativa');

    telaParaMostrar.className = 'tela-ativa tela-fundo';

    const videoAtivo = telaParaMostrar.querySelector('video');
    if (videoAtivo) {

        videoAtivo.play().catch(erro => console.log("Navegador atrasou o vídeo:", erro));
    }
}
function voltarAoMenu() {
    clearInterval(cronometroInimigo);
    renderizarMenu();
    mudarTela(telaMenu);
}

// --- LÓGICA DE INÍCIO DE JOGO ---
function iniciarNivel(numeroNivel) {
    nivelAtualJogado = numeroNivel;
    paranoia = 0;
    poderInimigo = 100;
    rodadaAtual = 0;
    nivelAtualTxt.innerText = numeroNivel;
    paranoiaValorTxt.innerText = "0%";
    poderInimigoTxt.innerText = "100";
    historicoChat.innerHTML = "";
    document.getElementById('efeito-sangue').classList.remove('sangue-ativo');
    document.getElementById('efeito-luz').classList.remove('luz-ativa');

    const nivelParaCarregar = numeroNivel <= 20 ? numeroNivel : 20;
    cenasDestaPartida = bancoDeNiveis[nivelParaCarregar];

    mudarTela(telaNegociacao);

    // SISTEMA DE DIFICULDADE DINÂMICA
    if (numeroNivel <= 5) { poderGanhoPorSegundo = 0.5; }
    else if (numeroNivel <= 10) { poderGanhoPorSegundo = 1.5; }
    else if (numeroNivel <= 15) { poderGanhoPorSegundo = 2; }
    else { poderGanhoPorSegundo = 4; }
    iniciarCronometro();

    historicoChat.innerHTML += `<p class="fala-npc"><strong>Vendedor:</strong> ${cenasDestaPartida[0].falaNPC}</p>`;
    carregarOpcoesDeDialogo();
}
// --- LÓGICA DAS ESCOLHAS (Adaptação da versão anterior) ---

function carregarOpcoesDeDialogo() {
    containerOpcoes.innerHTML = "";

    if (rodadaAtual >= cenasDestaPartida.length) {
        const btnFinalizar = document.createElement('button');
        btnFinalizar.innerText = "🗝️ [ Pegar as cartas e ir para o Confronto ]";
        btnFinalizar.style.backgroundColor = "#2b5c2b";
        btnFinalizar.onclick = iniciarCombate;
        containerOpcoes.appendChild(btnFinalizar);
        return;
    }

    const cenaAtual = cenasDestaPartida[rodadaAtual];

    cenaAtual.opcoes.forEach(opcao => {
        const botao = document.createElement('button');
        botao.innerText = opcao.texto;
        botao.onclick = () => processarEscolha(opcao, cenaAtual);
        containerOpcoes.appendChild(botao);
    });
}

function processarEscolha(opcao, cenaAtual) {
    historicoChat.innerHTML += `<p class="fala-jogador"><strong>Você:</strong> ${opcao.texto}</p>`;
    let respostaDoVendedor = "";
    containerOpcoes.innerHTML = "";

    if (opcao.tipo === "normal" || opcao.tipo === "senha") {
        paranoia += opcao.paranoia;
        respostaDoVendedor = opcao.resposta;
    } else if (opcao.tipo === "sorte") {
        if (Math.random() <= opcao.chanceSucesso) {
            paranoia += opcao.paranoiaSucesso;
            respostaDoVendedor = `(Sucesso!) ${opcao.respostaSucesso}`;
        } else {
            paranoia += opcao.paranoiaFalha;
            respostaDoVendedor = `(Falha!) ${opcao.respostaFalha}`;
        }
    }

    if (paranoia > 100) paranoia = 100;
    if (paranoia < 0) paranoia = 0;
    paranoiaValorTxt.innerText = `${paranoia}%`;

    if (paranoia >= 100) {
        clearInterval(cronometroInimigo);
        setTimeout(derrotaNegociacao, 800); // Chama a derrota específica do Beco
        return;
    }

    setTimeout(() => {
        historicoChat.innerHTML += `<p class="fala-npc"><strong>Vendedor:</strong> ${respostaDoVendedor}</p>`;
        historicoChat.scrollTop = historicoChat.scrollHeight;

        rodadaAtual++;

        if (rodadaAtual < cenasDestaPartida.length) {
            setTimeout(() => {
                historicoChat.innerHTML += `<p class="fala-npc"><strong>Vendedor:</strong> ${cenasDestaPartida[rodadaAtual].falaNPC}</p>`;
                historicoChat.scrollTop = historicoChat.scrollHeight;
                carregarOpcoesDeDialogo();
            }, 1000);
        } else {
            carregarOpcoesDeDialogo();
        }
    }, 800);
}// --- LÓGICA DA FASE B: O TCG COMPLETO ---

const poderAtualInimigoTxt = document.getElementById('poder-atual-inimigo');
const sanidadeJogadorTxt = document.getElementById('sanidade-jogador');
const feedbackCombate = document.getElementById('feedback-combate');
const maoJogador = document.getElementById('mao-jogador');

let sanidadeJogador = 100;
let maoAtual = [];

const bancoDeCartas = [
    { id: 1, nome: "Lâmina Sussurrante", tipo: "ataque", descricao: "Rasga a essência da entidade.", valor: 25, imagem: "imagens/carta-lamina.png" },
    { id: 2, nome: "Palavra de Poder", tipo: "ataque", descricao: "Um som que destrói a escuridão.", valor: 40, imagem: "imagens/carta-palavra.png" },
    { id: 3, nome: "Pó de Estrela", tipo: "ataque", descricao: "Queima a entidade com luz pura.", valor: 15, imagem: "imagens/carta-po.png" },
    { id: 4, nome: "Selo da Mente", tipo: "defesa", descricao: "Restaura os fragmentos da sua sanidade.", valor: 30, imagem: "imagens/carta-selo.png" },
    { id: 5, nome: "Elixir do Esquecimento", tipo: "defesa", descricao: "Acalma o pânico e cura a mente.", valor: 45, imagem: "imagens/carta-elixir.png" },
    { id: 6, nome: "Coroa de Ossos", tipo: "ataque", descricao: "Invoca os mortos para atacar a entidade.", valor: 35, imagem: "imagens/carta-coroa.png" },
    { id: 7, nome: "Manto da Névoa", tipo: "defesa", descricao: "Esconde sua mente dos ataques da entidade.", valor: 25, imagem: "imagens/carta-manto.png" },
    { id: 8, nome: "Arco e flecha", tipo: "ataque", descricao: "Um ataque rápido que desgasta a entidade.", valor: 20, imagem: "imagens/carta-arco.png" },
    { id: 9, nome: "Amuleto da Serenidade", tipo: "defesa", descricao: "Reduz o dano recebido por um turno.", valor: 20, imagem: "imagens/carta-amuleto.png" },
    { id: 10, nome: "Luz do Amanhecer", tipo: "ataque", descricao: "Um ataque poderoso que pode acabar com a entidade.", valor: 50, imagem: "imagens/carta-luz.png" },
    { id: 11, nome: "Véu da Ilusão", tipo: "defesa", descricao: "Confunde a entidade, reduzindo seu próximo ataque em 50%.", valor: 25, imagem: "imagens/carta-veu.png" },
    { id: 12, nome: "Garras do Desespero", tipo: "ataque", descricao: "Ataque desesperado, dano baseado na sanidade perdida (dano = 1.5x sanidade perdida).", valor: 20, imagem: "imagens/carta-garras.png" },
    { id: 13, nome: "Cura da Alma", tipo: "defesa", descricao: "Restaura sanidade baseada no poder atual do inimigo.", valor: 10, imagem: "imagens/carta-cura.png" },
    { id: 14, nome: "Explosão de Paranoia", tipo: "ataque", descricao: "Causa dano baseado na sua paranoia atual (dano = 0.3x paranoia).", valor: 24, imagem: "imagens/carta-explosao.png" },
    { id: 15, nome: "Barreira de Sangue", tipo: "defesa", descricao: "Absorve dano igual a 20% da sua sanidade atual.", valor: 25, imagem: "imagens/carta-barreira.png" },
    { id: 16, nome: "Foice do Vazio", tipo: "ataque", descricao: "Dano massivo. Apenas para os dignos.", valor: 100, imagem: "imagens/carta-foice.png", nivelMinimo: 17 },
    { id: 17, nome: "Aura Divina", tipo: "defesa", descricao: "Uma cura divina de alto nível.", valor: 80, imagem: "imagens/carta-aura.png", nivelMinimo: 17 },
    { id: 18, nome: "Chama Eterna", tipo: "ataque", descricao: "Um ataque que queima a própria essência da entidade.", valor: 60, imagem: "imagens/carta-chama.png", nivelMinimo: 15 },
    { id: 19, nome: "Escudo de Cristal", tipo: "defesa", descricao: "Cria uma barreira que reflete parte do dano de volta à entidade.", valor: 50, imagem: "imagens/carta-escudo.png", nivelMinimo: 15 },
    { id: 20, nome: "Espada do Caos", tipo: "ataque", descricao: "Um ataque caótico que causa dano aleatório entre 10 e 100.", valor: 55, imagem: "imagens/carta-espada.png", nivelMinimo: 10 }
];

function iniciarCombate() {
    mudarTela(telaCombate);

    // Reseta o texto visual
    const statusEntidade = document.getElementById('status-entidade-combate');
    if (statusEntidade) {
        statusEntidade.innerText = "(Aumentando...)";
        statusEntidade.style.color = "#cca43b";
    }

    poderAtualInimigoTxt.innerText = poderInimigo;
    sanidadeJogador = 100;
    sanidadeJogadorTxt.innerText = sanidadeJogador;
    feedbackCombate.innerText = "A entidade avança contra sua mente! Jogue uma carta rápido!";

    maoAtual = [];
    comprarCartas(4);
}

function comprarCartas(quantidade) {
    // FILTRO INTELIGENTE: Pega apenas as cartas que não têm nivelMinimo OU que o nivelMinimo é menor/igual ao nível atual
    const cartasDisponiveis = bancoDeCartas.filter(carta => !carta.nivelMinimo || carta.nivelMinimo <= nivelAtualJogado);

    for (let i = 0; i < quantidade; i++) {
        // Sorteia apenas das cartas liberadas para este nível
        const cartaSorteada = cartasDisponiveis[Math.floor(Math.random() * cartasDisponiveis.length)];
        maoAtual.push(cartaSorteada);
    }
    renderizarMao();
}
function renderizarMao() {
    maoJogador.innerHTML = "";

    maoAtual.forEach((carta, index) => {
        const cartaDiv = document.createElement('div');
        cartaDiv.className = 'carta';

        const classeEfeito = carta.tipo === 'ataque' ? 'carta-ataque' : 'carta-defesa';
        const textoEfeito = carta.tipo === 'ataque' ? `Dano: ${carta.valor}` : `Cura: +${carta.valor}`;

        const imagemSrc = carta.imagem ? carta.imagem : "";
        const tagImagem = imagemSrc ? `<img src="${imagemSrc}" class="carta-arte" alt="${carta.nome}">` : `<div class="carta-arte" style="background-color: #222; display: flex; align-items: center; justify-content: center; font-size: 0.7em; color: #555;">Sem Arte</div>`;

        cartaDiv.innerHTML = `
            ${tagImagem}
            <div class="carta-conteudo">
                <div class="carta-titulo">${carta.nome}</div>
                <div class="carta-descricao">${carta.descricao}</div>
                <div class="carta-efeito ${classeEfeito}">${textoEfeito}</div>
            </div>
        `;

        cartaDiv.onclick = () => jogarCarta(index, carta);

        maoJogador.appendChild(cartaDiv);
    });
}

// O TURNO DO JOGADOR
function jogarCarta(indexCarta, cartaJogada) {
    if (cartaJogada.tipo === 'ataque') {
        poderInimigo -= cartaJogada.valor;
        if (poderInimigo < 0) poderInimigo = 0;
        poderAtualInimigoTxt.innerText = poderInimigo;
        feedbackCombate.innerText = `Você atacou com ${cartaJogada.nome}! (-${cartaJogada.valor} na Entidade)`;
        feedbackCombate.style.color = "#cca43b";

        // Animação de Dano!
        const statusEntidade = document.getElementById('status-entidade-combate');
        if (statusEntidade) {
            statusEntidade.innerText = `(-${cartaJogada.valor} DANO!)`;
            statusEntidade.style.color = "#ff4444";
            setTimeout(() => {
                if (poderInimigo > 0) {
                    statusEntidade.innerText = "(Aumentando...)";
                    statusEntidade.style.color = "#cca43b";
                }
            }, 1500);
        }
    }
    else if (cartaJogada.tipo === 'defesa') {
        sanidadeJogador += cartaJogada.valor;
        if (sanidadeJogador > 100) sanidadeJogador = 100;
        sanidadeJogadorTxt.innerText = sanidadeJogador;
        feedbackCombate.innerText = `Você usou ${cartaJogada.nome}! (+${cartaJogada.valor} Sanidade)`;
        feedbackCombate.style.color = "#4a90e2";
    }

    maoAtual.splice(indexCarta, 1);
    maoJogador.innerHTML = "";

    // MATA O RELÓGIO SE A ENTIDADE MORRER
    if (poderInimigo <= 0) {
        poderInimigo = 0;
        poderAtualInimigoTxt.innerText = "0";
        clearInterval(cronometroInimigo);
        const statusEntidade = document.getElementById('status-entidade-combate');
        if (statusEntidade) statusEntidade.innerText = "(DESTRUÍDA!)";

        setTimeout(vitoria, 1000);
        return;
    }

    setTimeout(turnoDaEntidade, 1500);
}
// O TURNO DA ENTIDADE
function turnoDaEntidade() {
    // A Entidade causa um dano aleatório entre 10 e 25
    const danoEntidade = Math.floor(Math.random() * 16) + 10;

    sanidadeJogador -= danoEntidade;
    if (sanidadeJogador < 0) sanidadeJogador = 0;
    sanidadeJogadorTxt.innerText = sanidadeJogador;

    feedbackCombate.innerText = `A Entidade invadiu sua mente! Você sofreu ${danoEntidade} de dano à Sanidade!`;
    feedbackCombate.style.color = "#b82323";

    // Verifica se o jogador perdeu
    if (sanidadeJogador === 0) {
        setTimeout(derrotaNoCombate, 1500);
        return;
    }

    // Se ninguém morreu, o jogador compra 1 carta nova para o próximo turno
    setTimeout(() => {
        feedbackCombate.innerText = "Seu turno. Escolha com sabedoria.";
        feedbackCombate.style.color = "#cca43b";
        comprarCartas(1);
    }, 1500);
}
function vitoria() {
    clearInterval(cronometroInimigo);
    if (nivelAtualJogado === nivelDesbloqueado && nivelDesbloqueado < 20) {
        nivelDesbloqueado++;
        localStorage.setItem('progressoBalcao', nivelDesbloqueado);
    }

    if (nivelAtualJogado < 20) {
        btnProximaFase.style.display = "inline-block";
        btnProximaFase.innerText = `Próxima Fase (Nível ${nivelAtualJogado + 1}) ➔`;
    } else {
        btnProximaFase.style.display = "none";
    }

    document.getElementById('efeito-luz').classList.add('luz-ativa');
    mudarTela(telaVitoria);
}

function derrotaNoCombate() {
    clearInterval(cronometroInimigo);
    document.getElementById('titulo-derrota').innerText = "Sua mente sucumbiu.";
    document.getElementById('texto-derrota').innerText = "Você foi derrotado pelo poder do mal.";
    document.getElementById('efeito-sangue').classList.add('sangue-ativo');
    mudarTela(telaGameover);
}

function derrotaNegociacao() {
    document.getElementById('titulo-derrota').innerText = "Você fez perguntas demais.";
    document.getElementById('texto-derrota').innerText = "A paranoia chegou a 100%. O Vendedor chamou as sombras.";
    document.getElementById('efeito-sangue').classList.add('sangue-ativo');
    mudarTela(telaGameover);
}
function irParaProximaFase() {
    iniciarNivel(nivelAtualJogado + 1);
}

// --- SISTEMA DE PAUSA E GLOSSÁRIO ---

// Função separada para ligar o relógio do inimigo na Fase A
function iniciarCronometro() {
    clearInterval(cronometroInimigo);
    cronometroInimigo = setInterval(() => {
        poderInimigo += poderGanhoPorSegundo;
        poderInimigoTxt.innerText = poderInimigo;
        poderAtualInimigoTxt.innerText = poderInimigo;
    }, 1000);
}

function pausarJogo() {
    clearInterval(cronometroInimigo);


    document.querySelectorAll('video').forEach(video => video.pause());

    document.getElementById('tela-pausa').style.display = 'flex';
    document.getElementById('tela-pausa').style.opacity = '1';

    renderizarGlossario();
}

function retomarJogo() {
    document.getElementById('tela-pausa').style.display = 'none';

    const telaAtiva = document.querySelector('.tela-ativa');
    if (telaAtiva) {
        const video = telaAtiva.querySelector('video');
        if (video) video.play().catch(e => console.log(e));
    }

    if (telaNegociacao.classList.contains('tela-ativa') || telaCombate.classList.contains('tela-ativa')) {
        iniciarCronometro();
    }
}

function voltarAoMenuPausado() {
    document.getElementById('tela-pausa').style.display = 'none';
    voltarAoMenu();
}

// Gera o compêndio de cartas lendo o bancoDeCartas
function renderizarGlossario() {
    const container = document.getElementById('glossario-cartas');
    container.innerHTML = "";

    bancoDeCartas.forEach(carta => {
        const cartaDiv = document.createElement('div');
        cartaDiv.className = 'carta';
        cartaDiv.style.cursor = 'default';

        const classeEfeito = carta.tipo === 'ataque' ? 'carta-ataque' : 'carta-defesa';
        const textoEfeito = carta.tipo === 'ataque' ? `Dano: ${carta.valor}` : `Cura: +${carta.valor}`;
        const imagemSrc = carta.imagem ? carta.imagem : "";
        const tagImagem = imagemSrc ? `<img src="${imagemSrc}" class="carta-arte">` : `<div class="carta-arte" style="background-color: #222; display: flex; align-items: center; justify-content: center; font-size: 0.7em; color: #555;">Sem Arte</div>`;

        cartaDiv.innerHTML = `
            ${tagImagem}
            <div class="carta-conteudo">
                <div class="carta-titulo">${carta.nome}</div>
                <div class="carta-descricao">${carta.descricao}</div>
                <div class="carta-efeito ${classeEfeito}">${textoEfeito}</div>
            </div>
        `;
        container.appendChild(cartaDiv);
    });
}

// --- SISTEMA DE HISTÓRIA / MÁQUINA DE ESCREVER ---

const textoLore = "A escuridão não foi um acidente. Você a invocou. Agora, a Entidade espreita nos cantos da sua mente, faminta pela sua sanidade. Sozinho, você é fraco. Apenas uma presa.\n\nMas existe uma esperança no submundo...\n\nUm Vendedor sem rosto possui as cartas necessárias para banir o mal. Negocie com ele. Meça suas palavras. Se ele suspeitar que você é um investigador, as sombras engolirão você antes mesmo do combate começar.\n\nO relógio está correndo. Boa sorte.";
let indexDigitacao = 0;
let intervaloDigitacao;

function iniciarHistoria() {
    mudarTela(telaHistoria);
    const campoTexto = document.getElementById('texto-historia');
    const botaoPular = document.getElementById('btn-pular-historia');

    campoTexto.innerHTML = "";
    campoTexto.classList.add('cursor-digitacao');
    botaoPular.innerText = "Pular Introdução ➔";
    botaoPular.style.backgroundColor = "#333";

    indexDigitacao = 0;
    clearInterval(intervaloDigitacao);

    intervaloDigitacao = setInterval(() => {
        if (indexDigitacao < textoLore.length) {
            let char = textoLore.charAt(indexDigitacao);

            if (char === '\n') {
                campoTexto.innerHTML += "<br>";
            } else {
                campoTexto.innerHTML += char;
            }
            indexDigitacao++;
        } else {
            // Quando a história acaba, para o timer e muda a cor do botão
            clearInterval(intervaloDigitacao);
            campoTexto.classList.remove('cursor-digitacao');
            botaoPular.innerText = "Ir para o Menu ➔";
            botaoPular.style.backgroundColor = "#b82323";
        }
    }, 80);
}

function pularHistoria() {
    clearInterval(intervaloDigitacao);
    renderizarMenu();
    mudarTela(telaMenu);
}

// Isso aqui é a PRIMEIRA coisa que roda quando a página carrega
renderizarMenu();