let syllables = [];
let correctOrder = [2, 3, 0, 1]; 
let playerPath = [];
let currentWord = "";
let discoveryVisible = false;
let errorTimer = 0;
let flashError = false;
let tarefa7State = "INSTRUCTIONS";

const RING_X = 280; 
const RING_Y = 450 / 2; 
const RING_RADIUS = 120;

function preloadTarefa7() {
  bgImg7 = loadImage('imagens/tarefa4.png');
}

function setupTarefa7() {
  syllables = [
    { text: "VE", x: RING_X, y: RING_Y - 90, hit: false },
    { text: "RI", x: RING_X + 90, y: RING_Y, hit: false },
    { text: "DIS", x: RING_X, y: RING_Y + 90, hit: false },
    { text: "QUO", x: RING_X - 80, y: RING_Y, hit: false }
  ];
}

function drawTarefa7() {
  push();
  imageMode(CENTER);
  image(bgNave, width / 2, height / 2, naveNewW, naveNewH);
  pop();
  
  noStroke();
  fill(0, 0, 0, 180);
  rect(0, 0, width, height); 

  push();
  translate(widePopX, widePopY);
  scale(widePopW / WIDE_WIDTH, widePopH / WIDE_HEIGHT);

  // Certifique-se de que a variável bgImg7 está definida no seu preloadTarefa7
  imageMode(CORNER);
  image(bgImg7, 0, 0, WIDE_WIDTH, WIDE_HEIGHT);

  // ── LÓGICA DE ESTADOS (INSTRUÇÕES VS JOGO) ──
  if (tarefa7State === "INSTRUCTIONS") {
    drawTaskInstructions(
        "Veridis Quo", 
        "DECODE THE FRAGMENTS. Drag your mouse to connect the syllables in the correct order to reveal the secret message."
    );
  } 
  else {
    // --- LÓGICA ORIGINAL DO JOGO ---
    drawUIRing();
    drawSyllables();
    drawConnectionLine();
    
    if (discoveryVisible) {
      showWinScreenUniform7();
    } else {
      drawResultArea();
    }
  }
  
  pop(); 
}

function drawUIRing() {
  fill(0, 0, 0, 125);
  stroke(0, 255, 255, 100);
  strokeWeight(4);
  ellipse(RING_X, RING_Y, RING_RADIUS * 2.5, RING_RADIUS * 2);
}

function drawSyllables() {
  textAlign(CENTER, CENTER);
  textFont('Impact'); // Uniform Font
  textSize(32);
  strokeWeight(2);
  
  for (let i = 0; i < syllables.length; i++) {
    let s = syllables[i];
    
    if (playerPath.includes(i)) {
      fill(0, 255, 100); 
    } else {
      fill(0, 255, 255); 
    }
    
    text(s.text, s.x, s.y);
  }
}

function drawConnectionLine() {
  if (mouseIsPressed && playerPath.length > 0) {
    let virtualMouseX = (mouseX - widePopX) / (widePopW / WIDE_WIDTH);
    let virtualMouseY = (mouseY - widePopY) / (widePopH / WIDE_HEIGHT);

    stroke(0, 255, 100, 200);
    strokeWeight(4);
    noFill();
    beginShape();
    for (let index of playerPath) {
      vertex(syllables[index].x, syllables[index].y);
    }
    vertex(virtualMouseX, virtualMouseY); 
    endShape();
  }
}

function drawResultArea() {
  textAlign(CENTER, CENTER); 
  textFont('Impact'); // Fonte uniforme para todo o sistema
  let displayX = 660; 
  
  if (flashError) {
    // Estilo de Falha Uniforme:
    push();
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = color(255, 0, 0); // Brilho Neon Vermelho
    fill(255, 50, 50);
    
    // Tamanho proporcional ao pop-up (WIDE_WIDTH * 0.08) para impacto visual
    textSize(WIDE_WIDTH * 0.08); 
    text("FAILED", displayX, 230); // Texto em CAIXA ALTA uniforme
    pop();
    
    errorTimer--;
    if (errorTimer <= 0) {
      flashError = false;
      resetAttempt();
    }
    
  } else if (currentWord !== "") {
    // Feedback visual de progresso (Neon Verde)[cite: 2]
    push();
    fill(0, 255, 100);
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = color(0, 255, 100);
    textSize(40);
    text(currentWord.toUpperCase(), displayX, 220); // UPPERCASE uniforme[cite: 1]
    pop();
  }
  
  drawingContext.shadowBlur = 0; // Reset do brilho para outros elementos
}

