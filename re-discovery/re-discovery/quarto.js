// quarto.js
let bgQuartoImg;
let bgQuarto2Img;
let oculosImg, oculosHoverImg; // Nomes mais claros para as imagens

// Variáveis globais para guardar a posição e tamanho dos óculos
let ox = 0;
let oy = 0;
let ow = 0;
let oh = 0;

function preloadQuarto() {
    bgQuartoImg = loadImage('imagens/quarto_1_.png');
    bgQuarto2Img = loadImage('imagens/quarto_2.png'); // Carrega a imagem final
    oculosImg = loadImage('imagens/oculos.png');
    oculosHoverImg = loadImage('imagens/oculosHover.png');
}

function drawQuartoScreen() {
    // 1. Desenha o fundo do quarto (os tamanhos já vêm do menu.js)
    imageMode(CORNER);
    image(bgQuartoImg, 0, 0, quartoNewW, quartoNewH);

    // --- 2. CÁLCULO RESPONSIVO PARA OS ÓCULOS ---
    // Ajusta estas duas percentagens para mover os óculos pelo cenário!
    // 0.5 = 50% (Meio do ecrã). 0.2 = 20% (Mais à esquerda/cima).
    let posX_Relativa = 0.78;
    let posY_Relativa = 0.17;

    // Calculamos a posição exata X e Y
    ox = quartoNewW * posX_Relativa;
    oy = quartoNewH * posY_Relativa;

    // Tamanho responsivo: os óculos vão ocupar 15% da largura do cenário
    ow = quartoNewW * 0.15;
    let proporcao = oculosImg.height / oculosImg.width;
    oh = ow * proporcao; // A altura ajusta-se para não distorcer

    // --- 3. LÓGICA DE HOVER (RATO POR CIMA) ---
    // Cria a caixa de colisão à volta dos óculos
    let isHover = mouseX > ox - ow / 2 && mouseX < ox + ow / 2 &&
        mouseY > oy - oh / 2 && mouseY < oy + oh / 2;

    push();
    imageMode(CENTER);
    let corNeon = color(62, 255, 81);

    // Se o rato estiver por cima, mostra a versão Néon e a mãozinha!
    if (isHover) {
        cursor(HAND);

        drawingContext.shadowBlur = 15; // Quanto maior, mais espalhado é o brilho
        drawingContext.shadowColor = corNeon;

        image(oculosHoverImg, ox, oy, ow, oh);
    } else {
       drawingContext.shadowBlur = 15; // Quanto maior, mais espalhado é o brilho
        drawingContext.shadowColor = corNeon;

        image(oculosImg, ox, oy, ow, oh);
    }
    pop();
}

function handleQuartoClick() {
    // Verifica se o clique foi dentro da hitbox que calculámos no draw
    if (mouseX > ox - ow / 2 && mouseX < ox + ow / 2 &&
        mouseY > oy - oh / 2 && mouseY < oy + oh / 2) {

        // Vai para a página do Livro com o novo efeito de Estática (Noise)!
        goTo("LIVRO", "NOISE");
    }
}

// ─── ECRÃ DE VITÓRIA (QUARTO 2) ─────────────────────────
function drawVitoriaScreen() {
    // Desenha o quarto 2 limpo
    imageMode(CORNER);
    image(bgQuarto2Img, 0, 0, quartoNewW, quartoNewH);
}

function handleVitoriaClick() {
    // Faz um refresh à página inteira para recomeçar o jogo do zero
    location.reload();
}