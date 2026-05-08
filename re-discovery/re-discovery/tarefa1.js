let bgImg;
let notes = [];
let sequence = [];
let playerSequence = [];
let isShowing = false;
let tarefa1State = "INSTRUCTIONS";
let step = 0;
let lastStepTime = 0;

let interactiveButtons = [];
let visualSquares = [];
let gameStatus = "";

// ── VARIÁVEIS DO POP-UP ──
let popX, popY, popW, popH;

function preloadTarefa1() {
    bgImg = loadImage('imagens/tarefa1.png');
    for (let i = 1; i <= 9; i++) {
        notes.push(loadSound(`note${i}.mp3`));
    }
}

// Em vez de setup() com createCanvas, usamos setupTarefa1()
function setupTarefa1() {
    initializeGrids();
}

function initializeGrids() {
    interactiveButtons = [];
    visualSquares = [];

    // 1. Calcular o tamanho do Pop-up (80% do ecrã, mantendo proporção)
    popW = width * 0.65;
    popH = popW * (600 / 1100);

    if (popH > height * 0.65) {
        popH = height * 0.65;
        popW = popH * (1100 / 600);
    }

    // 2. Calcular o centro para o Pop-up
    popX = width / 2 - popW / 2;
    popY = height / 2 - popH / 2;

    // 3. Coordenadas relativas ao tamanho e posição do Pop-up
    let rightX = popX + popW * 0.575;
    let rightY = popY + popH * 0.175;
    let gapX = popW * 0.126;
    let gapY = popH * 0.234;
    let sqSize = popW * 0.105;

    let leftX = popX + popW * 0.075;
    let leftY = popY + popH * 0.170;

    for (let i = 0; i < 9; i++) {
        let col = i % 3;
        let row = Math.floor(i / 3);

        interactiveButtons[i] = {
            x: rightX + col * gapX,
            y: rightY + row * gapY,
            size: sqSize,
            active: false
        };

        visualSquares[i] = {
            x: leftX + col * gapX,
            y: leftY + row * gapY,
            size: sqSize,
            active: false
        };
    }
}

function drawTarefa1() {
    // ── EFEITO POP-UP (Fundo e Moldura) ──
    // 1. Desenha a nave no fundo
    push();
    imageMode(CENTER);
    image(bgNave, width/2, height/2, naveNewW, naveNewH);
    pop();

    // 2. Película escura
    noStroke();
    fill(0, 0, 0, 180);
    rect(0, 0, width, height);

    // 3. Desenha a imagem da tarefa centrada (O Pop-up)
    push();
    imageMode(CORNER);
    image(bgImg, popX, popY, popW, popH); // Imagem da tarefa
    pop();

    // ── LÓGICA DE ESTADOS (MUDANÇA AQUI) ──
    if (tarefa1State === "INSTRUCTIONS") {
        push();
        translate(popX, popY);
        // CORREÇÃO: Usar as variáveis globais do pop-up para tapar os buracos!
        scale(popW / WIDE_WIDTH, popH / WIDE_HEIGHT); 
        drawTaskInstructions(
            "Aerodynamic", 
            "MEMORIZE THE PATTERN. Watch the sequence of lights and sounds carefully, then repeat it perfectly."
        );
        pop();
    }
    else {
        // --- TUDO O QUE ESTÁ AQUI DENTRO SÓ ACONTECE DEPOIS DO START ---

        // Lógica da sequência
        if (isShowing) {
            if (millis() - lastStepTime > 600) {
                // Desativa todos os brilhos antes de mostrar o próximo
                for (let i = 0; i < 9; i++) visualSquares[i].active = false;

                if (step < sequence.length) {
                    let currentIdx = sequence[step];
                    visualSquares[currentIdx].active = true;
                    notes[currentIdx].play();
                    step++;
                    lastStepTime = millis();
                } else {
                    isShowing = false;
                    for (let i = 0; i < 9; i++) visualSquares[i].active = false;
                }
            }
        }

        // Desenha os elementos ativos do jogo
        drawVisualFeedbacks();
        drawResultMessage();
    }
}

function drawVisualFeedbacks() {
    for (let i = 0; i < 9; i++) {
        if (visualSquares[i].active) {
            noStroke();
            fill(255, 255, 255, 180);
            rect(visualSquares[i].x, visualSquares[i].y, visualSquares[i].size, visualSquares[i].size);
        }
    }

    for (let i = 0; i < 9; i++) {
        if (interactiveButtons[i].active) {
            noStroke();
            fill(0, 255, 255, 120);
            rect(interactiveButtons[i].x, interactiveButtons[i].y, interactiveButtons[i].size, interactiveButtons[i].size);
        }
    }
}

function drawResultMessage() {
    if (gameStatus !== "") {
        push();
        textAlign(CENTER, CENTER);
        textFont('Impact');
        textSize(popW * 0.08); // Tamanho de texto relativo ao pop-up

        if (gameStatus === "FAIL") {
            fill(255, 0, 0);
            text("FAILED - TRY AGAIN", width / 2, height / 2);
        } else if (gameStatus === "PASS") {
            fill(0, 255, 0);
            text("IDENTITY RECOVERED", width / 2, height / 2);
        }
        pop();
    }
}

function drawStartScreen() {
    fill(0, 0, 0, 200);
    rect(popX, popY, popW, popH);
    fill(255);
    textAlign(CENTER, CENTER);
    textFont('Impact');
    textSize(popW * 0.03); // Tamanho de texto relativo ao pop-up
    text("AERODYNAMIC: MEMORIZE THE PATTERN\nCLICK TO START", width / 2, height / 2);
}

function mousePressedTarefa1() {
    // 1. Verificamos se estamos no ecrã de instruções
    if (tarefa1State === "INSTRUCTIONS") {
        if (checkStartClick()) {
            tarefa1State = "PLAY"; 
            startNewRound(); // Arranca a primeira sequência de luzes/sons!
        }
        return; // O 'return' impede que o código continue e clique nos botões sem querer
    }

    // 2. A tua lógica antiga dos quadrados (só funciona depois do START)
    if (isShowing || gameStatus === "PASS") return;

    for (let i = 0; i < 9; i++) {
        let b = interactiveButtons[i];
        if (mouseX > b.x && mouseX < b.x + b.size && mouseY > b.y && mouseY < b.y + b.size) {
            handlePlayerInput(i);
        }
    }
}
function handlePlayerInput(idx) {
    interactiveButtons[idx].active = true;
    notes[idx].play();
    playerSequence.push(idx);

    let currentMove = playerSequence.length - 1;
    if (playerSequence[currentMove] !== sequence[currentMove]) {
        gameStatus = "FAIL";
        setTimeout(() => {
            gameStatus = "";
            startNewRound();
        }, 1500);
    } else if (playerSequence.length === sequence.length) {
        gameStatus = "PASS";
        TarefaConcluida.aerodynamic = true;
        setTimeout(() => {
            tarefa1State = "INSTRUCTIONS";
            concluirComMemoria("aerodynamic");
        }, 1500);
    }
    setTimeout(() => { interactiveButtons[idx].active = false; }, 200);
}

function startNewRound() {
    sequence = [0, 1, 2, 3, 4];
    shuffle(sequence, true);
    playerSequence = [];
    isShowing = true;
    step = 0;
    lastStepTime = millis();
    gameStatus = "";
}

// Atualizado para o menu.js chamar quando redimensionar a janela
function windowResizedTarefa1() {
    initializeGrids();
}