// --- OS 30 NÍVEIS (TEMÁTICA: O INFILTRADO) ---
const nomesDosNiveis = [
    // ATO I: A Suspeita
    "O Novato", "O Contato", "O Teste de Rua", "A Emboscada Falsa", "Mãos Limpas",
    // ATO II: O Submundo
    "A Senha", "O Preço do Silêncio", "O Troféu", "O Rato", "A Propina",
    // ATO III: Guerra Psicológica
    "O Distintivo", "O Código", "Soro da Verdade", "O Beco sem Saída", "Fogo Cruzado",
    // ATO IV: A Teia de Mentiras
    "O Interrogatório", "A Isca", "O Arquivo Morto", "Sangue Frio", "O Xadrez",
    // ATO V: No Limite da Lei
    "A Invasão", "A Marca", "O álibi", "O Blefe", "A Lista",
    // ATO VI: A Revelação
    "O Chefe", "A Roleta", "O Ultimato", "A Confissão", "O Juízo Final"
];

const bancoDeNiveis = {
    // --- ATO I: A Suspeita ---
    1: [{
        falaNPC: "Você tem cara de quem dorme bem à noite. Quem te mandou aqui?",
        opcoes: [
            { texto: "Ouvir dizer que você vende o que não deveria.", tipo: "normal", paranoia: 20, resposta: "Falou como um guarda lendo um manual." },
            { texto: "Fui mandado pelo 'Cicatriz' das docas.", tipo: "normal", paranoia: -10, resposta: "O Cicatriz morreu ontem. Mas ok, você tentou." },
            { texto: "🎲 [Blefe 50%] Bater na mesa: 'Eu faço as perguntas aqui!'", tipo: "sorte", chanceSucesso: 0.5, paranoiaSucesso: -20, respostaSucesso: "Calma... gostei da atitude.", paranoiaFalha: 60, respostaFalha: "Acha que é a polícia para gritar comigo?!" }
        ]
    }],
    2: [{
        falaNPC: "Vamos ver se você é da rua. Qual é o preço de um grama de Pó Sombrio no mercado negro hoje?",
        opcoes: [
            { texto: "Cerca de 50 moedas de prata.", tipo: "senha", correta: false, paranoia: 50, resposta: "Preço de tabela da polícia. Nós vendemos por 10." },
            { texto: "Depende se o guarda da noite já cobrou a taxa dele.", tipo: "senha", correta: true, paranoia: -20, resposta: "Exato. Você conhece como as coisas funcionam." }
        ]
    }],
    3: [{
        falaNPC: "Se a milícia chutar a porta da frente agora, por onde a gente foge?",
        opcoes: [
            { texto: "Pela janela dos fundos.", tipo: "normal", paranoia: 40, resposta: "A janela tem grades de ferro, idiota." },
            { texto: "Nós não fugimos. Nós pagamos o Inspetor.", tipo: "normal", paranoia: -15, resposta: "Correto. Fugir é para quem não tem dinheiro." },
            { texto: "Eu cubro a sua saída com chumbo.", tipo: "normal", paranoia: 20, resposta: "Heróico demais. Cheira a investigador disfarçado." }
        ]
    }],
    4: [{
        falaNPC: "Deixe-me ver suas mãos... Elas não têm calos de puxar carroças, mas têm manchas de tinta nos dedos. Você escreve relatórios?",
        opcoes: [
            { texto: "Eu sou um contador dos agiotas.", tipo: "senha", correta: true, paranoia: -20, resposta: "Faz sentido. O dinheiro sujo precisa ser contado." },
            { texto: "Isso não é da sua conta.", tipo: "senha", correta: false, paranoia: 40, resposta: "Tudo é da minha conta quando minha vida está em jogo." }
        ]
    }],
    5: [{
        falaNPC: "(O Vendedor joga um distintivo de investigador manchado de sangue no balcão). Encontrei isso ontem. Quer comprar de lembrança?",
        opcoes: [
            { texto: "Que nojo. Tira isso daqui.", tipo: "normal", paranoia: 30, resposta: "Nojo? Criminosos de verdade colecionam isso." },
            { texto: "Quanto quer por ele? Faço um colar.", tipo: "normal", paranoia: -20, resposta: "Hahaha! Um homem de negócios sádico. Gosto disso." },
            { texto: "🎲 [Reação 30%] Encarar o distintivo com tristeza reprimida.", tipo: "sorte", chanceSucesso: 0.1, paranoiaSucesso: 0, respostaSucesso: "Você é frio... não esboçou nada.", paranoiaFalha: 80, respostaFalha: "Você piscou! Você conhecia o dono desse distintivo!" }
        ]
    }],

    // --- ATO II: O Submundo ---
    6: [{
        falaNPC: "Um dos nossos, o 'Rato', foi preso ontem com as cargas. O que você acha que ele vai fazer?",
        opcoes: [
            { texto: "Ele vai entregar todo mundo para diminuir a pena.", tipo: "senha", correta: false, paranoia: 50, resposta: "Você acha que a Lei faz acordos com a gente? Você não é daqui." },
            { texto: "Ele vai amanhecer enforcado na cela. O chefe não deixa pontas soltas.", tipo: "senha", correta: true, paranoia: -20, resposta: "Exato. A lei do silêncio é eterna." }
        ]
    }],
    7: [{
        falaNPC: "Eu conheço os investigadores. Eles nunca bebem o Licor de Fogo. Dizem que embota os sentidos. Beba este copo.",
        opcoes: [
            { texto: "🎲 [Força Física 70%] Virar o copo de uma vez.", tipo: "sorte", chanceSucesso: 0.7, paranoiaSucesso: -30, respostaSucesso: "(Você tosse fumaça). Bom garoto.", paranoiaFalha: 70, respostaFalha: "(Você vomita no balcão). Seu estômago é fraco demais. Policialzinho." },
            { texto: "Não bebo em serviço.", tipo: "normal", paranoia: 100, resposta: "'Em serviço'? Peguei você!" }
        ]
    }],
    8: [{
        falaNPC: "O Inspetor-Geral adora charutos importados. Se eu quisesse subornar ele, de qual porto eu deveria encomendar?",
        opcoes: [
            { texto: "Porto Real, os mais caros.", tipo: "normal", paranoia: 40, resposta: "Errado. Ele odeia os legalizados." },
            { texto: "Das Ilhas do Contrabando.", tipo: "normal", paranoia: -10, resposta: "Todo mundo sabe disso. Aceitável." }
        ]
    }],
    9: [{
        falaNPC: "Hoje o ar está tenso. Sinto cheiro de batida policial. Se você fosse um guarda disfarçado, qual seria seu sinal para a invasão?",
        opcoes: [
            { texto: "Assobiar uma música do continente.", tipo: "normal", paranoia: 30, resposta: "Clichê. Eles pararam de usar isso." },
            { texto: "Derrubar este copo da mesa.", tipo: "normal", paranoia: -20, resposta: "Um sinal sutil... (Ele afasta o copo de você)." },
            { texto: "Não sei, não sou guarda.", tipo: "normal", paranoia: 40, resposta: "Defensivo demais, parceiro." }
        ]
    }],
    10: [{
        falaNPC: "Tenho armas, relíquias e cartas que aprisionam a Entidade. O que a polícia mais quer confiscar daqui?",
        opcoes: [
            { texto: "As armas.", tipo: "senha", correta: false, paranoia: 50, resposta: "A polícia já tem armas. Você não tem visão." },
            { texto: "As relíquias roubadas.", tipo: "senha", correta: false, paranoia: 50, resposta: "Isso é troco de pinga." },
            { texto: "As cartas da Entidade.", tipo: "senha", correta: true, paranoia: -30, resposta: "Sim. A polícia teme o que não pode prender com algemas." }
        ]
    }],

    // --- ATO III: Guerra Psicológica ---
    11: [{
        falaNPC: "Meu fornecedor de Pó Sombrio usa um código de batidas na porta. Eu esqueci. São duas batidas longas e...?",
        opcoes: [
            { texto: "Uma curta.", tipo: "senha", correta: true, paranoia: -20, resposta: "Você conhece mesmo a rota. Interessante." },
            { texto: "Três curtas.", tipo: "senha", correta: false, paranoia: 60, resposta: "Três curtas é o código de Invasão da milícia! Você é a porra de um tira!" }
        ]
    }],
    12: [{
        falaNPC: "Você carrega uma arma sob o casaco, eu vejo o volume. Mostre para mim.",
        opcoes: [
            { texto: "Mostrar a arma (Pistola padrão da Milícia).", tipo: "normal", paranoia: 80, resposta: "Essa trava de segurança... é arma do Estado. Que nojo." },
            { texto: "Mostrar a arma (Faca enferrujada).", tipo: "normal", paranoia: -10, resposta: "Arma de rua. Suja, mas funciona." },
            { texto: "Eu não mostro minha arma para ninguém.", tipo: "normal", paranoia: 10, resposta: "Cauteloso. Sobrevive mais tempo." }
        ]
    }],
    13: [{
        falaNPC: "A Entidade não ataca pessoas puras, sabia? Ela devora a culpa. Do que você tem culpa?",
        opcoes: [
            { texto: "Menti para os meus superiores.", tipo: "normal", paranoia: 40, resposta: "Superiores? Bandido não tem 'superior', tem 'chefe'." },
            { texto: "Matei um homem por moedas.", tipo: "normal", paranoia: -20, resposta: "Uma culpa mundana e perversa. A Entidade vai adorar." }
        ]
    }],
    14: [{
        falaNPC: "Você faz muitas perguntas sobre as cartas. Está construindo um caso criminal contra mim?",
        opcoes: [
            { texto: "Estou construindo meu arsenal para sobreviver.", tipo: "normal", paranoia: -20, resposta: "Uma resposta egoísta e verdadeira." },
            { texto: "Claro que não, somos amigos.", tipo: "normal", paranoia: 50, resposta: "Bandidos não têm amigos no Beco. Temos interesses." }
        ]
    }],
    15: [{
        falaNPC: "A Milícia usa cães farejadores na fronteira do Distrito 4. Como você passou por eles com esse cheiro de sangue?",
        opcoes: [
            { texto: "Eu dei carne a eles.", tipo: "senha", correta: false, paranoia: 60, resposta: "Cão da milícia não come da mão de estranhos." },
            { texto: "Eu passei pelos esgotos do Distrito 3.", tipo: "senha", correta: true, paranoia: -30, resposta: "Você sabe das rotas. É um dos nossos." }
        ]
    }],

    // --- ATO IV: A Teia de Mentiras ---
    16: [{
        falaNPC: "(O Vendedor saca uma arma e aponta para você). Alguém dedurou meu carregamento. Foi você?",
        opcoes: [
            { texto: "Abaixar a arma dele lentamente.", tipo: "normal", paranoia: -20, resposta: "Sangue frio... você não é um novato assustado." },
            { texto: "Puxar o distintivo e dar voz de prisão.", tipo: "normal", paranoia: 100, resposta: "EU SABIA! MORRA!" },
            { texto: "🎲 [Blefe 50%] Falar rindo: 'Se fosse eu, a guarda já estava aqui.'", tipo: "sorte", chanceSucesso: 0.5, paranoiaSucesso: -40, respostaSucesso: "(Ele abaixa a arma). É... faz sentido.", paranoiaFalha: 80, respostaFalha: "Não ria da minha cara, desgraçado!" }
        ]
    }],
    17: [{
        falaNPC: "Para quem você trabalha? E não me venha com mentiras. Se o nome for grande, eu te dou desconto.",
        opcoes: [
            { texto: "Trabalho para o 'Corvo' do sindicato.", tipo: "normal", paranoia: -10, resposta: "O Corvo paga bem, mas é avarento." },
            { texto: "Trabalho para a Coroa.", tipo: "normal", paranoia: 100, resposta: "Um cão do governo no meu balcão? NUNCA!" },
            { texto: "Trabalho sozinho. Sou autônomo.", tipo: "normal", paranoia: 30, resposta: "Ninguém sobrevive sozinho nessa cidade." }
        ]
    }],
    18: [{
        falaNPC: "As cartas da Entidade exigem um sacrifício moral para funcionar. Você seria capaz de matar um inocente para se salvar?",
        opcoes: [
            { texto: "Sem hesitar.", tipo: "senha", correta: true, paranoia: -20, resposta: "Um canalha completo. As trevas gostam de você." },
            { texto: "Não. A vida inocente deve ser protegida.", tipo: "senha", correta: false, paranoia: 80, resposta: "Discurso de investigador. Discurso de herói." }
        ]
    }],
    19: [{
        falaNPC: "Se descobrirmos um investigador infiltrado no beco, o que fazemos com ele?",
        opcoes: [
            { texto: "Nós o prendemos no porão.", tipo: "normal", paranoia: 50, resposta: "Prender? Nós não somos carcereiros." },
            { texto: "Cortamos a língua e mandamos de volta numa caixa.", tipo: "normal", paranoia: -30, resposta: "A linguagem do medo. A resposta correta." }
        ]
    }],
    20: [{
        falaNPC: "Estamos sendo vigiados agora mesmo. Olhe para a janela de soslaio. É um atirador da guarda ou um mercenário rival?",
        opcoes: [
            { texto: "É a guarda. O cano da arma é longo e prateado.", tipo: "senha", correta: false, paranoia: 70, resposta: "Você conhece bem o equipamento deles, não é?" },
            { texto: "É um rival. A guarda não trabalha na chuva.", tipo: "senha", correta: true, paranoia: -40, resposta: "Exato. Tiras odeiam molhar as botas." }
        ]
    }],

    // --- ATO V: No Limite da Lei ---
    21: [{
        falaNPC: "Eu torturei um policial ontem. Ele implorou pela mãe. O que você acha disso?",
        opcoes: [
            { texto: "Você é um monstro doentio.", tipo: "normal", paranoia: 80, resposta: "A compaixão te entregou, ratinho." },
            { texto: "Ele merecia. Policiais são vermes.", tipo: "normal", paranoia: -10, resposta: "Palavras vazias para tentar me agradar, mas servem." },
            { texto: "🎲 [Reação 40%] Cuspir no chão com nojo do policial.", tipo: "sorte", chanceSucesso: 0.4, paranoiaSucesso: -30, respostaSucesso: "Essa é a atitude correta.", paranoiaFalha: 70, respostaFalha: "Isso pareceu muito forçado." }
        ]
    }],
    22: [{
        falaNPC: "O Juiz da 4ª vara é corrupto. Qual é a taxa dele para soltar um assassino de aluguel?",
        opcoes: [
            { texto: "5 mil de ouro.", tipo: "senha", correta: true, paranoia: -20, resposta: "Você tem a tabela de preços na cabeça." },
            { texto: "A justiça não tem preço.", tipo: "senha", correta: false, paranoia: 100, resposta: "Hahaha! Definitivamente um infiltrado." }
        ]
    }],
    23: [{
        falaNPC: "Se você comprar essas cartas, a Entidade vai ler sua mente. Ela vai ver se você é da Lei. Você tem medo?",
        opcoes: [
            { texto: "Minha mente pertence ao crime.", tipo: "normal", paranoia: -10, resposta: "Veremos no campo de batalha." },
            { texto: "Estou preparado para cumprir meu dever.", tipo: "normal", paranoia: 70, resposta: "'Dever'? Soldados e policiais falam em dever." }
        ]
    }],
    24: [{
        falaNPC: "Último teste antes do carregamento pesado. Qual é a Primeira Lei do Balcão das Sombras?",
        opcoes: [
            { texto: "O dinheiro compra tudo.", tipo: "senha", correta: false, paranoia: 50, resposta: "Errado. O dinheiro não compra o silêncio." },
            { texto: "Não confie em ninguém que faça perguntas.", tipo: "senha", correta: true, paranoia: -40, resposta: "Exatamente. É por isso que te odeio." }
        ]
    }],
    25: [{
        falaNPC: "Estou com o rádio da polícia interceptado. Eles estão codificando a nossa localização como 'Setor Áries'. O que a gente faz?",
        opcoes: [
            { texto: "Ficamos calmos. Áries é o bairro rico, estamos seguros.", tipo: "senha", correta: true, paranoia: -30, resposta: "Perfeito. Você conhece o mapa tático deles." },
            { texto: "Fugimos agora! O Beco é o Setor Áries!", tipo: "senha", correta: false, paranoia: 60, resposta: "Mentiroso. Um criminoso local saberia nosso código." }
        ]
    }],

    // --- ATO VI: A Revelação ---
    26: [{
        falaNPC: "A Entidade sente o cheiro da sua farda invisível. Por que você está transpirando?",
        opcoes: [
            { texto: "Porque o poder dela é esmagador.", tipo: "normal", paranoia: -20, resposta: "Até que enfim você diz a verdade." },
            { texto: "É o peso da minha armadura tática por baixo da roupa.", tipo: "normal", paranoia: 100, resposta: "VOCÊ CONFESSOU!" }
        ]
    }],
    27: [{
        falaNPC: "Se você levar as Cartas Mestras, a milícia vai usá-las para destruir o Beco. Prometa que isso é para você.",
        opcoes: [
            { texto: "Eu juro pela Coroa.", tipo: "normal", paranoia: 80, resposta: "Jurou pelo império? Acabou a farsa." },
            { texto: "Eu juro pela minha ganância.", tipo: "normal", paranoia: -30, resposta: "A ganância é a única coisa confiável nesse mundo." }
        ]
    }],
    28: [{
        falaNPC: "(O Vendedor joga um papel na mesa). Esta é a lista de todos os infiltrados na nossa organização. Seu nome está aí?",
        opcoes: [
            { texto: "🎲 [Nervo de Aço 20%] Não olhar para a lista.", tipo: "sorte", chanceSucesso: 0.2, paranoiaSucesso: -50, respostaSucesso: "Nem olhou. Confiança absurda.", paranoiaFalha: 90, respostaFalha: "Você desviou o olhar com medo!" },
            { texto: "Olhar para o papel apressadamente.", tipo: "normal", paranoia: 60, resposta: "O desespero nos seus olhos entregou tudo." }
        ]
    }],
    29: [{
        falaNPC: "Fim da linha. Só restou uma carta para te dar. Se você for um investigador, ela vai explodir sua mão. Pega?",
        opcoes: [
            { texto: "Pego sem hesitar.", tipo: "normal", paranoia: -40, resposta: "Você é louco... ou realmente não é um tira." },
            { texto: "Recuar e não pegar.", tipo: "normal", paranoia: 90, resposta: "O medo da morte e da justiça falou mais alto." }
        ]
    }],
    30: [{
        falaNPC: "Você chegou ao núcleo do Beco das Sombras. Você quer as Relíquias Primordiais para banir a Entidade de vez, não é? Apenas responda: Por que você merece esse poder?",
        opcoes: [
            { texto: "Para proteger os cidadãos inocentes da cidade.", tipo: "senha", correta: false, paranoia: 100, resposta: "O clássico discurso do Investigador Chefe. AS SOMBRAS VÃO TE ENGOLIR!" },
            { texto: "Para dominar a Entidade e usar o poder para mim.", tipo: "senha", correta: true, paranoia: -50, resposta: "A essência pura da corrupção. Você passou... Enfrente seu destino!" }
        ]
    }]
};

