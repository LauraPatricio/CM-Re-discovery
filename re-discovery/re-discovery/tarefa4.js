let bgImg4;
let circles4 = [];
let score4 = 0;
let lives4 = 3;
const GOAL4 = 10;
let tarefa4State = 'PLAY';

function preloadTarefa4() {
  bgImg4 = loadImage('imagens/tarefa4.png'); // Ajustado para a pasta imagens
}

function setupTarefa4() {
  // Já não precisamos de fazer contas aqui, o menu.js trata disso com o calcularPopUpWide!
}

function drawTarefa4() {
  // ── EFEITO POP-UP ──
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
  image(bgImg4, 0, 0, WIDE_WIDTH, WIDE_HEIGHT);

  if (tarefa4State === 'PLAY') {
    displayHUD4();

    if (frameCount % 60 === 0 && circles4.length < 3) {
      circles4.push(new ClickCircle4());
    }

    for (let i = circles4.length - 1; i >= 0; i--) {
      circles4[i].update();
      circles4[i].show();

      if (circles4[i].isExpired()) {
        if (circles4[i].isClicked) {
          score4++;
        } else {
          lives4--;
          if (lives4 <= 0) tarefa4State = 'GAMEOVER';
        }
        circles4.splice(i, 1);
      }
    }

    // --- CONDIÇÃO DE VITÓRIA ---
    if (score4 >= GOAL4 && tarefa4State === 'PLAY') {
      tarefa4State = 'WIN';

      TarefaConcluida.super = true; // Avisa a nave que ganhámos a Tarefa 4 (Super)
      setTimeout(() => {
        goTo("NAVE");
        resetGame4(); // Limpa as variáveis para se o user quiser repetir
      }, 1500);
    }

  } else if (tarefa4State === 'GAMEOVER') {
    showFailScreenUniform();
  } else if (tarefa4State === 'WIN') {
    showWinScreenUniform();
  }

  pop(); // Fim da escala
}

function displayHUD4() {
  textFont('Impact');
  fill(0, 255, 255);
  textSize(24);
  text(`SUPERPOWER CHARGED: ${score4} / ${GOAL4}`, 60, 60);
  fill(255, 50, 50);
  text(`SHIELDS: ${"❤️".repeat(lives4)}`, 60, 90);
}

function showFailScreenUniform() {
    push();
    textAlign(CENTER, CENTER);
    textFont('Impact');
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = color(255, 0, 0);
    
    fill(255, 0, 0);
    textSize(popW * 0.08);
    text("FAILED - TRY AGAIN", WIDE_WIDTH / 2, WIDE_HEIGHT / 2);
    pop();
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

function mousePressedTarefa4() {
  if (tarefa4State === 'PLAY') {
    // --- MAGIA MATEMÁTICA ---
    // Como a tela está encolhida, convertemos a posição real do rato para a posição virtual do jogo
    let virtualMouseX = (mouseX - widePopX) / (widePopW / WIDE_WIDTH);
    let virtualMouseY = (mouseY - widePopY) / (widePopH / WIDE_HEIGHT);

    for (let i = circles4.length - 1; i >= 0; i--) {
      if (!circles4[i].isClicked && circles4[i].checkMouse(virtualMouseX, virtualMouseY)) {
        circles4[i].isClicked = true;
        break;
      }
    }
  }
}

function keyPressedTarefa4() {
  if ((tarefa4State === 'WIN' || tarefa4State === 'GAMEOVER') && key === ' ') {
    resetGame4();
  }
}

function resetGame4() {
  score4 = 0;
  lives4 = 3;
  circles4 = [];
  tarefa4State = 'PLAY';
}

class ClickCircle4 {
  constructor() {
    this.x = random(100, WIDE_WIDTH - 100);
    this.y = random(120, WIDE_HEIGHT - 100);
    this.innerR = 40;
    this.outerR = 150;
    this.shrinkSpeed = 1.2;
    this.isClicked = false;
  }

  update() {
    this.outerR -= this.shrinkSpeed;
  }

  show() {
    strokeWeight(4);

    if (this.isClicked) {
      fill(0, 255, 100);
      stroke(0, 255, 100);
    } else {
      fill(0, 255, 255);
      stroke(0, 255, 255);
    }
    ellipse(this.x, this.y, this.innerR);

    noFill();
    if (this.isClicked) {
      stroke(0, 255, 100, 150);
    } else {
      stroke(255, 255, 255, 180);
    }
    strokeWeight(2);
    ellipse(this.x, this.y, this.outerR);
  }

  checkMouse(px, py) {
    let d = dist(px, py, this.x, this.y);
    return d < this.innerR / 2;
  }

  isExpired() {
    return this.outerR <= this.innerR;
  }
}