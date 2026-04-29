let bgImg5; // Renomeado para não chocar com outras tarefas
let rings = [];
let currentRing = 0; 
let tarefa5State = 'PLAY'; // Substitui o gameState global
const GOAL5 = 3;

// Ajustadas ligeiramente para o nosso padrão 800x450 (eram para 900x500)
let bX5 = 80; 
let bW5 = 186;
let bH5 = 54;
let bY_positions5 = [88, 198, 306]; 

function preloadTarefa5() {
  bgImg5 = loadImage('imagens/tarefa5.png'); // Adicionado 'imagens/'
}

function setupTarefa5() {
  // Sem createCanvas! Já usamos o sistema global WIDE_WIDTH e WIDE_HEIGHT do menu
  
  // Coordenadas ajustadas proporcionalmente para caberem no ecrã de 800x450
  rings.push(new SyncRing(377, 117, color(147, 32, 146))); 
  rings.push(new SyncRing(377, 225, color(31, 64, 153)));  
  rings.push(new SyncRing(377, 334, color(0, 169, 127)));  
}

function drawTarefa5() {
  // ── EFEITO POP-UP ──
  image(bgNave, 0, 0, width, height); // Fundo da nave
  
  noStroke();
  fill(0, 0, 0, 180);
  rect(0, 0, width, height); // Película escura

  // ── ESCALA PARA O POP-UP WIDESCREEN ──
  push();
  translate(widePopX, widePopY);
  scale(widePopW / WIDE_WIDTH, widePopH / WIDE_HEIGHT);

  imageMode(CORNER);
  image(bgImg5, 0, 0, WIDE_WIDTH, WIDE_HEIGHT);

  if (tarefa5State === 'PLAY') {
    displayHUD5();
    drawDebugButtons5(); 

    for (let i = 0; i < rings.length; i++) {
      rings[i].update();
      rings[i].show();
    }

    // --- CONDIÇÃO DE VITÓRIA ---
    if (currentRing >= GOAL5) {
      tarefa5State = 'WIN';
      
      // Avisa a nave que ganhámos a Tarefa 5 (Assume-se ser a tarefa "Some" do Octave)
      TarefaConcluida.some = true; 
      setTimeout(() => {
          goTo("NAVE");
          resetGame5(); // Limpa as variáveis para se o user quiser repetir
      }, 1500);
    }
  } else if (tarefa5State === 'WIN') {
    showWinScreen5();
  }
  
  pop(); // Fim da escala
}

function drawDebugButtons5() {
  for (let i = 0; i < bY_positions5.length; i++) {
    if (i === currentRing) {
      fill(0, 255, 255, 100); 
    } else {
      fill(255, 0, 0, 50);    
    }
    stroke(255);
    rect(bX5, bY_positions5[i], bW5, bH5);
  }
}

function displayHUD5() {
  fill(0, 255, 255);
  noStroke();
  textAlign(LEFT);
  textSize(20);
  text("SYNC INSTRUMENTS: " + currentRing + " / " + GOAL5, 60, 60);
}

function showWinScreen5() {
  fill(0, 0, 0, 200);
  rect(0, 0, WIDE_WIDTH, WIDE_HEIGHT);
  fill(0, 255, 255);
  textAlign(CENTER, CENTER);
  textSize(40);
  text("HARMONY RESTORED", WIDE_WIDTH / 2, WIDE_HEIGHT / 2);
  textSize(20);
  fill(255);
  text("SYNCING...", WIDE_WIDTH / 2, WIDE_HEIGHT / 2 + 50);
}

function mousePressedTarefa5() {
  if (tarefa5State === 'PLAY') {
    // --- MAGIA MATEMÁTICA: O clique virtual ---
    let virtualMouseX = (mouseX - widePopX) / (widePopW / WIDE_WIDTH);
    let virtualMouseY = (mouseY - widePopY) / (widePopH / WIDE_HEIGHT);

    if (virtualMouseX > bX5 && virtualMouseX < bX5 + bW5 &&
        virtualMouseY > bY_positions5[currentRing] && virtualMouseY < bY_positions5[currentRing] + bH5) {
      
      if (rings[currentRing].checkSync()) {
        rings[currentRing].isSynced = true;
        currentRing++;
      }
    }
  }
}

function keyPressedTarefa5() {
  // Agora o reset só funciona pelo rato ou sai sozinho após ganhar. 
  // Esta função pode ficar vazia, ou servir para atalhos de debug.
}

function resetGame5() {
  currentRing = 0;
  for (let ring of rings) {
    ring.isSynced = false;
    ring.angle = random(TWO_PI);
  }
  tarefa5State = 'PLAY';
}

class SyncRing {
  constructor(x, y, col) {
    this.x = x;
    this.y = y;
    this.col = col;
    this.angle = random(TWO_PI);
    this.speed = 0.04; 
    this.isSynced = false;
    this.radius = 70; 
  }

  update() {
    if (!this.isSynced) {
      this.angle += this.speed;
    }
  }

  show() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    fill(this.col);
    noStroke();
    rectMode(CENTER);
    rect(this.radius, 0, 30, 30, 4); 
    
    if (this.isSynced) {
      drawingContext.shadowBlur = 20;
      drawingContext.shadowColor = this.col;
      stroke(255);
      strokeWeight(3);
      noFill();
      ellipse(0, 0, this.radius * 2);
    }
    pop();
  }

  checkSync() {
    let normalizedAngle = this.angle % TWO_PI;
    let target = 0; 
    let tolerance = 0.45; 
    
    return abs(normalizedAngle - target) < tolerance || 
           abs(normalizedAngle - (TWO_PI)) < tolerance;
  }
}