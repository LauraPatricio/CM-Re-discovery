// ─────────────────────────────────────────────
//  ESTADOS DO JOGO
//  "MENU"  →  "QUARTO"  →  "PROXIMA_CENA"
// ─────────────────────────────────────────────

let bgMenu;
let gameState = "MENU";
let startBtn, aboutBtn;


// Variáveis da transição (fade a preto)
let fadeAlpha = 0;
let isFading  = false;
let nextState = "";

// ── Preload ───────────────────────────────────
function preload() {
    bgMenu = loadImage('imagens/fundo.png');
    preloadQuarto(); // ← adiciona isto
    preloadLivro();
    preloadMenuPerson();
    preloadTarefa1();
    preloadTarefa2();
    preloadTarefa3();
}
// ── Setup ─────────────────────────────────────
function setup() {
    createCanvas(windowWidth, windowHeight);
    initButtons();
    setupTarefa1();
    setupTarefa2();
    setupTarefa3();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    initButtons();
    windowResizedTarefa1();
    windowResizedTarefa2();
}

// ── Botões responsivos ─────────────────────────
function initButtons() {
    startBtn = {
        x: width * 0.5, y: height * 0.6,
        baseW: width * 0.15, h: height * 0.08,
        w: width * 0.15, text: "START"
    };
    aboutBtn = {
        x: width * 0.5, y: height * 0.72,
        baseW: width * 0.12, h: height * 0.07,
        w: width * 0.12, text: "ABOUT"
    };
}

// ── Loop principal ────────────────────────────
function draw() {
    // Reset do cursor a cada frame
    if (!isFading) cursor(ARROW);

    if (gameState === "MENU") {
        drawMenu();
    } else if (gameState === "QUARTO") {
        drawQuartoScreen(); // definido em quarto.js
    } else if (gameState === "LIVRO") {
        // Placeholder – substitui pela função da cena seguinte
        drawLivroScreen();
    }else if (gameState === "MENU_PERSONAGENS") {
        drawMenuPersonagens();
    }else if (gameState === "NAVE") {
        drawNave();
        verificarProgressoNave(); // Verifica constantemente se já acabou as 2 tarefas
    }
    else if (gameState === "TAREFA1") {
        drawTarefa1();
    }
    else if (gameState === "TAREFA2") {
        drawTarefa2();
    }
    else if (gameState === "TAREFA3") {
        drawTarefa3();
    }
    handleTransition();
}

// ── Menu ──────────────────────────────────────
function drawMenu() {
    image(bgMenu, 0, 0, width, height);

    textAlign(CENTER, CENTER);
    textFont('Impact');
    fill(255);
    textSize(width * 0.06);
    text("RE-DISCOVERY", width * 0.5, height * 0.4);

    updateButton(startBtn);
    updateButton(aboutBtn);

    drawButton(startBtn);
    drawButton(aboutBtn);
}

function updateButton(btn) {
    let hover =
        mouseX > btn.x - btn.w / 2 && mouseX < btn.x + btn.w / 2 &&
        mouseY > btn.y - btn.h / 2 && mouseY < btn.y + btn.h / 2;

    btn.w = lerp(btn.w, hover ? btn.baseW * 1.3 : btn.baseW, 0.1);
    if (hover) cursor(HAND);
}

function drawButton(btn) {
    push();
    rectMode(CENTER);
    noFill();
    stroke(255);
    strokeWeight(width * 0.003);
    rect(btn.x, btn.y, btn.w, btn.h, 10);

    noStroke();
    fill(255);
    textSize(btn.h * 0.5);
    text(btn.text, btn.x, btn.y);
    pop();
}

// ── Transição (fade a preto) ──────────────────
// menu.js - Novas variáveis de controle
let transitionType = "FADE"; // Pode ser "FADE" ou "NOISE"
let noiseDuration = 45;      // Aproximadamente 0.7 segundos
let noiseCounter = 0;
// menu.js


// Função para transição instantânea (sem fade)
function goTo(novoEstado) {
    gameState = novoEstado; // Muda a cena instantaneamente
}
function handleTransition() {
    if (isFading) {
        fadeAlpha += 5; //fade out
        if (fadeAlpha >= 255) {
            gameState = nextState;
            isFading = false;
        }
    } else if (fadeAlpha > 0) {
        fadeAlpha -= 5; //fade in
    }

    // retangulo preto
    fill(0, fadeAlpha);
    rect(0, 0, width, height);
}

// ── Input ─────────────────────────────────────
function mousePressed() {
    if (isFading) return; // ignora cliques durante fade

    if (gameState === "MENU") {
        if (
            mouseX > startBtn.x - startBtn.w / 2 && mouseX < startBtn.x + startBtn.w / 2 &&
            mouseY > startBtn.y - startBtn.h / 2 && mouseY < startBtn.y + startBtn.h / 2
        ) {
            nextState = "QUARTO";
            isFading  = true;
        }
    }
    else if (gameState === "QUARTO") {
        handleQuartoClick(); // definido em quarto.js
    }else if (gameState === "LIVRO") {
        handleLivroClick();
    }else if (gameState === "MENU_PERSONAGENS") {
        handlePersonagensClick();
    }else if (gameState === "NAVE") handleNaveClick(); // Chamamos a nova função da nave
    else if (gameState === "TAREFA1") mousePressedTarefa1();
    else if (gameState === "TAREFA2") mousePressedTarefa2();
    else if (gameState === "TAREFA3") mousePressedTarefa3();
}

function keyPressed() {
    if (gameState === "TAREFA3") {
        keyPressedTarefa3();
    }
}