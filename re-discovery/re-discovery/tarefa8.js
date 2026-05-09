let bgImg8, vinylCenterImg;
let somDrums, somOneMore; // Faixas sincronizadas
let somStatic;           // Ruído do vinil
let winDelayTimer8 = 0;   // Timer de 5 segundos
let tarefa8State = "INSTRUCTIONS";
let sliderY = 270; // (Era 300) Ajustado para a proporção 800x450
let sliderSpeed = 4;
let sliderDirection = 1;

// --- COORDENADAS AJUSTADAS PARA 800x450 ---
let rectX = 92;      // (Era 104)
let rectW = 114;     // (Era 128)
let greenZoneY = 234; // (Era 260)
let greenZoneH = 72;  // (Era 80)

let vinylX = 537;    // (Era 604)
let vinylY = 225;    // (Era 250)
// --------------------------------------------

let rotationAngle = 0;
let targetRotations = 5; 
let totalRotation = 0;
let lastMouseAngle = 0;
let isSpinning = false;

function preloadTarefa8() {
  bgImg8 = loadImage('imagens/tarefa8.png');
  vinylCenterImg = loadImage('imagens/Daft_Punk_Discovery.png');
  
  // Carregamento dos sons conforme as referências
  somDrums = loadSound('sons/drumsOMT.mp3');
  somOneMore = loadSound('sons/one more time.mp3');
  somStatic = loadSound('sons/vinyl static.mp3');
}

function setupTarefa8() {

}

function drawTarefa8() {
  // ── EFEITO POP-UP ──
  push();
  imageMode(CENTER);
  image(bgNave, width / 2, height / 2, naveNewW, naveNewH);
  pop();
  
  noStroke();
  fill(0, 0, 0, 180);
  rect(0, 0, width, height); 

  // ── ESCALA PARA O POP-UP WIDESCREEN ──
  push();
  translate(widePopX, widePopY);
  scale(widePopW / WIDE_WIDTH, widePopH / WIDE_HEIGHT);

  imageMode(CORNER);
  image(bgImg8, 0, 0, WIDE_WIDTH, WIDE_HEIGHT);

  // ── LÓGICA DE ESTADOS (INSTRUÇÕES VS JOGO) ──
  if (tarefa8State === "INSTRUCTIONS") {
    drawTaskInstructions(
        "One More Time", 
        "RECOVER THE IDENTITY. First, stop the moving slider inside the green zone. Then, click and drag the vinyl record in circles to bring the music back to life."
    );
  } 
  else {
    // --- TUDO O QUE ESTÁ AQUI DENTRO SÓ ACONTECE DEPOIS DO START ---
    drawVinylLabel();

    if (tarefa8phase === 1) {
      handleSliderPhase();
    } 
    else if (tarefa8phase === 2) {
      handleVinylPhase();
      
      if (somDrums.isLoaded()) somDrums.setVolume(1.0);

      if (isSpinning) {
        let progressFactor = totalRotation / (TWO_PI * targetRotations);
        somStatic.setVolume(map(progressFactor, 0, 1, 0.5, 0));
        somOneMore.setVolume(map(progressFactor, 0, 1, 0, 1.0));
      } else {
        somStatic.setVolume(0);
        somOneMore.setVolume(0);
      }
    } 
    else if (tarefa8phase === 3) {
      somStatic.setVolume(0);
      somDrums.setVolume(1.0);
      somOneMore.setVolume(1.0);

      winDelayTimer8++;
      if (winDelayTimer8 > 300) { 
         showFinalWin();
      }
    }
  }
  
  pop(); 
}

function drawVinylLabel() {
  push();
  translate(vinylX, vinylY);
  rotate(rotationAngle);
  imageMode(CENTER);
  // Tamanho redimensionado proporcionalmente de 155 para 138
  image(vinylCenterImg, 0, 0, 138, 138); 
  pop();
}

function handleSliderPhase() {
  fill(0, 255, 100, 180);
  noStroke();
  rect(rectX, greenZoneY, rectW, greenZoneH); 

  sliderY += sliderSpeed * sliderDirection;
  
  // Limites do slider redimensionados proporcionalmente de 430/140 para 387/126
  if (sliderY > 387 || sliderY < 126) sliderDirection *= -1;

  stroke(0, 255, 255);
  strokeWeight(5);
  line(rectX, sliderY, rectX + rectW, sliderY);
  
  drawingContext.shadowBlur = 15;
  drawingContext.shadowColor = color(0, 255, 255);
  line(rectX, sliderY, rectX + rectW, sliderY);
  drawingContext.shadowBlur = 0; 
}

