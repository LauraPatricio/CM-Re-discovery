let bgImg5; 
let rings = [];
let tracks = []; // Array para as faixas de música
let currentRing = 0;
let tarefa5State = "INSTRUCTIONS";
const GOAL5 = 3;
let winDelayTimer = 0; // Timer para o atraso de 5 segundos

// Ajustadas ligeiramente para o nosso padrão 800x450 (eram para 900x500)
let bX5 = 80;
let bW5 = 186;
let bH5 = 54;
let bY_positions5 = [88, 198, 306];

function preloadTarefa5() {
  bgImg5 = loadImage('imagens/tarefa5.png');
  // Carrega as 3 faixas sincronizadas
  tracks[0] = loadSound('sons/bass.mp3'); 
  tracks[1] = loadSound('sons/drums.mp3');
  tracks[2] = loadSound('sons/melody.mp3');
}

function setupTarefa5() {
  rings.push(new SyncRing(377, 117, color(147, 32, 146)));
  rings.push(new SyncRing(377, 225, color(31, 64, 153)));
  rings.push(new SyncRing(377, 334, color(0, 169, 127)));

  // Inicia todas as faixas juntas em loop, mas com volume 0
  for (let t of tracks) {
    t.setVolume(0);
    t.loop();
  }
}

function drawTarefa5() {
  push();
  imageMode(CENTER);
  image(bgNave, width / 2, height / 2, naveNewW, naveNewH);
  pop();

  noStroke();
  fill(0, 0, 0, 180);
  rect(0, 0, width, height); // Película escura

  // ── ESCALA PARA O POP-UP WIDESCREEN ──
  push();
  translate(widePopX, widePopY);
  scale(widePopW / WIDE_WIDTH, widePopH / WIDE_HEIGHT);

  imageMode(CORNER);
  image(bgImg5, 0, 0, WIDE_WIDTH, WIDE_HEIGHT);

  // ── LÓGICA DE ESTADOS (INSTRUÇÕES VS JOGO) ──
  if (tarefa5State === "INSTRUCTIONS") {
    // Mostra o ecrã de instruções uniformizado
    drawTaskInstructions(
        "Something About Us", 
        "RESONATE THE FREQUENCY. Click the instrument buttons when the rotating square aligns perfectly with the target. Sync all three to complete the melody."
    );
  } 
  else {
    // --- TUDO O QUE ESTÁ AQUI DENTRO SÓ ACONTECE DEPOIS DE CLICAR NO START ---
    if (tarefa5State === 'PLAY') {
      displayHUD5();
      drawDebugButtons5();

      for (let i = 0; i < rings.length; i++) {
        rings[i].update();
        rings[i].show();
        
        // Se o anel estiver sincronizado, aumenta o volume daquela faixa
        if (rings[i].isSynced) {
          tracks[i].setVolume(1.0);
        }
      }

      if (currentRing >= GOAL5) {
        // Inicia a contagem de 5 segundos com a música completa
        winDelayTimer++;
        if (winDelayTimer > 300) { // 300 frames aprox. 5 segundos a 60fps
          tarefa5State = 'WIN';
          TarefaConcluida.some = true;
          setTimeout(() => {
            stopAllTracks();
            goTo("NAVE");
            resetGame5();
          }, 1500);
        }
      }
    } else if (tarefa5State === 'WIN') {
      showWinScreenUniform();
    }
  }
  pop();
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

function showWinScreenUniform() {
    fill(0, 0, 0, 200);
    rect(0, 0, WIDE_WIDTH, WIDE_HEIGHT);
    
    push();
    textAlign(CENTER, CENTER);
    textFont('Impact');
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = color(0, 255, 100);
    
    fill(0, 255, 100);
    textSize(popW * 0.08); // Tamanho consistente com a Tarefa 1
    text("IDENTITY RECOVERED", WIDE_WIDTH / 2, WIDE_HEIGHT / 2);
    
    noAlpha(); // Reset shadow
    textSize(popW * 0.03);
    fill(255);
    text("MEMORY SYNCED...", WIDE_WIDTH / 2, WIDE_HEIGHT / 2 + 60);
    pop();
}

function mousePressedTarefa5() {
  // 1. Verificamos se estamos no ecrã de instruções
  if (tarefa5State === "INSTRUCTIONS") {
    if (checkStartClick()) {
      tarefa5State = "PLAY"; 
      // As músicas já estão a tocar em "mute" (volume 0) graças ao setupTarefa5(), 
      // portanto não é preciso iniciar as tracks aqui!
    }
    return; // Pára aqui para não clicar nos instrumentos acidentalmente
  }

  // 2. Lógica do jogo (Clicar nos botões para sincronizar os anéis)
  if (tarefa5State === 'PLAY') {
    let virtualMouseX = (mouseX - widePopX) / (widePopW / WIDE_WIDTH);
    let virtualMouseY = (mouseY - widePopY) / (widePopH / WIDE_HEIGHT);

    if (currentRing < GOAL5) {
      if (virtualMouseX > bX5 && virtualMouseX < bX5 + bW5 &&
          virtualMouseY > bY_positions5[currentRing] && virtualMouseY < bY_positions5[currentRing] + bH5) {

        if (rings[currentRing].checkSync()) {
          rings[currentRing].isSynced = true;
          currentRing++;
        }
      }
    }
  }
}

function keyPressedTarefa5() {
  // Agora o reset só funciona pelo rato ou sai sozinho após ganhar. 
  // Esta função pode ficar vazia, ou servir para atalhos de debug.
}

function stopAllTracks() {
  for (let t of tracks) {
    if (t.isPlaying()) t.stop();
  }
}

function resetGame5() {
  currentRing = 0;
  winDelayTimer = 0;
  stopAllTracks();
  for (let ring of rings) {
    ring.isSynced = false;
    ring.angle = random(TWO_PI);
  }
  // Reinicia a sincronia de áudio para um novo jogo
  for (let t of tracks) {
    t.setVolume(0);
    t.loop();
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