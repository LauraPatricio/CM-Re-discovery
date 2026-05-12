//imagens
let disco = {};
let imgBaryl, imgArpegius, imgOctave, imgStella;
let bgNave;

let personagensStatus = {
    baryl: true, 
    arpegius: false,
    octave: false,
    stella: false
};

//posição ecra.
const POS_CARDS = {
    y: 0.45, 
    larguraPercentagem: 0.16, 
    espacamento: 0.2 
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
    
    
    let w = width * POS_CARDS.larguraPercentagem;
    let proporcao = imgArpegius.height / imgArpegius.width;
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

    if (TarefaConcluida.veridis && TarefaConcluida.one) {
        nivelDisco = 4; // Stella terminou -> Disco completo
    } else if (personagensStatus.stella) {
        nivelDisco = 3; // Octave terminou -> 3 Pedaços
    } else if (personagensStatus.octave) {
        nivelDisco = 2; // Arpegius terminou -> 2 Pedaços
    } else if (personagensStatus.arpegius) {
        nivelDisco = 1; // Baryl terminou -> 1 Pedaço
    }

    // Desenha o disco apenas se o jogador já tiver ganho pelo menos 1 pedaço
    if (nivelDisco > 0) {
        push();
        imageMode(CENTER);

        let discoX = width / 2;
        let discoY = height * 0.75; 
        let discoSizeW = width * 0.15; 

        let proporcao = disco[nivelDisco].height / disco[nivelDisco].width;

        let discoSizeH = discoSizeW * proporcao;

        drawingContext.shadowBlur = 25;
        drawingContext.shadowColor = color(255, 215, 0); // Cor Dourada

        image(disco[nivelDisco], discoX, discoY, discoSizeW, discoSizeH);
        pop();
    }
}

function drawCard(img, x, y, w, h, isUnlocked) {
    if (img) {
        if (isUnlocked) {
            let isHover = mouseX > x - w / 2 && mouseX < x + w / 2 && mouseY > y - h / 2 && mouseY < y + h / 2;

            if (isHover) {
               cursor(HAND); // Muda o cursor para a mãozinha
                
                push();
                rectMode(CENTER);
                
                let corNeon = color(62, 255, 81); 
                
                drawingContext.shadowBlur = 26; 
                drawingContext.shadowColor = corNeon;
                
                stroke(corNeon);
                strokeWeight(7); 
                noFill(); 
                
                rect(x, y, w, h,10);
                pop();
            }
            image(img, x, y, w, h);
        } else {
            // Se estiver bloqueado, desenha a imagem mais escura
            push();
            tint(100); // Aplica um filtro escuro 
            image(img, x, y, w, h);
            pop();
        }
    }
}

function handlePersonagensClick() {
    let cx = width / 2;
    let gap = width * POS_CARDS.espacamento;

    let xBaryl = cx - (gap * 1.5);
    let xArpegius = cx - (gap * 0.5);
    let xOctave = cx + (gap * 0.5);
    let xStella = cx + (gap * 1.5);

    let y = height * POS_CARDS.y;
    
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