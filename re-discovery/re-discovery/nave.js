// cores personagens
let corA, corB, corO, corS;


// Saber qual personagem foi clicado no menu de personagens
let personagemAtual = "";

let TarefaConcluida = {
    aerodynamic: false,
    crescendolls: false,
    some: false,
    super: false,
    veridis: false,
    voyager: false,
    harder: false,
    one: false
}
let btnNave = {
    btnAerodynamic: false,
    btnCrescendolls: false,
    btnSome: false,
    btnSuper: false,
    btnVeridis: false,
    btnVoyager: false,
    btnHarder: false,
    btnOne: false,
}

function drawNave() {
    background(0);
    image(bgNave, 0, 0, width, height);

    corB = color(80, 229, 255);
    corA = color(62, 255, 81);
    corO = color(255, 75, 180);
    corS = color(15, 239, 183);

    drawBtnTarefas(width / 6, height / 2, 20, 10, btnNave.btnVoyager, corB)
    drawBtnTarefas(width / 3, height / 2, 20, 10, btnNave.btnCrescendolls, corB);
    drawBtnTarefas(width/16, height / 2, 20, 10, btnNave.btnAerodynamic, corA)
    drawBtnTarefas(width / 2, height / 2, 20, 10, btnNave.btnHarder, corA);
    drawBtnTarefas(width / 4, height / 2, 20, 10, btnNave.btnSuper, corO)
    drawBtnTarefas(width / 7, height / 2, 20, 10, btnNave.btnVeridis, corO);
    drawBtnTarefas(width / 5, height / 2, 20, 10, btnNave.btnSome, corS)
    drawBtnTarefas(width / 8, height / 2, 20, 10, btnNave.btnOne, corS);

    verificarProgressoNave()
}

function drawBtnTarefas(x, y, w, h, isUnlocked, cor) {
    // 1. Verificar se o mouse está sobre ESTE botão específico
    let over = mouseX > x - w / 2 && mouseX < x + w / 2 && mouseY > y - h / 2 && mouseY < y + h / 2;

    if (isUnlocked) {
        let c = color(cor);

        if (over) {
            cursor(HAND);
            push();
            rectMode(CENTER);
            fill(red(c), green(c), blue(c), 89);
            noStroke();
            rect(x, y, w, h);
            pop();
        }

        push();
        rectMode(CENTER);
        stroke(c);
        strokeWeight(2); // Diminuído para não "comer" o botão
        noFill();
        rect(x, y, w, h);
        pop();
    } else {
        // Botão bloqueado
        push();
        rectMode(CENTER);
        stroke(100); // Cinza para indicar bloqueado
        strokeWeight(1);
        noFill();
        rect(x, y, w, h);
        // Opcional: um X pequeno para indicar bloqueio
        line(x - 5, y - 5, x + 5, y + 5);
        pop();
    }
}

// nave.js

// Configura quais botões aparecem dependendo do personagem
function configurarBotoesNave() {
    // Desliga todos primeiro
    for (let key in btnNave) { btnNave[key] = false; }

    if (personagemAtual === "BARYL") {
        btnNave.btnAerodynamic = true;
        btnNave.btnHarder = true;
    } else if (personagemAtual === "ARPEGIUS") {
        btnNave.btnCrescendolls = true;
        btnNave.btnSuper = true;
    } else if (personagemAtual === "OCTAVE") {
        // --- ADICIONADO AQUI: Liga os botões do Octave ---
        btnNave.btnSome = true;
        btnNave.btnVoyager = true;
    } else if (personagemAtual === "STELLA") {
        // --- ADICIONADO AQUI: Já fica pronto para a Stella! ---
        btnNave.btnVeridis = true;
        btnNave.btnOne = true;
    }
}

// Verifica se o personagem terminou as suas duas tarefas
//Corrigir ordem das tarefas depois 
function verificarProgressoNave() {
    if (personagemAtual === "BARYL") {
        if (TarefaConcluida.aerodynamic && TarefaConcluida.harder) {
            personagensStatus.arpegius = true;
            goTo("MENU_PERSONAGENS");
            personagemAtual = "";
        }
    }
    else if (personagemAtual === "ARPEGIUS") { // Nome corrigido aqui
        if (TarefaConcluida.crescendolls && TarefaConcluida.super) { // Tarefas corretas aqui
            personagensStatus.octave = true;
            goTo("MENU_PERSONAGENS");
            personagemAtual = "";
        }
    }
    else if (personagemAtual === "OCTAVE") {
        if (TarefaConcluida.some && TarefaConcluida.voyager) {
            // Desbloqueia próximo personagem (Stella)
            personagensStatus.stella = true;
            goTo("MENU_PERSONAGENS");
            personagemAtual = ""; // Limpa para não repetir
        }
    }
    else if (personagemAtual === "STELLA") {
        if (TarefaConcluida.veridis && TarefaConcluida.one) {
            personagensStatus.stella = true;
          goTo("VITORIA");
        }
    }

}

// Chamar esta função no mousePressed do menu.js quando gameState === "NAVE"
function handleNaveClick() {
    let w = 20; // Largura do botão no teu código
    let h = 10; // Altura do botão no teu código

    function clickBtn(x, y) {
        return mouseX > x - w / 2 && mouseX < x + w / 2 && mouseY > y - h / 2 && mouseY < y + h / 2;
    }

    // Se o botão Aerodynamic (Tarefa 1) está ativo, não foi concluído e foi clicado
    if (btnNave.btnAerodynamic && !TarefaConcluida.aerodynamic && clickBtn(width/16, height / 2)) {
        goTo("TAREFA1");
    }

    // Se o botão Harder (Tarefa 2) está ativo, não foi concluído e foi clicado
    if (btnNave.btnHarder && !TarefaConcluida.harder && clickBtn(width / 2, height / 2)) {
        goTo("TAREFA2");
    }

    if (btnNave.btnCrescendolls && !TarefaConcluida.crescendolls && clickBtn(width / 3, height / 2)) {
        goTo("TAREFA3");
    }

    if (btnNave.btnSuper && !TarefaConcluida.super && clickBtn(width / 4, height / 2)) {
        goTo("TAREFA4");
    }

    if (btnNave.btnSome && !TarefaConcluida.some && clickBtn(width / 5, height / 2)) {
        goTo("TAREFA5");
    }

    if (btnNave.btnVoyager && !TarefaConcluida.voyager && clickBtn(width / 6, height / 2)) {
        goTo("TAREFA6");
    }

    if (btnNave.btnVeridis && !TarefaConcluida.veridis && clickBtn(width / 7, height / 2)) {
        goTo("TAREFA7");
    }

      if (btnNave.btnOne && !TarefaConcluida.one && clickBtn(width / 8, height / 2)) {
        goTo("TAREFA8");
    }
}