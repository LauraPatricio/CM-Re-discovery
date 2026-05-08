let bgMenu, exitImg, logo;
let gameState = "MENU";
let startBtn, aboutBtn;

// Apenas declaramos as variáveis aqui (as contas serão feitas mais tarde)
let scaleRatioMenu, scaleRatioQuarto, scaleRatioNave;
let naveNewW, naveNewH, menuNewW, menuNewH, quartoNewW, quartoNewH;

// Variáveis da transição (fade a preto e noise)
let fadeAlpha = 0;
let isFading = false;
let nextState = "";
let transitionType = "NONE"; // Começa sem transição
let noiseDuration = 30;      // Duração da estática (30 frames = aprox. meio segundo)
let noiseCounter = 0;

let somAmbienteNave;

// Proporção popup
let widePopX, widePopY, widePopW, widePopH;
const WIDE_WIDTH = 800;
const WIDE_HEIGHT = 450;


// ── Preload ───────────────────────────────────
function preload() {
    bgMenu = loadImage('imagens/fundo.png');
    exitImg = loadImage('imagens/Exit.png');
    logo = loadImage('imagens/logo.png');
    somAmbienteNave = loadSound('sons/spaceship.mp3');

    preloadQuarto();
    preloadLivro();
    preloadMenuPerson();
    preloadNave();
    preloadTarefa1();
    preloadTarefa2();
    preloadTarefa3();
    preloadTarefa4();
    preloadTarefa5();
    preloadTarefa6();
    preloadTarefa7();
    preloadTarefa8();
    preloadMemoria(); // ADICIONA ISTO AQUI!
    
}

// ── Setup ─────────────────────────────────────
function setup() {
    createCanvas(windowWidth, windowHeight);
    
    // --- NOVO: Calculamos os fundos logo que o jogo arranca ---
    calcularTamanhosFundo(); 
    
    calcularPopUpWide();
    initButtons();
    setupTarefa1();
    setupTarefa2();
    setupTarefa3();
    setupTarefa4();
    setupTarefa5();
    setupTarefa6();
    setupTarefa7();
    setupTarefa8();
}

// --- NOVA FUNÇÃO: Faz os cálculos matemáticos apenas quando o p5.js está pronto ---
function calcularTamanhosFundo() {
    scaleRatioMenu = max(width / bgMenu.width, height / bgMenu.height);
    scaleRatioQuarto = max(width / bgQuartoImg.width, height / bgQuartoImg.height);
    scaleRatioNave = max(width / bgNave.width, height / bgNave.height);

    naveNewW = bgNave.width * scaleRatioNave;
    naveNewH = bgNave.height * scaleRatioNave;
    menuNewW = bgMenu.width * scaleRatioMenu;
    menuNewH = bgMenu.height * scaleRatioMenu;
    quartoNewW = bgQuartoImg.width * scaleRatioQuarto;
    quartoNewH = bgQuartoImg.height * scaleRatioQuarto;
}

// ─── BOTÃO EXIT UNIVERSAL ─────────────────────────────
function drawUniversalExit() {
    let px, py, pw;

    // Ajusta o botão com base na tarefa em que estamos
    if (gameState === "TAREFA1") { px = popX; py = popY; pw = popW; }
    else if (gameState === "TAREFA2") { px = t2_popX; py = t2_popY; pw = t2_popW; }
    else { px = widePopX; py = widePopY; pw = widePopW; }

    // --- CORREÇÃO: Variáveis uniformizadas ---
    let size = width * 0.025; 
    let ex = px + pw + 25; // Posição X com o ajuste de + 8        
    let ey = py;          

    push();
    imageMode(CENTER);

    // Efeito de passar o rato por cima (Hover) usa exatamente as mesmas variáveis
    if (dist(mouseX, mouseY, ex, ey) < size / 2) {
        cursor(HAND);
        tint(255, 150, 150); // Fica ligeiramente vermelho
    }

    image(exitImg, ex, ey, size, size);
    pop();
}

