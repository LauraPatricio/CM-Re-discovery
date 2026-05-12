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
    gameState = "MEMORIA"; 

    //mostra video
    if (TarefaConcluida.some && TarefaConcluida.one) {
        isFinalVictory = true;
    }

    if (memoriaVideo) {
        memoriaVideo.stop();
        memoriaVideo.remove();
    }
    
    currentMemoriaKey = tarefaKey;
    let src = MEMORIA_VIDEOS[tarefaKey];
    if (!src) { goTo("NAVE"); return; }

    memoriaVideo = createVideo([src]);
    memoriaVideo.hide();
    memoriaVideo.elt.playsInline = true;
    
    let tarefasMusicais = ['crescendolls', 'super', 'some', 'one'];
    if (!tarefasMusicais.includes(tarefaKey) && sonsExtraMemoria[tarefaKey]) {
        sonsExtraMemoria[tarefaKey].play();
    }

    memoriaVideo.onended(() => {
        // Se isFinalVictory for tru esta função no menu.js não faz nada
        pararTodosSonsTarefas(); 
        
        if (sonsExtraMemoria[currentMemoriaKey]) {
            sonsExtraMemoria[currentMemoriaKey].stop();
        }
        
        goTo("NAVE", "FADE"); 
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
    push();
    imageMode(CENTER);
    image(bgNave, width / 2, height / 2, naveNewW, naveNewH);
    pop();

    noStroke();
    fill(0, 0, 0, 180);
    rect(0, 0, width, height);

    push();
    translate(widePopX, widePopY);
    scale(widePopW / WIDE_WIDTH, widePopH / WIDE_HEIGHT);

    if (memoriaVideo && memoriaVideo.elt.readyState >= 2) {
        imageMode(CORNER);
        image(memoriaVideo, 0, 0, WIDE_WIDTH, WIDE_HEIGHT);
        
        // Efeito Vignette 
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
// NAO É USADA
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
    
    // fill para o texto não desaparecer
    fill(0, 255, 100); 
    textSize(vW * 0.08);
    text("CLICA PARA CONTINUAR", vW / 2, vH / 2);
    
    pop();
}

// Input do user
function handleMemoriaClick() {
    if (memoriaEnded) {
        pararMemoria();
        goTo(memoriaNextState);
    }
}

// para memoria
function pararMemoria() {
    if (memoriaVideo) {
        memoriaVideo.stop();
        memoriaVideo.remove(); 
        memoriaVideo = null;
    }
}