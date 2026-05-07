let bgImg2; // Renomeado para não chocar com o bg da Tarefa 1
let buttonImages = {};
let words = ["WORK IT", "MAKE IT", "DO IT", "MAKES US", "HARDER", "BETTER", "FASTER", "STRONGER"];
let buttons2 = []; // Renomeado para evitar conflitos

let correctSequence = [];
let playerSequence2 = [];
let tarefa2State = "INSTRUCTIONS";
let sequenceIndex = 0;
let displayWord = "";
let loseTimer = 0;

// ── VARIÁVEIS DO POP-UP DA TAREFA 2 ──
let t2_popX, t2_popY, t2_popW, t2_popH;

// No topo do ficheiro tarefa2.js
let wordSounds = {}; 

function preloadTarefa2() {
    bgImg2 = loadImage('imagens/tarefa2.png');
    for (let word of words) {
        buttonImages[word] = loadImage('imagens/' + word + '.png');
        // Carrega o som correspondente a cada palavra (ex: imagens/BETTER.mp3)
        wordSounds[word] = loadSound('sons/' + word + '.mp3'); 
    }
}

function setupTarefa2() {
    // Sem createCanvas! Apenas geramos a sequência e preparamos os botões
    generateRandomSequence(4);
    initializeButtonsTarefa2();
}

function initializeButtonsTarefa2() {
    buttons2 = [];

    // 1. Calcular o tamanho do Pop-up (proporção original era 800x500)
    t2_popW = width * 0.65;
    t2_popH = t2_popW * (500 / 800);

    if (t2_popH > height * 0.65) {
        t2_popH = height * 0.65;
        t2_popW = t2_popH * (800 / 500);
    }

    // 2. Calcular o centro
    t2_popX = width / 2 - t2_popW / 2;
    t2_popY = height / 2 - t2_popH / 2;

    // 3. Coordenadas relativas à proporção original (800x500)
    let startX = t2_popX + t2_popW * (130 / 800);
    let startY = t2_popY + t2_popH * (320 / 500);
    let colGap = t2_popW * (115 / 800);
    let rowGap = t2_popH * (65 / 500);

    let btnW = t2_popW * (100 / 800);
    let btnH = t2_popH * (50 / 500);

    for (let i = 0; i < words.length; i++) {
        let col = i % 5;
        let row = floor(i / 5);
        buttons2.push({
            word: words[i],
            x: startX + (col * colGap),
            y: startY + (row * rowGap),
            w: btnW,
            h: btnH
        });
    }
}

function drawTarefa2() {
    // ── EFEITO POP-UP ──
    push();
    imageMode(CENTER);
    image(bgNave, width/2, height/2, naveNewW, naveNewH);
    pop();

    noStroke();
    fill(0, 0, 0, 180);
    rect(0, 0, width, height); // Película escura

    push();
    imageMode(CORNER);
    image(bgImg2, t2_popX, t2_popY, t2_popW, t2_popH); // Imagem da tarefa
    pop();

    // ── LÓGICA DE ESTADOS (INSTRUÇÕES VS JOGO) ──
    if (tarefa2State === "INSTRUCTIONS") {
        // Mostra o ecrã de instruções uniformizado
        push();
        translate(t2_popX, t2_popY);
        // Garante que a proporção bate certo com o tamanho do pop-up
        scale(t2_popW / WIDE_WIDTH, t2_popH / WIDE_HEIGHT); 
        drawTaskInstructions(
            "Harder Better Faster Stronger", 
            "SYNC THE VOCALS. Watch the lyrics flash on the screen. Once the sequence ends, click the buttons in the exact same order to reconstruct the code."
        );
        pop();
    } 
    else {
        // --- TUDO O QUE ESTÁ AQUI SÓ ACONTECE DEPOIS DE CLICAR NO START ---
        
        if (tarefa2State === 'MEMORIZE') {
            handleMemorizePhase();
        } else if (tarefa2State === 'PLAY') {
            drawNeonPhrase(playerSequence2, color(0, 255, 100));
        } else if (tarefa2State === 'WIN') {
            drawNeonPhrase(["MEMORY SYNCED"], color(0, 255, 100));
        } else if (tarefa2State === 'LOSE') {
            handleLoseState();
        }

        drawButtonsTarefa2(); // Só desenha os botões se o jogo já tiver começado!
    }
}

