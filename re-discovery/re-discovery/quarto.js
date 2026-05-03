// quarto.js
let bgQuartoImg; 
let bgQuarto2Img; // --- NOVO: Variável para o quarto final ---

const OCULOS = {
    relX: 0.8,
    relY: 0.18,
    relW: 0.10,
    relH: 0.07,
};

function preloadQuarto() {
    bgQuartoImg = loadImage('imagens/quarto_1_.png');
    bgQuarto2Img = loadImage('imagens/quarto_2.png'); // Carrega a imagem final
}

function drawQuartoScreen() {
    image(bgQuartoImg, 0, 0, quartoNewW,quartoNewH);

    let ox = width  * OCULOS.relX;
    let oy = height * OCULOS.relY;
    let ow = width  * OCULOS.relW;
    let oh = height * OCULOS.relH;

    let oculosHover = (
        mouseX > ox - ow / 2 && mouseX < ox + ow / 2 &&
        mouseY > oy - oh / 2 && mouseY < oy + oh / 2
    );

    if (oculosHover) cursor(HAND);

    push();
    rectMode(CENTER);

    if (oculosHover) {
        stroke(0, 255, 0);
        fill(0, 255, 0, 89);
    } else {
        stroke(0, 255, 0);
        noFill();
    }

    strokeWeight(2);
    rect(ox, oy, ow, oh, 6);
    pop();
}

function handleQuartoClick() {
    let ox = width  * OCULOS.relX;
    let oy = height * OCULOS.relY;
    let ow = width  * OCULOS.relW;
    let oh = height * OCULOS.relH;

    if (mouseX > ox - ow / 2 && mouseX < ox + ow / 2 &&
        mouseY > oy - oh / 2 && mouseY < oy + oh / 2) {
        goTo("LIVRO","NOISE");
    }
}

// ─── NOVO: ECRÃ DE VITÓRIA (QUARTO 2) ─────────────────────────
function drawVitoriaScreen() {
    // Desenha o quarto 2 limpo, sem retângulos verdes!
    image(bgQuarto2Img, 0, 0,quartoNewW, quartoNewH);
}

function handleVitoriaClick() {
    // Faz um refresh à página inteira para recomeçar o jogo do zero
    location.reload(); 
}