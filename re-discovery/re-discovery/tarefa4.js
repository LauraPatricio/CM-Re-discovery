let bgImg4;
let circles4 = [];
let score4 = 0;
let lives4 = 3; 
const GOAL4 = 10;
let tarefa4State = "INSTRUCTIONS";
let som4; // Variável para a música

function preloadTarefa4() {
  bgImg4 = loadImage('imagens/tarefa4.png');
  som4 = loadSound('sons/superheroes.mp3'); // Carrega a música da tarefa[cite: 15]
}

function setupTarefa4() {}

function drawTarefa4() {
  image(bgNave, 0, 0, width, height); 
  noStroke();
  fill(0, 0, 0, 180);
  rect(0, 0, width, height); 

  push();
  translate(widePopX, widePopY);
  scale(widePopW / WIDE_WIDTH, widePopH / WIDE_HEIGHT);

  imageMode(CORNER);
  image(bgImg4, 0, 0, WIDE_WIDTH, WIDE_HEIGHT);

  // ── LÓGICA DE ESTADOS (INSTRUÇÕES VS JOGO) ──
  if (tarefa4State === "INSTRUCTIONS") {
    // Mostra o ecrã de instruções uniformizado
    drawTaskInstructions(
        "Superheroes", 
        "CHARGE THE POWER. Click the energy spheres before they disappear. Each click charges your superpower, each miss weakens your shields."
    );
  } 
  else {
    // --- TUDO O QUE ESTÁ AQUI DENTRO SÓ ACONTECE DEPOIS DE CLICAR NO START ---
    if (tarefa4State === 'PLAY') {
      // ── GESTÃO DA MÚSICA ──
      // A música agora só arranca porque o estado passou para PLAY
      if (som4 && som4.isLoaded() && !som4.isPlaying()) {
        som4.loop();
      }

      displayHUD4();

      // Spawna círculos a cada 60 frames (aprox. 1 segundo, no ritmo da batida)
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
            if (lives4 <= 0) {
              tarefa4State = 'GAMEOVER';
              if (som4.isPlaying()) som4.stop(); // Para a música na derrota
            }
          }
          circles4.splice(i, 1);
        }
      }

      if (score4 >= GOAL4) {
        tarefa4State = 'WIN';
        if (som4.isPlaying()) som4.stop(); // Para a música na vitória
        TarefaConcluida.super = true; 
        setTimeout(() => {
            goTo("NAVE");
            resetGame4(); 
        }, 1500);
      }
      
    } else if (tarefa4State === 'GAMEOVER') {
      showFailScreenUniform();
    } else if (tarefa4State === 'WIN') {
      showWinScreenUniform();
    }
  }
  
  pop(); 
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
  // 1. Verificamos se estamos no ecrã de instruções
  if (tarefa4State === "INSTRUCTIONS") {
    if (checkStartClick()) {
      tarefa4State = "PLAY"; 
      // Não precisamos de pôr a música a tocar aqui, porque o drawTarefa4()
      // vai ver que o estado é "PLAY" e toca a música automaticamente.
    }
    return; // Pára aqui para não clicar nos círculos acidentalmente!
  }

  // 2. A lógica antiga (Clicar nos círculos) só funciona se o estado for PLAY
  if (tarefa4State === 'PLAY') {
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
  // Garante que a música para e faz reset[cite: 16]
  if (som4 && som4.isLoaded()) {
    som4.stop();
  }
}

class ClickCircle4 {
  constructor() {
    this.x = random(100, WIDE_WIDTH - 100);
    this.y = random(120, WIDE_HEIGHT - 100);
    this.innerR = 40;
    this.outerR = 150; 
    // Ajustado para fechar em aproximadamente 60 frames (1 segundo), batendo com o ritmo
    this.shrinkSpeed = (this.outerR - this.innerR) / 60; 
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