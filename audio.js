// --- MOTOR SENSORIAL (ÁUDIO E VIBRAÇÃO) ---

const vibrar = (padrao) => {
    if (navigator.vibrate) navigator.vibrate(padrao);
};

// Efeitos Sonoros (SFX)
const sfx = {
    click: new Audio('audios/click.mp3'),
    danoEntidade: new Audio('audios/dano-entidade.mp3'),
    danoJogador: new Audio('audios/dano-jogador.mp3'),
    carta: new Audio('audios/carta.mp3'),
    typing: new Audio('audios/typing.mp3') // Adicionado o som de digitação
};

// Trilhas Sonoras (BGM)
const bgm = {
    menu: new Audio('audios/bgm-menu.mp3'),
    beco: new Audio('audios/bgm-beco.mp3')
};

// Configurações de volume e loop
Object.values(sfx).forEach(audio => audio.volume = 0.6);
Object.values(bgm).forEach(audio => {
    audio.volume = 0.4;
    audio.loop = true; // A música de fundo se repete para sempre
});
sfx.typing.loop = true; // O som de digitação também repete até o texto acabar

// 3. Função Global Otimizada (Zero Latência)
const tocarSom = (som) => {
    if (sfx[som]) {
        // TRUQUE DO CLONE: Em vez de rebobinar, ele cria uma cópia instantânea na memória
        // Isso permite tocar o som várias vezes sobrepostas sem engasgar!
        const somClone = sfx[som].cloneNode();
        somClone.volume = sfx[som].volume; // O clone precisa herdar o volume original
        somClone.play().catch(e => console.log("Aguardando interação do usuário", e));
    }
};

let musicaAtual = null;

// Função inteligente que troca a música de fundo
const tocarMusica = (trilha) => {
    if (musicaAtual && musicaAtual !== bgm[trilha]) {
        musicaAtual.pause();
        musicaAtual.currentTime = 0;
    }
    if (trilha && bgm[trilha]) {
        musicaAtual = bgm[trilha];
        musicaAtual.play().catch(e => console.log("Música aguardando clique:", e));
    }
};

// Função para pausar todas as músicas (para os vídeos falarem)
const pararMusica = () => {
    if (musicaAtual) {
        musicaAtual.pause();
        musicaAtual.currentTime = 0;
        musicaAtual = null;
    }
};

// Controle específico da máquina de escrever
const toggleTyping = (ligar) => {
    if (ligar) sfx.typing.play().catch(e => e);
    else { sfx.typing.pause(); sfx.typing.currentTime = 0; }
};

// 4. MÁGICA: Muda de 'click' para 'pointerdown' (Dispara no milissegundo que encostar!)
document.addEventListener('pointerdown', (evento) => {
    // Usamos o closest('button') para garantir que o clique pegou, mesmo se for no texto de dentro
    if (evento.target.closest('button')) {
        tocarSom('click');
        if (musicaAtual && musicaAtual.paused) musicaAtual.play();
    }
});