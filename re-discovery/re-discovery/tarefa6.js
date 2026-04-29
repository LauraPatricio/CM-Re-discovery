let bgImg6;
let rocketImg6;
let isDragging6 = false;
let tarefa6State = "START"; 
let pathPoints6 = [];

// O buffer de deteção (reduzido de 30 para 25 para combinar com a nova janela)
const tolerance6 = 25; 

function preloadTarefa6() {
  bgImg6 = loadImage('imagens/tarefa6.png');
  rocketImg6 = loadImage('imagens/rocket.png');
}

function setupTarefa6() {
  // Pontos exatos já recalculados manualmente para o ecrã virtual 800x450!
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
  image(bgNave, 0, 0, width, height); 
  
  noStroke();
  fill(0, 0, 0, 180);
  rect(0, 0, width, height); 

  // ── ESCALA PARA O POP-UP WIDESCREEN ──
  push();
  translate(widePopX, widePopY);
  scale(widePopW / WIDE_WIDTH, widePopH / WIDE_HEIGHT);

  imageMode(CORNER);
  image(bgImg6, 0, 0, WIDE_WIDTH, WIDE_HEIGHT);
  
  // Se quiseres ver a linha guia, retira as duas barras "//" na linha abaixo:
  // drawDebugPath6(); 

  if (tarefa6State === "START") {
    drawOverlay6("VOYAGER", "Hold the mouse to guide the rocket to the planet.");
    drawRocket6(pathPoints6[0].x, pathPoints6[0].y);
  } 
  else if (tarefa6State === "PLAYING") {
    updateGame6();
  } 
  else if (tarefa6State === "FAIL") {
    drawOverlay6("STRAYED FROM PATH", "Click the start to try again!");
    drawRocket6(pathPoints6[0].x, pathPoints6[0].y);
  } 
  else if (tarefa6State === "WIN") {
    drawOverlay6("MEMORY RECOVERED", "You've broken the trance!");
  }

  pop(); // Fim da escala
}

function drawDebugPath6() {
  for (let p of pathPoints6) {
    noFill();
    stroke(255, 0, 0, 100); 
    circle(p.x, p.y, tolerance6 * 2);
    
    fill(255, 0, 0);
    noStroke();
    circle(p.x, p.y, 8);
  }
}

function updateGame6() {
  if (isDragging6) {
    // Cálculo do rato virtual devido à escala da janela
    let virtualMouseX = (mouseX - widePopX) / (widePopW / WIDE_WIDTH);
    let virtualMouseY = (mouseY - widePopY) / (widePopH / WIDE_HEIGHT);

    let minD = 1000;
    // ver qual é o checkpoint mais perto do rato
    for (let p of pathPoints6) {
      let d = dist(virtualMouseX, virtualMouseY, p.x, p.y);
      if (d < minD) minD = d;
    }

    // Se fugires da linha guia
    if (minD > tolerance6) {
      tarefa6State = "FAIL";
      isDragging6 = false; 
    }

    // Quando chega ao final
    let endPoint = pathPoints6[pathPoints6.length - 1];
    if (dist(virtualMouseX, virtualMouseY, endPoint.x, endPoint.y) < 25) {
      tarefa6State = "WIN";
      isDragging6 = false;
      
      // --- VITÓRIA E DESBLOQUEIO ---
      TarefaConcluida.voyager = true; 
      setTimeout(() => {
          goTo("NAVE");
          resetGame6();
      }, 1500);
    }

    drawRocket6(virtualMouseX, virtualMouseY);
  }
}

function drawRocket6(x, y) {
  imageMode(CENTER);
  image(rocketImg6, x, y, 60, 60);
}

function drawOverlay6(title, subtitle) {
  fill(0, 0, 0, 180);
  rect(0, 0, WIDE_WIDTH, WIDE_HEIGHT);
  
  textAlign(CENTER, CENTER);
  fill(0, 255, 255); 
  textSize(40);
  text(title, WIDE_WIDTH / 2, WIDE_HEIGHT / 2 - 30);
  
  fill(255);
  textSize(20);
  text(subtitle, WIDE_WIDTH / 2, WIDE_HEIGHT / 2 + 30);
}

function mousePressedTarefa6() {
  let virtualMouseX = (mouseX - widePopX) / (widePopW / WIDE_WIDTH);
  let virtualMouseY = (mouseY - widePopY) / (widePopH / WIDE_HEIGHT);

  if (tarefa6State === "START" || tarefa6State === "FAIL") {
    // Verifica se clica perto da base do foguetão para arrancar
    if (dist(virtualMouseX, virtualMouseY, pathPoints6[0].x, pathPoints6[0].y) < 100) {
      tarefa6State = "PLAYING";
      isDragging6 = true;
    }
  } else if (tarefa6State === "PLAYING") {
    isDragging6 = true;
  }
}

function mouseReleasedTarefa6() {
  if (tarefa6State === "PLAYING") {
    // Se o jogador largar o rato a meio do caminho, falha a missão!
    tarefa6State = "FAIL";
    isDragging6 = false;
  }
}

function resetGame6() {
  tarefa6State = "START";
  isDragging6 = false;
}