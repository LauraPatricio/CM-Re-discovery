// Mapa de tarefa → ficheiro de vídeo
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
    // Mudar o estado IMEDIATAMENTE para parar o draw da tarefa anterior
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

    memoriaVideo = createVideo([src]);
    memoriaVideo.hide();
    memoriaVideo.elt.playsInline = true;
    
    // Tocar som extra apenas se a tarefa NÃO for uma das musicais
    let tarefasMusicais = ['crescendolls', 'super', 'some', 'one'];
    if (!tarefasMusicais.includes(tarefaKey) && sonsExtraMemoria[tarefaKey]) {
        sonsExtraMemoria[tarefaKey].play();
    }

    memoriaVideo.onended(() => {
        pararTodosSonsTarefas(); 
        if (sonsExtraMemoria[currentMemoriaKey]) sonsExtraMemoria[currentMemoriaKey].stop();
        goTo("NAVE", "FADE");
        memoriaVideo.remove();
        memoriaVideo = null;
    });

    memoriaVideo.play();
}

function drawMemoriaScreen() {
    // 1. Fundo da Nave e Película (igual às tarefas)
    push();
    imageMode(CENTER);
    image(bgNave, width / 2, height / 2, naveNewW, naveNewH);
    pop();

    noStroke();
    fill(0, 0, 0, 180);
    rect(0, 0, width, height);

    // 2. Área do vídeo com escala widescreen
    push();
    translate(widePopX, widePopY);
    scale(widePopW / WIDE_WIDTH, widePopH / WIDE_HEIGHT);

    if (memoriaVideo && memoriaVideo.elt.readyState >= 2) {
        imageMode(CORNER);
        image(memoriaVideo, 0, 0, WIDE_WIDTH, WIDE_HEIGHT);
        
        // Efeito Vignette (Fade out nas bordas)
        let grad = drawingContext.createRadialGradient(WIDE_WIDTH/2, WIDE_HEIGHT/2, WIDE_HEIGHT * 0.2, WIDE_WIDTH/2, WIDE_HEIGHT/2, WIDE_WIDTH * 0.7);
        grad.addColorStop(0, 'rgba(0,0,0,0)');
        grad.addColorStop(1, 'rgba(0,0,0,0.95)');
        
        drawingContext.fillStyle = grad;
        noStroke();
        rect(0, 0, WIDE_WIDTH, WIDE_HEIGHT);
    }
    pop();
}