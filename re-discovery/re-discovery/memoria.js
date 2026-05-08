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
    // Mudar o estado IMEDIATAMENTE para parar o desenho da tarefa anterior
    // e permitir que o drawMemoriaScreen comece a desenhar o fundo da nave por trás
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

    // --- LÓGICA DE FIM DE VÍDEO COM FADE SUAVE ---
    memoriaVideo.onended(() => {
        // 1. Para todos os sons (música de fundo ou sons extra)
        pararTodosSonsTarefas(); 
        if (sonsExtraMemoria[currentMemoriaKey]) {
            sonsExtraMemoria[currentMemoriaKey].stop();
        }
        
        // 2. Inicia o FADE para a Nave
        // Como o drawMemoriaScreen desenha a nave e a película por baixo do vídeo,
        // o utilizador verá o vídeo a escurecer para a nave em vez de ver preto.
        goTo("NAVE", "FADE"); 
        
        // 3. O SEGREDO: Manter o objeto do vídeo vivo durante o tempo do fade
        // Esperamos 800ms antes de remover o vídeo do ecrã.
        setTimeout(() => {
            if (memoriaVideo) {
                memoriaVideo.remove();
                memoriaVideo = null;
            }
        }, 800);
    });

    memoriaVideo.play();
}

// Substitui a função drawMemoriaScreen por esta:
function drawMemoriaScreen() {
    // 1. Desenha SEMPRE o fundo da Nave primeiro (como se fosse o papel de parede)
    push();
    imageMode(CENTER);
    image(bgNave, width / 2, height / 2, naveNewW, naveNewH);
    pop();

    // 2. Película escura padrão das tarefas (180 de opacidade)
    noStroke();
    fill(0, 0, 0, 180);
    rect(0, 0, width, height);

    // 3. Área do vídeo
    push();
    translate(widePopX, widePopY);
    scale(widePopW / WIDE_WIDTH, widePopH / WIDE_HEIGHT);

    if (memoriaVideo && memoriaVideo.elt.readyState >= 2) {
        imageMode(CORNER);
        image(memoriaVideo, 0, 0, WIDE_WIDTH, WIDE_HEIGHT);
        
        // Vignette (Fade out nas bordas do vídeo)
        let grad = drawingContext.createRadialGradient(WIDE_WIDTH/2, WIDE_HEIGHT/2, WIDE_HEIGHT * 0.2, WIDE_WIDTH/2, WIDE_HEIGHT/2, WIDE_WIDTH * 0.7);
        grad.addColorStop(0, 'rgba(0,0,0,0)');
        grad.addColorStop(1, 'rgba(0,0,0,0.95)');
        
        drawingContext.fillStyle = grad;
        noStroke();
        rect(0, 0, WIDE_WIDTH, WIDE_HEIGHT);
    }
    pop();
}