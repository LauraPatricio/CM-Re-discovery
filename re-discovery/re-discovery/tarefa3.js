let bgImg3;
let player3;
let obstacles3 = [];
let tarefa3State = "INSTRUCTIONS";
let som3; // Variável para a música

// Timestamps em segundos onde o "Hey" acontece na música
// Ajustados conforme o ritmo de 'Crescendolls'
let heyTimes = [0.8, 2.3, 3.8, 5.3, 6.8, 8.3, 9.8, 11.3, 12.8, 14.3];
let nextHeyIndex = 0;

let groundLevel3 = 342;
let gameSpeed3 = 5;
let score3 = 0;
const GOAL3 = 10;

function preloadTarefa3() {
    bgImg3 = loadImage('imagens/tarefa3.png');
    // Certifique-se de que o caminho e nome do arquivo de áudio estejam corretos
    som3 = loadSound('sons/crescendolls.mp3');
}

function setupTarefa3() {
    player3 = new Player3();
    nextHeyIndex = 0;
}

function drawTarefa3() {
    // ── EFEITO POP-UP ──
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

    imageMode(CORNER);
    image(bgImg3, 0, 0, WIDE_WIDTH, WIDE_HEIGHT);

    // ── LÓGICA DE ESTADOS ──
    if (tarefa3State === "INSTRUCTIONS") {
        drawTaskInstructions(
            "Crescendolls", 
            "STAY IN THE RHYTHM. Jump over the obstacles, timing is everything, don't lose the beat!"
        );
    } 
    else if (tarefa3State === 'PLAY') {
        if (som3 && som3.isLoaded() && !som3.isPlaying()) {
            som3.loop();
        }
        
        player3.update();
        player3.show();
        displayScore3();

        let currentTime = som3.currentTime();

        if (nextHeyIndex < heyTimes.length && currentTime >= heyTimes[nextHeyIndex]) {
            obstacles3.push(new Obstacle3(true)); 
            nextHeyIndex++;
        }

        for (let i = obstacles3.length - 1; i >= 0; i--) {
            let obs = obstacles3[i]; // Referência direta para segurança
            
            obs.move();
            obs.show();

            // 1. Verificar Colisão (Utilizando o método hits do PLAYER para maior estabilidade)
            if (player3.hits(obs)) {
                resetGame3(true); 
                return; 
            }

            // 2. Verificar Passagem
            if (!obs.passed && obs.x + obs.w < player3.x) {
                score3++;
                obs.passed = true;

                if (score3 >= GOAL3) {
                    TarefaConcluida.crescendolls = true;
                    concluirComMemoria("crescendolls");
                    resetGame3(false); 
                    return;
                }
            }

            if (obs.x < -100) {
                obstacles3.splice(i, 1);
            }
        }
    } 
    pop();
}

function displayScore3() {
    textFont('Impact');
    fill(0, 255, 255);
    textAlign(LEFT);
    textSize(24);
    text(`MEMORIES RECOVERED: ${score3} / ${GOAL3}`, 60, 60);
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
    textSize(popW * 0.08);
    text("IDENTITY RECOVERED", WIDE_WIDTH / 2, WIDE_HEIGHT / 2);
    textSize(popW * 0.03);
    fill(255);
    text("MEMORY SYNCED...", WIDE_WIDTH / 2, WIDE_HEIGHT / 2 + 60);
    pop();
}

function keyPressedTarefa3() {
    if (key === ' ' || keyCode === UP_ARROW) {
        if (tarefa3State === 'PLAY') {
            player3.jump();
        } else if (tarefa3State === 'GAMEOVER') {
            resetGame3();
        }
    }
}

function resetGame3(pararSom = true) {
    // 1. Limpar elementos do jogo
    obstacles3 = [];
    score3 = 0;
    nextHeyIndex = 0;
    
    // 2. Repor estado para as instruções aparecerem da próxima vez
    tarefa3State = "INSTRUCTIONS";
    
    // 3. Recriar o objeto do jogador
    player3 = new Player3();
    
    // 4. Controlo de Áudio
    // Se pararSom for true (derrota ou reset manual), paramos a música.
    // Se for false (vitória), a música continua para a memória.
    if (pararSom && som3 && som3.isPlaying()) {
        som3.stop();
    }
}

function mousePressedTarefa3() {
    if (tarefa3State === "INSTRUCTIONS") {
        if (checkStartClick()) {
            tarefa3State = "PLAY"; 
            // A música será iniciada automaticamente no draw no próximo frame!
        }
    }
}

class Player3 {
    constructor() {
        this.size = 35;
        this.x = WIDE_WIDTH / 2 - this.size / 2;
        this.y = groundLevel3 - this.size;
        this.vy = 0;
        this.gravity = 0.8;
    }

    jump() {
        if (this.y === groundLevel3 - this.size) {
            this.vy = -14;
        }
    }

    update() {
        this.y += this.vy;
        this.vy += this.gravity;
        this.y = constrain(this.y, 0, groundLevel3 - this.size);
    }

    show() {
        fill(0, 255, 255);
        stroke(255);
        strokeWeight(2);
        rect(this.x, this.y, this.size, this.size);
    }

    hits(obs) {
        return (this.x < obs.x + obs.w &&
            this.x + this.size > obs.x &&
            this.y < obs.y + obs.h &&
            this.y + this.size > obs.y);
    }
}

class Obstacle3 {
    constructor(isHey = false) {
        this.type = floor(random(0, 3));
        this.speed = gameSpeed3;
        this.passed = false;
        this.isHey = isHey; // Marca se é um obstáculo de ritmo

        if (this.type === 0) {
            this.w = 30;
            this.h = 40;
        } else if (this.type === 1) {
            this.w = 30;
            this.h = 75;
        } else {
            this.w = 80;
            this.h = 30;
        }

        this.x = WIDE_WIDTH;
        this.y = groundLevel3 - this.h;
    }

    move() {
        this.x -= this.speed;
    }

    show() {
        if (this.x > 50 && this.x < WIDE_WIDTH - 50) {
            fill(255, 50, 50);
            noStroke();
            if (this.type === 0) {
                triangle(this.x, this.y + this.h, this.x + this.w / 2, this.y, this.x + this.w, this.y + this.h);
            } else {
                rect(this.x, this.y, this.w, this.h);
            }

            // Desenhar o balão "Hey!" acima do obstáculo
            if (this.isHey) {
                textAlign(CENTER);
                textSize(20);
                fill(255, 255, 0); // Amarelo para destaque
                text("Hey!", this.x + this.w / 2, this.y - 10);
            }
        }
    }

    offscreen() {
        return this.x < -this.w;
    }
}