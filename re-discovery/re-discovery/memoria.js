// Mapa de tarefa → ficheiro de vídeo
const MEMORIA_VIDEOS = {
    aerodynamic:  'videos/memoria1.webm',
    harder:       'videos/memoria2.webm',
    crescendolls: 'videos/memoria3.webm',
    super:        'videos/memoria4.webm',
    some:         'videos/memoria5.webm',  
    veridis:      'videos/memoria6.webm',
    voyager:      'videos/memoria7.webm',
    one:          'videos/memoria8.webm',
};

let memoriaVideo      = null;   
let memoriaNextState  = "NAVE"; 
let memoriaEnded      = false; // Variável para sabermos se o vídeo já acabou

// ── Entrada ───────────────────────────────────
function concluirComMemoria(tarefaKey) {
    // Remove vídeo anterior se existir
    pararMemoria();
    memoriaEnded   = false; // Reset da flag

    let src = MEMORIA_VIDEOS[tarefaKey];
    if (!src) {
        goTo("NAVE");
        return;
    }

    memoriaVideo = createVideo([src]);
    memoriaVideo.hide(); 
    
    memoriaVideo.elt.playsInline = true;
    memoriaVideo.elt.muted = false;

    // --- MUDANÇA: Quando o vídeo acaba, apenas ativamos o ecrã de continuar ---
    memoriaVideo.elt.addEventListener('ended', () => {
        memoriaEnded   = true; 
    });

    let playPromise = memoriaVideo.elt.play();
    if (playPromise !== undefined) {
        playPromise.catch(() => {
            // Se o autoplay falhar, deixamos continuar para não encravar o jogo
            memoriaEnded   = true; 
        });
    }

    goTo("MEMORIA");
}

// ── Draw ──────────────────────────────────────
function drawMemoriaScreen() {
    // 1. Desenha o fundo da Nave
    push();
    imageMode(CENTER);
    image(bgNave, width / 2, height / 2, naveNewW, naveNewH);
    pop();

    // 2. Película escura
    noStroke();
    fill(0, 0, 0, 180);
    rect(0, 0, width, height);

    // 3. Cálculo do Pop-up 4:3
    let baseW = 600;
    let baseH = 450;
    
    let memPopW = width * 0.65;
    let memPopH = memPopW * (baseH / baseW);

    if (memPopH > height * 0.65) {
        memPopH = height * 0.65;
        memPopW = memPopH * (baseW / baseH);
    }

    let memPopX = (width - memPopW) / 2;
    let memPopY = (height - memPopH) / 2;

    push();
    translate(memPopX, memPopY);
    scale(memPopW / baseW, memPopH / baseH);

    // Fundo do monitor
    // --- CORREÇÃO AQUI ---
    // Removido o rect() para que o webm fique totalmente sem fundo!
    // Se quiseres testar com os mp4, podes voltar a colocar um fundo aqui se precisares.

    // 4. Desenha o Vídeo
    if (memoriaVideo && memoriaVideo.elt.readyState >= 2) {
        imageMode(CORNER);
        image(memoriaVideo, 0, 0, baseW, baseH);
    }

    // --- NOVO: Se o vídeo acabou, mostra o botão para continuar ---
    if (memoriaEnded) {
        cursor(HAND); // Muda o cursor para indicar que já se pode clicar
        _drawContinueButton(baseW, baseH);
    }

    pop(); 
}

// Ecrã de "Continuar" após o vídeo
function _drawContinueButton(vW, vH) {
    // Escurece o último frame do vídeo ligeiramente
    noStroke();
   noFill();
    rect(0, 0, vW, vH);

    push();
    textAlign(CENTER, CENTER);
    textFont('Impact');

    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = color(0, 255, 100);
    
    // --- CORREÇÃO AQUI ---
    // Descomentei o fill para o texto não desaparecer
    fill(0, 255, 100); 
    textSize(vW * 0.08);
    text("CLICA PARA CONTINUAR", vW / 2, vH / 2);
    
    pop();
}

// ── Input ─────────────────────────────────────
function handleMemoriaClick() {
    // O clique APENAS funciona se o vídeo já tiver terminado
    if (memoriaEnded) {
        pararMemoria();
        goTo(memoriaNextState);
    }
}

// ── Cleanup ───────────────────────────────────
function pararMemoria() {
    if (memoriaVideo) {
        memoriaVideo.stop();
        memoriaVideo.remove(); 
        memoriaVideo = null;
    }
}