function handleVinylPhase() {
  // Conversão do rato virtual para o vinil detetar a rotação corretamente
  let virtualMouseX = (mouseX - widePopX) / (widePopW / WIDE_WIDTH);
  let virtualMouseY = (mouseY - widePopY) / (widePopH / WIDE_HEIGHT);

  if (mouseIsPressed && dist(virtualMouseX, virtualMouseY, vinylX, vinylY) < 160) {
    let currentAngle = atan2(virtualMouseY - vinylY, virtualMouseX - vinylX);
    
    if (isSpinning) {
      let delta = currentAngle - lastMouseAngle;
      if (delta > PI) delta -= TWO_PI;
      if (delta < -PI) delta += TWO_PI;
      rotationAngle += delta;
      totalRotation += abs(delta);
    }
    lastMouseAngle = currentAngle;
    isSpinning = true;
  } else {
    isSpinning = false;
  }

  // --- PROGRESS BAR: SMALLER WIDTH E CENTRALIZADA NO NOSSO WIDE_WIDTH ---
  let barWidth = 150; 
  let progress = map(totalRotation, 0, TWO_PI * targetRotations, 0, barWidth);
  
  noStroke();
  fill(40);
  rect(WIDE_WIDTH/2 - barWidth/2, 400, barWidth, 8, 4); 
  
  fill(0, 255, 100);
  rect(WIDE_WIDTH/2 - barWidth/2, 400, constrain(progress, 0, barWidth), 8, 4);

 if (totalRotation >= TWO_PI * targetRotations && tarefa8phase === 2) {
    tarefa8phase = 3;
    TarefaConcluida.one = true; 
    setTimeout(() => {
        concluirComMemoria("one"); 
        resetTarefa8(false); // Mantém o som
    }, 2000); 
  }
}

function mousePressedTarefa8() {
  if (tarefa8State === "INSTRUCTIONS") {
    if (checkStartClick()) {
      tarefa8State = "PLAY";
      tarefa8phase = 1;

      // INICIAR ÁUDIO APÓS INTERAÇÃO HUMANA
      if (somStatic && somStatic.isLoaded() && !somStatic.isPlaying()) {
          somStatic.loop(); 
          somStatic.setVolume(0);
          somDrums.loop(); 
          somDrums.setVolume(0);
          somOneMore.loop(); 
          somOneMore.setVolume(0);
      }
    }
    return;
  }

  if (tarefa8phase === 1) {
    if (sliderY > greenZoneY && sliderY < greenZoneY + greenZoneH) {
      tarefa8phase = 2;
    }
  }
}

function showFinalWin() {
  fill(0, 0, 0, 220);
  rect(0, 0, WIDE_WIDTH, WIDE_HEIGHT);
  
  push();
  textAlign(CENTER, CENTER);
  textFont('Impact'); // Fonte uniforme
  
  // Efeito Neon Verde consistente com as outras tarefas[cite: 1, 8]
  drawingContext.shadowBlur = 25;
  drawingContext.shadowColor = color(0, 255, 100);
  
  fill(0, 255, 100);
  // Tamanho proporcional ao pop-up (usando a lógica da Tarefa 1: widePopW * 0.08)[cite: 1]
  textSize(WIDE_WIDTH * 0.08); 
  text("IDENTITY RECOVERED", WIDE_WIDTH / 2, WIDE_HEIGHT / 2 - 20);
  
  // Reset do brilho para o subtítulo
  drawingContext.shadowBlur = 0;
  fill(255);
  textSize(WIDE_WIDTH * 0.03); 
  text("ONE MORE TIME... DISCOVERY COMPLETE.", WIDE_WIDTH / 2, WIDE_HEIGHT / 2 + 60);
  pop();
}

function resetTarefa8(pararSom = true) {
    tarefa8State = "INSTRUCTIONS";
    tarefa8phase = 1;
    sliderY = 270;
    rotationAngle = 0;
    totalRotation = 0;
    isSpinning = false;
    winDelayTimer8 = 0;
    if (pararSom) stopTarefa8Audio();
}

// Chamar isto no resetCurrentTask() do menu.js se gameState === "TAREFA8"[cite: 19]
// Substitui a função stopTarefa8Audio por esta completa
// Atualiza a função no tarefa8.js para parar mesmo os sons
function stopTarefa8Audio() {
    isSpinning = false;
    if (somDrums && typeof somDrums.stop === 'function') somDrums.stop();
    if (somOneMore && typeof somOneMore.stop === 'function') somOneMore.stop();
    if (somStatic && typeof somStatic.stop === 'function') somStatic.stop();
}