function checkUniversalExit() {
    let px, py, pw;
    if (gameState === "TAREFA1") { px = popX; py = popY; pw = popW; }
    else if (gameState === "TAREFA2") { px = t2_popX; py = t2_popY; pw = t2_popW; }
    else { px = widePopX; py = widePopY; pw = widePopW; }

    // --- CORREÇÃO: Variáveis copiadas do drawUniversalExit para baterem certo ---
    let size = width * 0.025; 
    let ex = px + pw + 25; // Adicionado o + 8 que faltava!
    let ey = py;

    // Se o clique foi em cima da bola de Exit
    if (dist(mouseX, mouseY, ex, ey) < size / 2) {
        resetCurrentTask(); 
        goTo("NAVE");       
        return true;        
    }
    return false;
}

function resetCurrentTask() {
    // Parar todos os sons antes de qualquer reset
    pararTodosSonsTarefas();

    if (gameState === "TAREFA1") {
        tarefa1State = "INSTRUCTIONS";
        gameStatus = "";
        gameStarted = false;
    } else if (gameState === "TAREFA2") {
        tarefa2State = "INSTRUCTIONS";
        loseTimer = 0;
        playerSequence2 = []; 
        sequenceIndex = 0;
        displayWord = "";
    } else if (gameState === "TAREFA3") { 
        // Reset completo da tarefa 3
        resetGame3(true); 
    } else if (gameState === "TAREFA4") {
        tarefa4State = "INSTRUCTIONS";
        resetGame4(); 
    } else if (gameState === "TAREFA5") {
        tarefa5State = "INSTRUCTIONS";
        resetGame5(); 
    } else if (gameState === "TAREFA6") {
        tarefa6State = "INSTRUCTIONS";
        resetGame6(); 
    } else if (gameState === "TAREFA7") {
        tarefa7State = "INSTRUCTIONS";
        resetAttempt();
        discoveryVisible = false;
    } else if (gameState === "TAREFA8") { 
        tarefa8State = "INSTRUCTIONS";
        resetTarefa8(); 
    }
}

function calcularPopUpWide() {
    widePopW = width * 0.65;
    widePopH = widePopW * (WIDE_HEIGHT / WIDE_WIDTH);

    if (widePopH > height * 0.65) {
        widePopH = height * 0.65;
        widePopW = widePopH * (WIDE_WIDTH / WIDE_HEIGHT);
    }

    widePopX = (width - widePopW) / 2;
    widePopY = (height - widePopH) / 2;
}

//__ Reajustar tamanho ____________________________
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    
    // --- NOVO: Recalcula os fundos se o utilizador aumentar ou encolher a janela! ---
    calcularTamanhosFundo(); 
    
    calcularPopUpWide(); 
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
    if (transitionType !== "NOISE" && !isFading) cursor(ARROW);

    if (gameState === "MENU") {
        drawMenu();
    } else if (gameState === "ABOUT") { // <--- ADICIONA ESTA LINHA AQUI
        drawAboutScreen();
    } else if (gameState === "MEMORIA") { 
        drawMemoriaScreen();  // <--- ADICIONA ISTO
    } else if (gameState === "QUARTO") {
        drawQuartoScreen(); 
    } else if (gameState === "LIVRO") {
        drawLivroScreen();
    } else if (gameState === "MENU_PERSONAGENS") {
        drawMenuPersonagens();
    } else if (gameState === "NAVE") {
        drawNave();
    } else if (gameState === "TAREFA1") {
        drawTarefa1();
    } else if (gameState === "TAREFA2") {
        drawTarefa2();
    } else if (gameState === "TAREFA3") {
        drawTarefa3();
    } else if (gameState === "TAREFA4") {
        drawTarefa4();
    } else if (gameState === "TAREFA5") {
        drawTarefa5();
    } else if (gameState === "TAREFA6") {
        drawTarefa6();
    } else if (gameState === "TAREFA7") {
        drawTarefa7();
    } else if (gameState === "TAREFA8") {
        drawTarefa8();
    } else if (gameState === "VITORIA") { 
        drawVitoriaScreen();
    } else if (gameState === "MEMORIA") {
        drawMemoriaScreen();
    }

    if (gameState.startsWith("TAREFA")) {
        drawUniversalExit();
    }
    // Nota: MEMORIA não tem botão de exit — o clique já serve de skip/continuar

    handleTransition();
}

