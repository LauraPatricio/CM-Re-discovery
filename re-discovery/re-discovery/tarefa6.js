let bgImg6;
let rocketImg6;
let isDragging6 = false;
let tarefa6State = "INSTRUCTIONS";
let pathPoints6 = [];
const tolerance6 = 25; 

function preloadTarefa6() {
  bgImg6 = loadImage('imagens/tarefa6.png');
  rocketImg6 = loadImage('imagens/rocket.png');
}

function setupTarefa6() {
  pathPoints6 = [
    { x: 140.6, y: 234.4 }, { x: 140.6, y: 195.3 }, { x: 156.3, y: 168.0 },
    { x: 179.7, y: 132.8 }, { x: 210.9, y: 125.0 }, { x: 234.4, y: 164.1 },
    { x: 234.4, y: 203.1 }, { x: 234.4, y: 234.4 }, { x: 226.6, y: 257.8 },
    { x: 218.8, y: 289.1 }, { x: 234.4, y: 328.1 }, { x: 257.8, y: 335.9 },
    { x: 289.1, y: 312.5 }, { x: 312.5, y: 289.1 }, { x: 328.1, y: 265.6 },
    { x: 351.6, y: 234.4 }, { x: 382.8, y: 203.1 }, { x: 406.3, y: 179.7 },
    { x: 445.3, y: 164.1 }, { x: 468.8, y: 179.7 }, { x: 460.9, y: 210.9 },
    { x: 453.1, y: 234.4 }, { x: 453.1, y: 265.6 }, { x: 492.2, y: 257.8 },
    { x: 515.6, y: 234.4 }, { x: 546.9, y: 218.8 }, { x: 578.1, y: 218.8 }
  ];
}

function drawTarefa6() {
  // ── EFEITO POP-UP ──
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

  imageMode(CORNER);
  image(bgImg6, 0, 0, WIDE_WIDTH, WIDE_HEIGHT);

  // ── LÓGICA DE ESTADOS (INSTRUÇÕES VS JOGO) ──
  if (tarefa6State === "INSTRUCTIONS") {
    drawTaskInstructions(
        "Voyager", 
        "GUIDE THE VOYAGER. Click and hold the rocket to guide it through the cosmic path. Do not stray from the path or the connection will be lost."
    );
  } 
  else {
    // --- LÓGICA ORIGINAL DO JOGO ---
    if (tarefa6State === "START") {
      drawOverlay6("VOYAGER", "HOLD MOUSE TO GUIDE ROCKET");
      drawRocket6(pathPoints6[0].x, pathPoints6[0].y);
    } 
    else if (tarefa6State === "PLAYING") {
      updateGame6();
    } 
    else if (tarefa6State === "FAIL") {
      drawOverlay6("FAILED", "STRAYED FROM PATH - TRY AGAIN");
      drawRocket6(pathPoints6[0].x, pathPoints6[0].y);
    }
    else if (tarefa6State === "WIN") {
      showWinScreenUniform();
    }
  }

  pop(); 
}

// Updated Overlay to match uniform typography and neon style
function drawOverlay6(title, subtitle) {
    fill(0, 0, 0, 180);
    rect(0, 0, WIDE_WIDTH, WIDE_HEIGHT);
    
    push();
    textAlign(CENTER, CENTER);
    textFont('Impact'); // Uniform font
    
    // Check if it's a failure to apply Red Neon, otherwise use Cyan
    if (title === "FAILED") {
        drawingContext.shadowBlur = 15;
        drawingContext.shadowColor = color(255, 0, 0); // Red shadow
        fill(255, 0, 0); // Red text
    } else {
        drawingContext.shadowBlur = 15;
        drawingContext.shadowColor = color(0, 255, 255); // Cyan shadow
        fill(0, 255, 255); // Cyan text
    }
    
    textSize(WIDE_WIDTH * 0.08); // Scale text size to pop-up width[cite: 1]
    text(title, WIDE_WIDTH / 2, WIDE_HEIGHT / 2 - 30);
    
    // Subtitle (Uniform white text)
    drawingContext.shadowBlur = 0;
    fill(255);
    textSize(WIDE_WIDTH * 0.03);
    text(subtitle, WIDE_WIDTH / 2, WIDE_HEIGHT / 2 + 60);
    pop();
}

// NEW: Uniform Win Screen Function added here for clarity
function showWinScreenUniform() {
    fill(0, 0, 0, 200);
    rect(0, 0, WIDE_WIDTH, WIDE_HEIGHT);
    
    push();
    textAlign(CENTER, CENTER);
    textFont('Impact');
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = color(0, 255, 100); // Green Neon[cite: 1, 2]
    
    fill(0, 255, 100);
    textSize(WIDE_WIDTH * 0.08); 
    text("IDENTITY RECOVERED", WIDE_WIDTH / 2, WIDE_HEIGHT / 2);
    
    drawingContext.shadowBlur = 0; 
    textSize(WIDE_WIDTH * 0.03);
    fill(255);
    text("MEMORY SYNCED...", WIDE_WIDTH / 2, WIDE_HEIGHT / 2 + 60);
    pop();
}

function updateGame6() {
  if (isDragging6) {
    let virtualMouseX = (mouseX - widePopX) / (widePopW / WIDE_WIDTH);
    let virtualMouseY = (mouseY - widePopY) / (widePopH / WIDE_HEIGHT);

    let minD = 1000;
    for (let p of pathPoints6) {
      let d = dist(virtualMouseX, virtualMouseY, p.x, p.y);
      if (d < minD) minD = d;
    }

    if (minD > tolerance6) {
      tarefa6State = "FAIL";
      isDragging6 = false; 
    }

    let endPoint = pathPoints6[pathPoints6.length - 1];
    if (dist(virtualMouseX, virtualMouseY, endPoint.x, endPoint.y) < 25) {
      tarefa6State = "WIN";
      isDragging6 = false;
      TarefaConcluida.voyager = true; 
      
      // --- A MUDANÇA ESTÁ AQUI ---
      setTimeout(() => {
          resetGame6(); // Limpa a tarefa para a próxima vez
          concluirComMemoria("voyager"); // Chama o vídeo da memória correspondente!
      }, 1500);
    }
    
    drawRocket6(virtualMouseX, virtualMouseY);
  }
}

function drawRocket6(x, y) {
  imageMode(CENTER);
  image(rocketImg6, x, y, 60, 60);
}

function mousePressedTarefa6() {
  // 1. Verificar clique no botão de instruções
  if (tarefa6State === "INSTRUCTIONS") {
    if (checkStartClick()) {
      tarefa6State = "START"; 
    }
    return; // Impede interações com o foguetão antes de começar
  }

  // 2. Lógica original de clique/arrasto (apenas se o jogo já começou)
  let virtualMouseX = (mouseX - widePopX) / (widePopW / WIDE_WIDTH);
  let virtualMouseY = (mouseY - widePopY) / (widePopH / WIDE_HEIGHT);

  if (tarefa6State === "START" || tarefa6State === "FAIL") {
    // Verifica se clicou perto do ponto inicial para começar a arrastar
    if (dist(virtualMouseX, virtualMouseY, pathPoints6[0].x, pathPoints6[0].y) < 30) {
      tarefa6State = "PLAYING";
      isDragging6 = true;
    }
  }
}

function mouseReleasedTarefa6() {
  if (tarefa6State === "PLAYING") {
    tarefa6State = "FAIL";
    isDragging6 = false;
  }
}

function resetGame6() {
  tarefa6State = "INSTRUCTIONS";
  isDragging6 = false;
}