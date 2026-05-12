let imgLivro;

// Variáveis globais para guardar o tamanho responsivo do livro
let livroW = 0;
let livroH = 0;

function preloadLivro() {
    imgLivro = loadImage('imagens/livro.png');
}

function drawLivroScreen() {
    background(0);
    // Usa o tamanho atualizado do fundo do menu
    image(bgMenu, 0, 0, menuNewW, menuNewH);

    noStroke();
    fill(0, 0, 0, 150);
    rect(0, 0, width, height);

    // responsivo
    let percentagemEcra = 0.90;
    livroW = width * percentagemEcra; 
    let proporcao = imgLivro.height / imgLivro.width;
    livroH = livroW * proporcao;      

    push();
    imageMode(CENTER);
    image(imgLivro, width / 2, height / 2, livroW, livroH);
    pop();

    
    drawSeta();
}

function drawSeta() {
    
    let moverParaDireita = 0.25; 
    let moverParaBaixo = 0.25;   
    let sx = (width / 2) + (livroW * moverParaDireita);
    let sy = (height / 2) + (livroH * moverParaBaixo);

    let tamanhoSeta = livroW * 0.015; 

    push();
    fill(0); 
    
    let hitboxBox = tamanhoSeta * 2;
    let isHover = mouseX > sx - hitboxBox && mouseX < sx + hitboxBox &&
                  mouseY > sy - hitboxBox && mouseY < sy + hitboxBox;

    push();
    fill(0); 

    if (isHover) {
        cursor(HAND); 
        let corNeon = color(62, 255, 81);  
        drawingContext.shadowBlur = 10;   
        drawingContext.shadowColor = corNeon;
        
        stroke(corNeon);
        strokeWeight(max(4)); 
        tint(57, 255, 20);
    } else {
        noStroke(); 
    }

    
    triangle(
        sx - tamanhoSeta, sy - (tamanhoSeta * 0.8), // Ponto superior esquerdo
        sx - tamanhoSeta, sy + (tamanhoSeta * 0.8), // Ponto inferior esquerdo
        sx + tamanhoSeta, sy                        // Ponta direita 
    );
    pop();
}

// Lógica de click no livro
function handleLivroClick() {
    
    let moverParaDireita = 0.25; 
    let moverParaBaixo = 0.25;   
    
    let sx = (width / 2) + (livroW * moverParaDireita);
    let sy = (height / 2) + (livroH * moverParaBaixo);
    
    let tamanhoSeta = livroW * 0.015;

    let hitboxBox = tamanhoSeta * 2;

    if (
        mouseX > sx - hitboxBox && mouseX < sx + hitboxBox &&
        mouseY > sy - hitboxBox && mouseY < sy + hitboxBox
    ) {
        goTo("MENU_PERSONAGENS");
    }
}