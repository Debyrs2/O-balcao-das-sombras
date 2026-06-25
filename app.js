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

function renderizarMenu() {
    gradeNiveis.innerHTML = "";
    for (let i = 1; i <= 30; i++) {
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

// --- FUNÇÕES DE NAVEGAÇÃO ENTRE TELAS ---
// --- FUNÇÕES DE NAVEGAÇÃO ENTRE TELAS E ÁUDIO ---
function mudarTela(telaParaMostrar) {
    const telas = [telaInicial, telaMenu, telaHistoria, telaNegociacao, telaCombate, telaGameover, telaVitoria];

    telas.forEach(tela => {
        tela.className = 'tela-oculta tela-fundo';
        const video = tela.querySelector('video');
        if (video) {
            video.pause();
            video.muted = true; // Muta os vídeos escondidos (Mata o bug do som inicial!)
        }
    });

    document.getElementById('efeito-sangue').classList.remove('sangue-ativo');
    document.getElementById('efeito-luz').classList.remove('luz-ativa');

    telaParaMostrar.className = 'tela-ativa tela-fundo';

    // Se a tela nova tem vídeo, desmuta ele e dá play!
    const videoAtivo = telaParaMostrar.querySelector('video');
    if (videoAtivo) {
        videoAtivo.muted = false;
        videoAtivo.play().catch(erro => console.log("Navegador atrasou o vídeo:", erro));
    }

    // O MAESTRO DAS MÚSICAS:
    if (telaParaMostrar === telaInicial || telaParaMostrar === telaMenu || telaParaMostrar === telaHistoria) {
        tocarMusica('menu'); // Toca a trilha de suspense
    } else if (telaParaMostrar === telaNegociacao) {
        tocarMusica('beco'); // Toca a trilha de vento/sussurros
    } else if (telaParaMostrar === telaCombate || telaParaMostrar === telaGameover || telaParaMostrar === telaVitoria) {
        pararMusica(); // Desliga a música pro vídeo poder fazer o próprio barulho
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

    const nivelParaCarregar = numeroNivel <= 30 ? numeroNivel : 30;
    cenasDestaPartida = bancoDeNiveis[nivelParaCarregar];

    mudarTela(telaNegociacao);

    // SISTEMA DE DIFICULDADE DINÂMICA
    if (numeroNivel <= 5) { poderGanhoPorSegundo = 0.5; }
    else if (numeroNivel <= 10) { poderGanhoPorSegundo = 1; }
    else if (numeroNivel <= 15) { poderGanhoPorSegundo = 1.5; }
    else { poderGanhoPorSegundo = 2; }
    iniciarCronometro();

    historicoChat.innerHTML += `<p class="fala-npc"><strong>Vendedor:</strong> ${cenasDestaPartida[0].falaNPC}</p>`;
    carregarOpcoesDeDialogo();
}
// --- LÓGICA DAS ESCOLHAS (Adaptação da versão anterior) ---
function carregarOpcoesDeDialogo() {
    containerOpcoes.innerHTML = "";

    if (rodadaAtual >= cenasDestaPartida.length) {

        // Se terminar a conversa com 50% ou mais de Paranoia
        if (paranoia >= 50) {
            historicoChat.innerHTML += `<p class="fala-npc" style="color: #ff4444; font-size: 1.3em;"><strong>Vendedor:</strong> Pensando bem... você faz perguntas demais. Fede a investigador. A negociação acabou, suma daqui!</p>`;
            historicoChat.scrollTop = historicoChat.scrollHeight;
            clearInterval(cronometroInimigo);

            const btnDerrota = document.createElement('button');
            btnDerrota.innerText = "❌ [ O Vendedor te expulsou ]";
            btnDerrota.style.backgroundColor = "#b82323";
            btnDerrota.onclick = derrotaNegociacao;
            containerOpcoes.appendChild(btnDerrota);
            return;
        }

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
        setTimeout(() => {
            // O Vendedor dá um grito final
            historicoChat.innerHTML += `<p class="fala-npc" style="color: #ff4444; font-size: 1.3em;"><strong>Vendedor:</strong> CHEGA! VOCÊ É UM DELES! AS SOMBRAS, PEGUEM-NO!</p>`;
            historicoChat.scrollTop = historicoChat.scrollHeight;

            // O botão da morte aparece
            const btnDerrota = document.createElement('button');
            btnDerrota.innerText = "❌ [ As sombras te devoram ]";
            btnDerrota.style.backgroundColor = "#b82323";
            btnDerrota.onclick = derrotaNegociacao;
            containerOpcoes.appendChild(btnDerrota);
        }, 800);
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
}
// --- LÓGICA DA FASE B: O TCG COMPLETO ---

const poderAtualInimigoTxt = document.getElementById('poder-atual-inimigo');
const sanidadeJogadorTxt = document.getElementById('sanidade-jogador');
const feedbackCombate = document.getElementById('feedback-combate');
const maoJogador = document.getElementById('mao-jogador');

let sanidadeJogador = 100;
let maoAtual = [];

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

        cartaDiv.onpointerdown = () => jogarCarta(index, carta);

        maoJogador.appendChild(cartaDiv);
    });
}

// O TURNO DO JOGADOR
function jogarCarta(indexCarta, cartaJogada) {
    tocarSom('carta');

    if (cartaJogada.tipo === 'ataque') {
        poderInimigo -= cartaJogada.valor;
        if (poderInimigo < 0) poderInimigo = 0;
        poderAtualInimigoTxt.innerText = poderInimigo;
        feedbackCombate.innerText = `Você atacou com ${cartaJogada.nome}! (-${cartaJogada.valor} na Entidade)`;
        feedbackCombate.style.color = "#cca43b";

        tocarSom('danoEntidade');
        vibrar(100);

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
    const danoEntidade = Math.floor(Math.random() * 16) + 10;
    sanidadeJogador -= danoEntidade;
    if (sanidadeJogador < 0) sanidadeJogador = 0;
    sanidadeJogadorTxt.innerText = sanidadeJogador;

    feedbackCombate.innerText = `A Entidade invadiu sua mente! Você sofreu ${danoEntidade} de dano à Sanidade!`;
    feedbackCombate.style.color = "#b82323";

    tocarSom('danoJogador');
    vibrar([200, 100, 200]);

    if (sanidadeJogador === 0) {
        setTimeout(derrotaNoCombate, 1500);
        return;
    }

    setTimeout(() => {
        feedbackCombate.innerText = "Seu turno. Escolha com sabedoria.";
        feedbackCombate.style.color = "#cca43b";
        comprarCartas(1);
    }, 1500);
}

function vitoria() {
    clearInterval(cronometroInimigo);
    if (nivelAtualJogado === nivelDesbloqueado && nivelDesbloqueado < 30) {
        nivelDesbloqueado++;
        localStorage.setItem('progressoBalcao', nivelDesbloqueado);
    }

    if (nivelAtualJogado < 30) {
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
    clearInterval(cronometroInimigo);
    document.getElementById('titulo-derrota').innerText = "A Negociação Falhou.";
    document.getElementById('texto-derrota').innerText = "O Vendedor desconfiou de você e não entregou as cartas. Sem defesa, a Entidade devorou sua mente no beco.";
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

    toggleTyping(true); // LIGA O SOM DE DIGITAÇÃO!

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
            clearInterval(intervaloDigitacao);
            campoTexto.classList.remove('cursor-digitacao');
            botaoPular.innerText = "Ir para o Menu ➔";
            botaoPular.style.backgroundColor = "#b82323";
            toggleTyping(false); // DESLIGA O SOM QUANDO ACABA DE ESCREVER!
        }
    }, 80);
}

function pularHistoria() {
    clearInterval(intervaloDigitacao);
    toggleTyping(false); // Garante que o som de digitação pare se o jogador pular
    renderizarMenu();
    mudarTela(telaMenu);
}

// Isso aqui é a PRIMEIRA coisa que roda quando a página carrega
renderizarMenu();