function handleMemorizePhase() {
    let frameCycle = frameCount % 120;

    if (frameCycle === 0 && sequenceIndex < correctSequence.length) {
        displayWord = correctSequence[sequenceIndex];
        // Toca o som da palavra exibida
        if (wordSounds[displayWord]) wordSounds[displayWord].play(); 
        sequenceIndex++;
    } else if (frameCycle === 60) {
        displayWord = "";
    }

    if (sequenceIndex === correctSequence.length && frameCycle === 119) {
        tarefa2State = 'PLAY';
    }

    if (displayWord !== "") {
        drawNeonPhrase([displayWord], color(0, 255, 100));
    }
}

function handleLoseState() {
    drawNeonPhrase(["SYNC FAILED"], color(255, 50, 50));

    loseTimer++;
    if (loseTimer > 120) {
        loseTimer = 0;
        playerSequence2 = [];
        sequenceIndex = 0;
        displayWord = "";
        tarefa2State = 'MEMORIZE';
    }
}

function drawButtonsTarefa2() {
    for (let b of buttons2) {
        image(buttonImages[b.word], b.x, b.y, b.w, b.h);
    }
}

function drawNeonPhrase(sequence, col) {
    textAlign(CENTER, CENTER);

    // Tamanho do texto ajustado ao pop-up
    textSize(t2_popW * (30 / 800));
    let phrase = sequence.join(" ");

    // Posição Y do texto relativa ao pop-up (original era 135)
    let textY = t2_popY + t2_popH * (135 / 500);

    push();
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = col;

    fill(col);
    text(phrase, width / 2, textY);

    drawingContext.shadowBlur = 5;
    fill(255);
    text(phrase, width / 2, textY);
    pop();
}

function mousePressedTarefa2() {
    // 1. Verificar o botão Start no menu de instruções
    if (tarefa2State === "INSTRUCTIONS") {
        if (checkStartClick()) {
            tarefa2State = "MEMORIZE"; // Muda de estado para começar a piscar as palavras
        }
        return; // Pára aqui
    }

    // 2. A tua lógica normal do jogo (só os cliques nas palavras)
    // Só deixamos clicar se o estado for PLAY (depois de memorizar)
    if (tarefa2State !== 'PLAY') return;

    for (let b of buttons2) {
        if (mouseX > b.x && mouseX < b.x + b.w && mouseY > b.y && mouseY < b.y + b.h) {
            if (wordSounds[b.word]) wordSounds[b.word].play(); 
            checkInput(b.word);
            break;
        }
    }
}

function checkInput(clickedWord) {
    playerSequence2.push(clickedWord);

    if (playerSequence2.length === correctSequence.length) {
        let isCorrect = true;
        for (let i = 0; i < correctSequence.length; i++) {
            if (playerSequence2[i] !== correctSequence[i]) {
                isCorrect = false;
                break;
            }
        }

        if (isCorrect) {
            tarefa2State = 'WIN';

            // --- VITÓRIA E DESBLOQUEIO ---
            TarefaConcluida.harder = true;

            setTimeout(() => {
                // 1. Reset automático para a próxima vez que jogar
                generateRandomSequence(4);
                playerSequence2 = [];
                sequenceIndex = 0;
                displayWord = "";
                
                // 2. Usar o reset da tua colega para as instruções
                tarefa2State = "INSTRUCTIONS";
                
                // 3. Chamar a tua função de memória em vez de ir para a Nave
                concluirComMemoria("harder"); 
            }, 1500);

        } else {
            tarefa2State = 'LOSE';
            loseTimer = 0;
        }
    }
}

function generateRandomSequence(len) {
    correctSequence = [];
    for (let i = 0; i < len; i++) {
        correctSequence.push(random(words));
    }
}

// Para redimensionar a janela adequadamente
function windowResizedTarefa2() {
    initializeButtonsTarefa2();
}