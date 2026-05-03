//imagens
let disco = {};
let imgBaryl, imgArpegius, imgOctave, imgStella;
let bgNave;

let personagensStatus = {
    baryl: true, // Inicialmente desbloqueado
    arpegius: false,
    octave: false,
    stella: false
};

//posição ecra.
const POS_CARDS = {
    y: 0.45, // Todos alinhados a meio (verticalmente)
    larguraPercentagem: 0.16, // --- NOVO: A carta ocupa 16% da largura do ecrã ---
    espacamento: 0.2 // Distância entre eles (horizontalmente)
};

function preloadMenuPerson() {
    imgBaryl = loadImage('imagens/baryl.png');
    imgArpegius = loadImage('imagens/arpegius.png');
    imgOctave = loadImage('imagens/octave.png');
    imgStella = loadImage('imagens/stella.png');
    bgNave = loadImage('imagens/nave.png');

    for (let i = 1; i <= 4; i++) {
        disco[i] = loadImage('imagens/discomp' + i + '.png');
    }
}

function drawMenuPersonagens() {
    background(0);
    // Usa o fundo do menu (garante que menuNewW e menuNewH estão disponíveis)
    image(bgMenu, 0, 0, menuNewW, menuNewH);

    //Camada Opacidade
    noStroke();
    fill(0, 0, 0, 180);
    rect(0, 0, width, height);

    push();
    imageMode(CENTER);
    let cx = width / 2;
    let gap = width * POS_CARDS.espacamento;

    let xBaryl = cx - (gap * 1.5);
    let xArpegius = cx - (gap * 0.5);
    let xOctave = cx + (gap * 0.5);
    let xStella = cx + (gap * 1.5);

    let y = height * POS_CARDS.y;
    
    // --- NOVO: CÁLCULO RESPONSIVO PARA AS CARTAS ---
    // 1. A largura é uma percentagem do ecrã
    let w = width * POS_CARDS.larguraPercentagem;
    // 2. Descobrimos a proporção original para não distorcer a imagem
    let proporcao = imgArpegius.height / imgArpegius.width;
    // 3. A altura adapta-se à largura magicamente!
    let h = w * proporcao;

    // Desenhar as 4 cartas
    drawCard(imgBaryl, xBaryl, y, w, h, personagensStatus.baryl);
    drawCard(imgArpegius, xArpegius, y, w, h, personagensStatus.arpegius);
    drawCard(imgOctave, xOctave, y, w, h, personagensStatus.octave);
    drawCard(imgStella, xStella, y, w, h, personagensStatus.stella);
    pop();

    drawDiscoProgress();
}

function drawDiscoProgress() {
    let nivelDisco = 0;

    // A lógica é lida de cima para baixo. Fica com o maior nível alcançado.
    if (TarefaConcluida.veridis && TarefaConcluida.one) {
        nivelDisco = 4; // Stella terminou -> Disco 100% completo!
    } else if (personagensStatus.stella) {
        nivelDisco = 3; // Stella Desbloqueada (Octave terminou) -> 3 Pedaços
    } else if (personagensStatus.octave) {
        nivelDisco = 2; // Octave Desbloqueado (Arpegius terminou) -> 2 Pedaços
    } else if (personagensStatus.arpegius) {
        nivelDisco = 1; // Arpegius Desbloqueado (Baryl terminou) -> 1 Pedaço
    }

    // Desenha o disco apenas se o jogador já tiver ganho pelo menos 1 pedaço
    if (nivelDisco > 0) {
        push();
        imageMode(CENTER);

        // Colocamos o disco na parte inferior ao centro
        let discoX = width / 2;
        let discoY = height * 0.75; 
        let discoSizeW = width * 0.15; 

        // 2. Descobrimos a proporção original da imagem (Altura a dividir pela Largura)
        let proporcao = disco[nivelDisco].height / disco[nivelDisco].width;

        // 3. Calculamos a altura final multiplicando a nova largura pela proporção
        let discoSizeH = discoSizeW * proporcao;

        // Efeito extra: Um brilho dourado para destacar a recompensa!
        drawingContext.shadowBlur = 25;
        drawingContext.shadowColor = color(255, 215, 0); // Cor Dourada

        image(disco[nivelDisco], discoX, discoY, discoSizeW, discoSizeH);
        pop();
    }
}

// Função auxiliar para desenhar a carta (normal ou escurecida se bloqueada)
function drawCard(img, x, y, w, h, isUnlocked) {
    if (img) {
        if (isUnlocked) {
            // Desenha normal e verifica se o rato está por cima para feedback
            let isHover = mouseX > x - w / 2 && mouseX < x + w / 2 && mouseY > y - h / 2 && mouseY < y + h / 2;

            if (isHover) {
               cursor(HAND); // Muda o cursor para a mãozinha
                
                push();
                rectMode(CENTER);
                
                // --- O SEGREDO DO NÉON VERDE ---
                // Escolhemos um Verde Néon forte usando os valores Vermelho, Verde e Azul (RGB)
                let corNeon = color(62, 255, 81); 
                
                // Criamos o brilho esfumaçado (a luz do néon)
                drawingContext.shadowBlur = 26; // Quanto maior, mais espalhado é o brilho
                drawingContext.shadowColor = corNeon;
                
                // Criamos o "tubo" central do néon
                stroke(corNeon);
                strokeWeight(7); // A espessura da linha
                noFill(); // O retângulo não tem cor por dentro, só nas bordas
                
                // Desenhamos a moldura brilhante exatamente por cima da carta
                rect(x, y, w, h,1);
                pop();
            }
            image(img, x, y, w, h);
        } else {
            // Se estiver bloqueado, desenha a imagem mais escura
            push();
            tint(100); // Aplica um filtro escuro (valores menores que 255 escurecem)
            image(img, x, y, w, h);
            pop();
        }
    }
}

// Lógica de clique (Chamar isto no mousePressed do menu.js)
function handlePersonagensClick() {
    let cx = width / 2;
    let gap = width * POS_CARDS.espacamento;

    let xBaryl = cx - (gap * 1.5);
    let xArpegius = cx - (gap * 0.5);
    let xOctave = cx + (gap * 0.5);
    let xStella = cx + (gap * 1.5);

    let y = height * POS_CARDS.y;
    
    // --- NOVO: A mesma matemática aplicada aqui para o clique nunca falhar! ---
    let w = width * POS_CARDS.larguraPercentagem;
    let proporcao = imgArpegius.height / imgArpegius.width;
    let h = w * proporcao;

    function clickCard(x, y, w, h) {
        return mouseX > x - w / 2 && mouseX < x + w / 2 && mouseY > y - h / 2 && mouseY < y + h / 2;
    }

    // Clique no Baryl
    if (clickCard(xBaryl, y, w, h) && personagensStatus.baryl) {
        personagemAtual = "BARYL";
        configurarBotoesNave(); 
        goTo("NAVE");
    }
    // Clique no Arpegius
    else if (clickCard(xArpegius, y, w, h) && personagensStatus.arpegius) {
        personagemAtual = "ARPEGIUS";
        configurarBotoesNave();
        goTo("NAVE");
    }
    // Clique no Octave
    else if (clickCard(xOctave, y, w, h) && personagensStatus.octave) {
        personagemAtual = "OCTAVE";
        configurarBotoesNave();
        goTo("NAVE");
    }
    // Clique na Stella
    else if (clickCard(xStella, y, w, h) && personagensStatus.stella) {
        personagemAtual = "STELLA";
        configurarBotoesNave();
        goTo("NAVE");
    }
}