// Uniformized Win Screen for Tarefa 7[cite: 1]
function showWinScreenUniform7() {
    fill(0, 0, 0, 200);
    rect(0, 0, WIDE_WIDTH, WIDE_HEIGHT);
    
    push();
    textAlign(CENTER, CENTER);
    textFont('Impact');
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = color(0, 255, 100);
    
    fill(0, 255, 100);
    textSize(WIDE_WIDTH * 0.08); 
    text("IDENTITY RECOVERED", WIDE_WIDTH / 2, WIDE_HEIGHT / 2);
    
    drawingContext.shadowBlur = 0; 
    textSize(WIDE_WIDTH * 0.03);
    fill(255);
    text("DISCOVERY COMPLETE", WIDE_WIDTH / 2, WIDE_HEIGHT / 2 + 60);
    pop();
}


function mousePressedTarefa7() {
  // 1. Verificar clique no botão de instruções
  if (tarefa7State === "INSTRUCTIONS") {
    if (checkStartClick()) {
      tarefa7State = "PLAY"; // Define como PLAY para começar o jogo
    }
    return;
  }

  // 2. Lógica original de início de conexão
  if (discoveryVisible) return;

  let virtualMouseX = (mouseX - widePopX) / (widePopW / WIDE_WIDTH);
  let virtualMouseY = (mouseY - widePopY) / (widePopH / WIDE_HEIGHT);

  for (let i = 0; i < syllables.length; i++) {
    let d = dist(virtualMouseX, virtualMouseY, syllables[i].x, syllables[i].y);
    if (d < 40) {
      playerPath = [i];
      updateDisplayWord();
      break;
    }
  }
}

function mouseDraggedTarefa7() {
  if (discoveryVisible) return;

  // Calculamos o rato virtual para colidir com as sílabas em miniatura
  let virtualMouseX = (mouseX - widePopX) / (widePopW / WIDE_WIDTH);
  let virtualMouseY = (mouseY - widePopY) / (widePopH / WIDE_HEIGHT);

  for (let i = 0; i < syllables.length; i++) {
    let d = dist(virtualMouseX, virtualMouseY, syllables[i].x, syllables[i].y);
    
    if (d < 40 && !playerPath.includes(i)) {
      playerPath.push(i);
      updateDisplayWord();
    }
  }
}

function mouseReleasedTarefa7() {
  if (discoveryVisible) return;

  if (playerPath.length === correctOrder.length) {
    let isCorrect = true;
    for (let i = 0; i < playerPath.length; i++) {
      if (playerPath[i] !== correctOrder[i]) {
        isCorrect = false;
        break;
      }
    }

   if (isCorrect) {
      currentWord = "disquoveri";
      discoveryVisible = true;
      
      // --- VITÓRIA E DESBLOQUEIO ---
      TarefaConcluida.veridis = true; 
      
      // --- CONFLITO RESOLVIDO AQUI ---
      setTimeout(() => {
          resetAttempt(); 
          discoveryVisible = false;
          tarefa7State = "INSTRUCTIONS"; // Reset da colega
          concluirComMemoria("veridis"); // A tua chamada de vídeo
      }, 1500);

    } else {
      currentWord = ""; 
      flashError = true;
      errorTimer = 70; 
      playerPath = []; 
    }
  } else {
    resetAttempt();
  }
}

function updateDisplayWord() {
  let temp = "";
  for (let index of playerPath) {
    temp += syllables[index].text;
  }
  currentWord = temp.toLowerCase();
}

function resetAttempt() {
  playerPath = [];
  currentWord = "";
}