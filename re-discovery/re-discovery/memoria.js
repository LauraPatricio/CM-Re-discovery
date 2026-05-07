// Mapa de tarefa → ficheiro de vídeo
// Adiciona os outros vídeos quando os tiveres
const MEMORIA_VIDEOS = {
    aerodynamic:  'videos/memoria1.mp4',
    harder:       'videos/memoria2.mp4',
    crescendolls: 'videos/memoria3.mp4',
    super:        'videos/memoria4.mp4',
    some:         'videos/memoria5.mp4',  
    veridis:      'videos/memoria6.mp4',
    voyager:      'videos/memoria7.mp4',
    one:          'videos/memoria8.mp4',
};

let _memoriaVideo      = null;   // Elemento do p5.js
let _memoriaTaskKey    = "";     
let _memoriaNextState  = "NAVE"; 
let _memoriaOverlay    = false;  
let _memoriaEnded      = false;  

// ── Entrada ───────────────────────────────────
function concluirComMemoria(tarefaKey) {
    _memoriaTaskKey   = tarefaKey;
    _memoriaOverlay   = false;
    _memoriaEnded     = false;

    // Remove vídeo anterior se existir
    _pararMemoria();

    let src = MEMORIA_VIDEOS[tarefaKey];
    if (!src) {
        // Sem vídeo para esta tarefa — vai direto à nave
        goTo("NAVE");
        return;
    }

    // --- CORREÇÃO: Usa o createVideo do p5.js para o image() aceitar ---
    _memoriaVideo = createVideo([src]);
    _memoriaVideo.hide(); // Oculta do HTML, desenhamos direto no canvas
    
    // Acedemos às propriedades originais do HTML através de .elt
    _memoriaVideo.elt.playsInline = true;
    _memoriaVideo.elt.muted = false;

    _memoriaVideo.elt.addEventListener('ended', () => {
        _memoriaEnded  = true;
        _memoriaOverlay = true;
    });

    let playPromise = _memoriaVideo.elt.play();
    if (playPromise !== undefined) {
        playPromise.catch(() => {
            // Autoplay bloqueado pelo navegador — mostra overlay de clique
            _memoriaOverlay = true;
        });
    }

    goTo("MEMORIA");
}

// ── Draw ──────────────────────────────────────
// ── Draw (Versão com Overlay Integrado no Pop-up) ──────────────────
function drawMemoriaScreen() {
    // 1. Desenha o fundo da Nave
    push();
    imageMode(CENTER);
    image(bgNave, width / 2, height / 2, naveNewW, naveNewH);
    pop();

    // 2. Película escura sobre a nave
    noStroke();
    fill(0, 0, 0, 180);
    rect(0, 0, width, height);

    // --- 3. CÁLCULO DO POP-UP 4:3 ---
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

    // 4. ── APLICAR ESCALA DO POP-UP ──
    push();
    translate(memPopX, memPopY);
    scale(memPopW / baseW, memPopH / baseH);

    // Fundo do monitor
    fill(0);
    rect(0, 0, baseW, baseH);

    // 5. Desenha o Vídeo
    if (_memoriaVideo && _memoriaVideo.elt.readyState >= 2) {
        imageMode(CORNER);
        image(_memoriaVideo, 0, 0, baseW, baseH);
    }

    // 6. Indicador de Skip (enquanto o vídeo corre)
    if (!_memoriaOverlay && _memoriaVideo && !_memoriaVideo.elt.paused && !_memoriaVideo.elt.ended) {
        _drawSkipHintInternal(baseW);
    }

    // --- NOVO: O OVERLAY AGORA É DESENHADO DENTRO DO POP-UP ---
    if (_memoriaOverlay) {
        _drawMemoriaOverlay(baseW, baseH);
    }

    pop(); // Fecha o bloco de escala
}

// Atualizada para ser relativa ao Pop-up
function _drawMemoriaOverlay(vW, vH) {
    // Fundo semi-transparente (limitado aos 600x450 do pop-up)
    noStroke();
    fill(0, 0, 0, 200);
    rect(0, 0, vW, vH);

    push();
    textAlign(CENTER, CENTER);
    textFont('Impact');

    // Efeito Neon Verde (Consistente com as tarefas)
    drawingContext.shadowBlur  = 20;
    drawingContext.shadowColor = 'rgba(0, 255, 180, 0.8)';

    fill(0, 255, 180);
    textSize(vW * 0.08); // Tamanho proporcional ao pop-up
    text("MEMÓRIA RECUPERADA", vW / 2, vH * 0.42);

    drawingContext.shadowBlur = 0;

    fill(200);
    textSize(vW * 0.035); 
    text("Clica para continuar", vW / 2, vH * 0.55);

    // Ícone de clique animado proporcional
    let pulse = sin(frameCount * 0.08) * 0.15 + 0.85;
    fill(0, 255, 180, 200 * pulse);
    noStroke();
    ellipse(vW / 2, vH * 0.70, vW * 0.04 * pulse);
    pop();
}

function _drawSkipHintInternal(vWidth) {
    push();
    textAlign(RIGHT, TOP);
    textFont('Impact');
    textSize(18); 
    fill(255, 255, 255, 120);
    noStroke();
    // Usa vWidth (600) em vez de WIDE_WIDTH (800)
    text("SKIP  ›", vWidth - 20, 20);
    pop();
}
// ── Input ─────────────────────────────────────
function handleMemoriaClick() {
    if (_memoriaOverlay || _memoriaEnded) {
        // Vídeo terminou ou está em overlay → sai
        _pararMemoria();
        goTo(_memoriaNextState);
        return;
    }

    // Skip: qualquer clique durante o vídeo
    if (_memoriaVideo && !_memoriaVideo.elt.ended) {
        _memoriaVideo.pause();
        _memoriaEnded  = true;
        _memoriaOverlay = true;
    }
}

// ── Cleanup ───────────────────────────────────
function _pararMemoria() {
    if (_memoriaVideo) {
        _memoriaVideo.stop();
        _memoriaVideo.remove(); // Limpa totalmente o elemento HTML subjacente
        _memoriaVideo = null;
    }
}