// --- AS CARTAS DA MÃO DO JOGADOR ---
const bancoDeCartas = [
    // Cartas Básicas (Níveis 1-10)
    { id: 1, nome: "Lâmina Sussurrante", tipo: "ataque", descricao: "Rasga a essência da entidade.", valor: 25, imagem: "imagens/carta-lamina.png" },
    { id: 2, nome: "Palavra de Poder", tipo: "ataque", descricao: "Um som que destrói a escuridão.", valor: 40, imagem: "imagens/carta-palavra.png" },
    { id: 3, nome: "Pó de Estrela", tipo: "ataque", descricao: "Queima a entidade com luz pura.", valor: 15, imagem: "imagens/carta-po.png" },
    { id: 4, nome: "Selo da Mente", tipo: "defesa", descricao: "Restaura os fragmentos da sua sanidade.", valor: 30, imagem: "imagens/carta-selo.png" },
    { id: 5, nome: "Elixir do Esquecimento", tipo: "defesa", descricao: "Acalma o pânico e cura a mente.", valor: 45, imagem: "imagens/carta-elixir.png" },
    { id: 6, nome: "Coroa de Ossos", tipo: "ataque", descricao: "Invoca os mortos para atacar a entidade.", valor: 35, imagem: "imagens/carta-coroa.png" },
    { id: 7, nome: "Manto da Névoa", tipo: "defesa", descricao: "Esconde sua mente dos ataques.", valor: 25, imagem: "imagens/carta-manto.png" },
    { id: 8, nome: "Arco e Flecha", tipo: "ataque", descricao: "Um ataque rápido e desgastante.", valor: 20, imagem: "imagens/carta-arco.png" },
    { id: 9, nome: "Amuleto da Serenidade", tipo: "defesa", descricao: "Acalma os batimentos.", valor: 20, imagem: "imagens/carta-amuleto.png" },
    { id: 10, nome: "Luz do Amanhecer", tipo: "ataque", descricao: "Feixe de luz concentrado.", valor: 50, imagem: "imagens/carta-luz.png" },

    // Cartas Intermediárias (Surgem do 10 ao 20)
    { id: 11, nome: "Véu da Ilusão", tipo: "defesa", descricao: "Confunde a entidade na hora do ataque.", valor: 35, imagem: "imagens/carta-veu.png", nivelMinimo: 5 },
    { id: 12, nome: "Garras do Desespero", tipo: "ataque", descricao: "Causa cortes psíquicos profundos.", valor: 45, imagem: "imagens/carta-garras.png", nivelMinimo: 5 },
    { id: 13, nome: "Cura da Alma", tipo: "defesa", descricao: "Restaura sanidade massiva.", valor: 55, imagem: "imagens/carta-cura.png", nivelMinimo: 10 },
    { id: 14, nome: "Explosão de Paranoia", tipo: "ataque", descricao: "Transforma seu medo em arma ofensiva.", valor: 55, imagem: "imagens/carta-explosao.png", nivelMinimo: 10 },
    { id: 15, nome: "Barreira de Sangue", tipo: "defesa", descricao: "Usa dor física para blindar a mente.", valor: 65, imagem: "imagens/carta-barreira.png", nivelMinimo: 15 },

    // As Relíquias Altas (Surgem do 15 ao 30)
    { id: 16, nome: "Foice do Vazio", tipo: "ataque", descricao: "Dano massivo. Apenas para os dignos.", valor: 100, imagem: "imagens/carta-foice.png", nivelMinimo: 17 },
    { id: 17, nome: "Aura Divina", tipo: "defesa", descricao: "Uma cura divina de alto nível.", valor: 80, imagem: "imagens/carta-aura.png", nivelMinimo: 17 },
    { id: 18, nome: "Chama Eterna", tipo: "ataque", descricao: "Um fogo que queima a corrupção.", valor: 120, imagem: "imagens/carta-chama.png", nivelMinimo: 20 },
    { id: 19, nome: "Escudo de Cristal", tipo: "defesa", descricao: "Reflete a força da Entidade.", valor: 100, imagem: "imagens/carta-escudo.png", nivelMinimo: 20 },
    { id: 20, nome: "Espada do Caos", tipo: "ataque", descricao: "Parte a mente do inimigo ao meio.", valor: 150, imagem: "imagens/carta-espada.png", nivelMinimo: 22 },

    // NOVIDADES: Relíquias Supremas (Apenas no Ato Final, 25-30)
    { id: 21, nome: "Tomo do Investigador", tipo: "defesa", descricao: "A lógica fria destrói a loucura.", valor: 150, imagem: "imagens/carta-tomo.png", nivelMinimo: 25 },
    { id: 22, nome: "Soro da Verdade Bruto", tipo: "ataque", descricao: "Faz a Entidade colapsar em si mesma.", valor: 200, imagem: "imagens/carta-soro.png", nivelMinimo: 25 },
    { id: 23, nome: "Canhão de Fótons", tipo: "ataque", descricao: "Luz purificadora máxima.", valor: 300, imagem: "imagens/carta-canhao.png", nivelMinimo: 28 },
    { id: 24, nome: "Blindagem Tática", tipo: "defesa", descricao: "Sanidade impenetrável.", valor: 200, imagem: "imagens/carta-blindagem.png", nivelMinimo: 28 },
    { id: 25, nome: "O Veredito da Lei", tipo: "ataque", descricao: "O golpe final da Justiça.", valor: 500, imagem: "imagens/carta-veredito.png", nivelMinimo: 30 }
];
