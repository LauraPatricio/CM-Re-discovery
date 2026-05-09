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

let memoriaVideo = null;
let sonsExtraMemoria = {};
let currentMemoriaKey = "";

function preloadMemoria() {
    // Carrega sons para tarefas que não têm música própria em loop
    sonsExtraMemoria['aerodynamic'] = loadSound('sons/aerodynamic.mp3');
    sonsExtraMemoria['harder'] = loadSound('sons/harder better faster stronger.mp3');
    sonsExtraMemoria['veridis'] = loadSound('sons/veridisquo.mp3');
    sonsExtraMemoria['voyager'] = loadSound('sons/voyager.mp3');
}

function concluirComMemoria(tarefaKey) {
    // Mudar o estado IMEDIATAMENTE para parar o desenho da tarefa anterior
    gameState = "MEMORIA"; 

    if (memoriaVideo) {
        memoriaVideo.stop();
        memoriaVideo.remove();
    }
    
    currentMemoriaKey = tarefaKey;
    let src = MEMORIA_VIDEOS[tarefaKey];
    
    if (!src) {
        goTo("NAVE");
        return;
    }

    // Criar o novo vídeo
    memoriaVideo = createVideo([src]);
    memoriaVideo.hide();
    memoriaVideo.elt.playsInline = true;
    
    // Tocar som extra apenas se a tarefa NÃO for uma das musicais nativas (3, 4, 5, 8)
    let tarefasMusicais = ['crescendolls', 'super', 'some', 'one'];
    if (!tarefasMusicais.includes(tarefaKey) && sonsExtraMemoria[tarefaKey]) {
        sonsExtraMemoria[tarefaKey].play();
    }

    // --- FIM DE VÍDEO AUTOMÁTICO ---
    memoriaVideo.onended(() => {
        pararTodosSonsTarefas(); 
        if (sonsExtraMemoria[currentMemoriaKey]) {
            sonsExtraMemoria[currentMemoriaKey].stop();
        }
        
        // Inicia o FADE para a Nave
        goTo("NAVE", "FADE"); 
        
        // Mantemos o vídeo vivo por 800ms para o fade o cobrir suavemente
        setTimeout(() => {
            if (memoriaVideo) {
                memoriaVideo.remove();
                memoriaVideo = null;
            }
        }, 800);
    });

    memoriaVideo.play();
}

function drawMemoriaScreen() {
    // 1. Desenha o fundo da Nave por baixo
    push();
    imageMode(CENTER);
    image(bgNave, width / 2, height / 2, naveNewW, naveNewH);
    pop();

    // 2. Película escura
    noStroke();
    fill(0, 0, 0, 180);
    rect(0, 0, width, height);

    // 3. Área do vídeo com a escala unificada do menu.js
    push();
    translate(widePopX, widePopY);
    scale(widePopW / WIDE_WIDTH, widePopH / WIDE_HEIGHT);

    if (memoriaVideo && memoriaVideo.elt.readyState >= 2) {
        imageMode(CORNER);
        image(memoriaVideo, 0, 0, WIDE_WIDTH, WIDE_HEIGHT);
        
        // Efeito Vignette (Sombra nas bordas)
        let grad = drawingContext.createRadialGradient(WIDE_WIDTH/2, WIDE_HEIGHT/2, WIDE_HEIGHT * 0.2, WIDE_WIDTH/2, WIDE_HEIGHT/2, WIDE_WIDTH * 0.7);
        grad.addColorStop(0, 'rgba(0,0,0,0)');
        grad.addColorStop(1, 'rgba(0,0,0,0.95)');
        
        drawingContext.fillStyle = grad;
        noStroke();
        noFill();
        rect(0, 0, WIDE_WIDTH, WIDE_HEIGHT);
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