// ── Menu ──────────────────────────────────────
function drawMenu() {
    let sizelogo = windowWidth / 2600;

    image(bgMenu, 0, 0, menuNewW, menuNewH);
    
    push();
    imageMode(CENTER);
    image(logo, width / 2, height * 0.4, logo.width * sizelogo, logo.height * sizelogo);
    pop();

    textAlign(CENTER, CENTER);
    textFont('Impact');
    fill(255);
    textSize(width * 0.06);

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

// ── Sistema Dinâmico de Transições ──────────────────
// --- NOVO: Função goTo atualizada para gerir múltiplos efeitos ---
function goTo(novoEstado, tipo = "NONE") {
    nextState = novoEstado;
    transitionType = tipo;
    

    if (novoEstado === "LIVRO") {
        if (somAmbienteNave && somAmbienteNave.isLoaded() && !somAmbienteNave.isPlaying()) {
            somAmbienteNave.loop(); // Toca em loop infinito
            somAmbienteNave.setVolume(0.5); // Ajuste o volume conforme necessário (0.0 a 1.0)
        }
    }

    if (tipo === "FADE") {
        isFading = true;
    } 
    else if (tipo === "NOISE") {
        noiseCounter = 0; 
    } 
    else {
        gameState = novoEstado; 
    }

    if (novoEstado.startsWith("TAREFA")) {
        if (somAmbienteNave && somAmbienteNave.isPlaying()) {
            somAmbienteNave.setVolume(0.1, 0.5); // Baixa para 10% de volume em 0.5 segundos
        }
    } 
    // Se voltar para a nave ou livro, sobe o volume novamente
    else if (novoEstado === "NAVE" || novoEstado === "LIVRO") {
        if (somAmbienteNave && somAmbienteNave.isPlaying()) {
            somAmbienteNave.setVolume(0.5, 0.5); // Sobe para 50% de volume
        }
    }
}

function handleTransition() {
    // 1. Transição: Fade a Preto
    if (transitionType === "FADE" || isFading) {
        if (isFading) {
            fadeAlpha += 10; 
            if (fadeAlpha >= 255) {
                gameState = nextState;
                isFading = false;
            }
        } else if (fadeAlpha > 0) {
            fadeAlpha -= 10; 
            if (fadeAlpha <= 0) {
                transitionType = "NONE";
            }
        }
        push();
        noStroke();
        fill(0, fadeAlpha);
        rect(0, 0, width, height);
        pop();
    }
    // 2. Transição: Estática de TV (Noise)
    else if (transitionType === "NOISE") {
        noiseCounter++;
        
        push();
        noStroke();
        let pixelSize = 5; // Tamanho do "grão" da TV. Aumentar se o PC ficar lento.
        
        for (let x = 0; x < width; x += pixelSize) {
            for (let y = 0; y < height; y += pixelSize) {
                // Sorteia um tom de cinza/preto/branco para cada quadrado
                fill(random(255)); 
                rect(x, y, pixelSize, pixelSize);
            }
        }
        pop();

        // Quando atingir a duração definida, faz a troca e desliga a transição
        if (noiseCounter >= noiseDuration) {
            gameState = nextState;
            transitionType = "NONE"; 
            noiseCounter = 0;
        }
    }
}

// ── Input ─────────────────────────────────────
function mousePressed() {
    // Ignora cliques enquanto houver uma transição a decorrer
    if (transitionType !== "NONE" || isFading) return; 

    if (gameState.startsWith("TAREFA")) {
        if (checkUniversalExit()) return; 
    }
    
    if (gameState === "MENU") {
        // --- Clique no Botão START ---
        if (
            mouseX > startBtn.x - startBtn.w / 2 && mouseX < startBtn.x + startBtn.w / 2 &&
            mouseY > startBtn.y - startBtn.h / 2 && mouseY < startBtn.y + startBtn.h / 2
        ) {
            let fs = fullscreen();
            fullscreen(!fs);
            goTo("QUARTO", "FADE"); 
        }
        
        // --- Clique no Botão ABOUT ---
        if (
            mouseX > aboutBtn.x - aboutBtn.w / 2 && mouseX < aboutBtn.x + aboutBtn.w / 2 &&
            mouseY > aboutBtn.y - aboutBtn.h / 2 && mouseY < aboutBtn.y + aboutBtn.h / 2
        ) {
            goTo("ABOUT", "FADE"); // Usa o efeito Fade para entrar no About
        }
    }
    // --- LÓGICA DE CLIQUE NO ECRÃ ABOUT ---
    else if (gameState === "ABOUT") {
        let ex = width * 0.05; 
        let ey = height * 0.08; 
        let size = width * 0.025;
        
        // Se clicar na cruzinha, volta ao menu
        if (dist(mouseX, mouseY, ex, ey) < size / 2) {
            goTo("MENU", "FADE"); 
        }
    }
    else if (gameState === "QUARTO") {
        handleQuartoClick(); 
    } else if (gameState === "LIVRO") {
        handleLivroClick();
    } else if (gameState === "MENU_PERSONAGENS") {
        handlePersonagensClick();
    } else if (gameState === "NAVE") {
        handleNaveClick(); 
    } else if (gameState === "TAREFA1") {
        mousePressedTarefa1();
    } else if (gameState === "TAREFA2") {
        mousePressedTarefa2();
    } else if (gameState === "TAREFA3") {
        mousePressedTarefa3();
    } else if (gameState === "TAREFA4") {
        mousePressedTarefa4();
    } else if (gameState === "TAREFA5") {
        mousePressedTarefa5();
    } else if (gameState === "TAREFA6") {
        mousePressedTarefa6();
    } else if (gameState === "TAREFA7") {
        mousePressedTarefa7();
    } else if (gameState === "TAREFA8") {
        mousePressedTarefa8();
    } else if (gameState === "VITORIA") { 
        handleVitoriaClick();
    } else if (gameState === "MEMORIA") {
        handleMemoriaClick();
    }
}

function keyPressed() {
    if (gameState === "TAREFA3") {
        keyPressedTarefa3();
    }
    else if (gameState === "TAREFA4") {
        keyPressedTarefa4();
    }
    else if (gameState === "TAREFA5") {
        keyPressedTarefa5();
    }
}

function mouseReleased() {
    if (gameState === "TAREFA6") {
        mouseReleasedTarefa6();
    }
    else if (gameState === "TAREFA7") {
        mouseReleasedTarefa7();
    }
}

function mouseDragged() {
    if (gameState === "TAREFA7") {
        mouseDraggedTarefa7();
    }
}

function drawTaskInstructions(title, description) {
    
    // Fundo escuro sobre a tarefa
    fill(0, 0, 0, 230);
    rect(0, 0, WIDE_WIDTH, WIDE_HEIGHT);

    push();
    textAlign(CENTER, CENTER);
    textFont('Impact');
    
    // Título em Ciano com Neon
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = color(0, 255, 255);
    fill(0, 255, 255);
    textSize(40);
    text(title.toUpperCase(), WIDE_WIDTH / 2, WIDE_HEIGHT / 2 - 80);

    // Descrição em Branco (sem neon para legibilidade)
    drawingContext.shadowBlur = 0;
    fill(255);
    textSize(18);
    
    // --- ADICIONA ESTA LINHA PARA EVITAR O BUG DO P5.JS ---
    textAlign(CENTER, TOP); 
    
    // Wrap do texto para não sair das bordas
    text(description, WIDE_WIDTH / 2 - 200, WIDE_HEIGHT / 2 - 30, 400, 150);

    // --- DEPOIS VOLTA A PÔR AO CENTRO PARA O BOTÃO START ---
    textAlign(CENTER, CENTER);

    // Botão START
    let btnX = WIDE_WIDTH / 2;
    let btnY = WIDE_HEIGHT / 2 + 100;
    let btnW = 150;
    let btnH = 50;

    // Detetar hover do rato (considerando a escala do pop-up)
    let vmX = (mouseX - widePopX) / (widePopW / WIDE_WIDTH);
    let vmY = (mouseY - widePopY) / (widePopH / WIDE_HEIGHT);
    
    if (vmX > btnX - btnW/2 && vmX < btnX + btnW/2 && vmY > btnY - btnH/2 && vmY < btnY + btnH/2) {
        fill(0, 255, 100); // Verde no hover
        cursor(HAND);
    } else {
        noFill();
        stroke(255);
    }
    
    strokeWeight(2);
    rect(btnX - btnW/2, btnY - btnH/2, btnW, btnH, 10);
    
    // Texto do Botão
    noStroke();
    fill(255);
    textSize(24);
    text("START", btnX, btnY);
    pop();
}

function checkStartClick() {
    // Calculamos a posição do rato relativa ao sistema 800x450
    let vmX = (mouseX - widePopX) / (widePopW / WIDE_WIDTH);
    let vmY = (mouseY - widePopY) / (widePopH / WIDE_HEIGHT);
    
    // O botão está no centro (400) e a Y=325 (WIDE_HEIGHT/2 + 100)
    // Largura 150 (metade=75) e Altura 50 (metade=25)
    let btnX = 400;
    let btnY = 325;
    
    return (vmX > btnX - 75 && vmX < btnX + 75 && vmY > btnY - 25 && vmY < btnY + 25);
}


// ── Ecrã About ──────────────────────────────────────
function drawAboutScreen() {
    // Desenha o fundo do menu
    image(bgMenu, 0, 0, menuNewW, menuNewH);
    
    // Película escura
    noStroke();
    fill(0, 0, 0, 220);
    rect(0, 0, width, height);

    push();
    textAlign(CENTER, CENTER);
    textFont('Impact');

    // Título Néon Ciano
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = color(0, 255, 255);
    fill(0, 255, 255);
    textSize(width * 0.04);
    text("ABOUT THE PROJECT", width / 2, height * 0.25);

    // Corpo de Texto
    drawingContext.shadowBlur = 0;
    fill(255);
    textSize(max(18, width * 0.015)); // Tamanho responsivo, mas nunca menor que 18
    textAlign(CENTER, TOP); // Alinha pelo topo para o wrap funcionar bem

    let aboutText = "Re-Discovery is an interactive web experience that explores the intersection of music, narrative, and digital art, inspired by Daft Punk’s Discovery and the film Interstella 5555. The project’s core concept revolves around the tension between corporate control and individual identity, symbolized by the mind-control glasses that frame the player's view. As the player progresses through rhythmic challenges to recover lost fragments of memory, this visual barrier progressively cracks, representing the process of breaking a forced trance and reclaiming a stolen past. This work was created by Laura Patrício and Myrella Andrade for the Multimedia Communication (Comunicação Multimédia) course in the Design and Multimedia degree at the University of Coimbra.";

    // Caixa delimitadora de texto (Wrap) para manter as margens curtas e centradas
    let textW = width * 0.55; 
    text(aboutText, width / 2 - textW / 2, height * 0.35, textW, height * 0.5);
    pop();

    // Desenha o botão de voltar atrás
    drawAboutExitBtn();
}

function drawAboutExitBtn() {
    // Posição no canto superior esquerdo
    let ex = width * 0.05; 
    let ey = height * 0.08; 
    let size = width * 0.025; // O mesmo tamanho do teu exit universal

    push();
    imageMode(CENTER);

    // Efeito Hover
    if (dist(mouseX, mouseY, ex, ey) < size / 2) {
        cursor(HAND);
        tint(255, 150, 150); // Fica avermelhado
    }

    image(exitImg, ex, ey, size, size);
    pop();
}

function pararTodosSonsTarefas() {
    if (typeof som3 !== 'undefined' && som3.isPlaying()) som3.stop();
    if (typeof som4 !== 'undefined' && som4.isPlaying()) som4.stop();
    if (typeof stopAllTracks === 'function') stopAllTracks();
    if (typeof stopTarefa8Audio === 'function') stopTarefa8Audio();
}