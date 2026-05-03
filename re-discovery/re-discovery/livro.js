// livro.js
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

    // --- CÁLCULO RESPONSIVO PARA O LIVRO ---
    let percentagemEcra = 0.90;
    livroW = width * percentagemEcra; // Atualiza a variável global
    let proporcao = imgLivro.height / imgLivro.width;
    livroH = livroW * proporcao;      // Atualiza a variável global

    push();
    imageMode(CENTER);
    image(imgLivro, width / 2, height / 2, livroW, livroH);
    pop();

    // ── Seta de próxima página ─────────────────
    drawSeta();
}

function drawSeta() {
    // --- O SEGREDO DO ALINHAMENTO VISUAL ---
    // Ajusta estes dois números para moveres a seta livremente.
    // O valor '0.0' é o centro exato do ecrã. O valor '0.5' é a borda extrema invisível.
    // Experimenta mudar de 0.35 para 0.40 ou 0.25 consoante precisares!
    
    let moverParaDireita = 0.25; // Empurra a seta para o lado direito da página
    let moverParaBaixo = 0.25;   // Empurra a seta para baixo
    
    // Calculamos a posição X e Y a partir do centro
    let sx = (width / 2) + (livroW * moverParaDireita);
    let sy = (height / 2) + (livroH * moverParaBaixo);

    // Tamanho da seta continua a ser responsivo com o livro
    let tamanhoSeta = livroW * 0.015; 

    push();
    fill(0); // Cor da seta (Preta)
    // --- LÓGICA DO HOVER E NÉON ---
    // Recriamos a área de colisão (hitbox) para saber se o rato está por cima
    let hitboxBox = tamanhoSeta * 2;
    let isHover = mouseX > sx - hitboxBox && mouseX < sx + hitboxBox &&
                  mouseY > sy - hitboxBox && mouseY < sy + hitboxBox;

    push();
    fill(0); // A cor de fundo da seta é sempre preta

    // Se o rato estiver por cima, ligamos o efeito Néon!
    if (isHover) {
        cursor(HAND); // Muda o cursor para a mãozinha
        
        let corNeon = color(62, 255, 81);  // O nosso Verde Néon
        drawingContext.shadowBlur = 10;   // O brilho espalhado
        drawingContext.shadowColor = corNeon;
        
        stroke(corNeon);
        strokeWeight(max(4)); 
        tint(57, 255, 20);
    } else {
        noStroke(); // Se o rato não estiver lá, apagamos a linha
    }

    // Desenha o triângulo apontado para a direita
    triangle(
        sx - tamanhoSeta, sy - (tamanhoSeta * 0.8), // Ponto superior esquerdo
        sx - tamanhoSeta, sy + (tamanhoSeta * 0.8), // Ponto inferior esquerdo
        sx + tamanhoSeta, sy                        // Ponta direita (centro vertical)
    );
    pop();
}

// Lógica de clique no livro
function handleLivroClick() {
    
    // ATENÇÃO: Se mudares os números no drawSeta(), TENS DE MUDAR AQUI TAMBÉM!
    let moverParaDireita = 0.25; 
    let moverParaBaixo = 0.25;   
    
    // Repetimos o cálculo para o jogo saber onde está a seta
    let sx = (width / 2) + (livroW * moverParaDireita);
    let sy = (height / 2) + (livroH * moverParaBaixo);
    
    let tamanhoSeta = livroW * 0.015;

    // Área de colisão (hitbox) mais larga para facilitar o clique
    let hitboxBox = tamanhoSeta * 2;

    // Verifica se o clique do rato foi dentro do quadrado mágico
    if (
        mouseX > sx - hitboxBox && mouseX < sx + hitboxBox &&
        mouseY > sy - hitboxBox && mouseY < sy + hitboxBox
    ) {
        goTo("MENU_PERSONAGENS");
    }
}