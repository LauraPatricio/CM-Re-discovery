// Saber qual personagem foi clicado no menu de personagens
let personagemAtual = "";

// Estado das Tarefas
let TarefaConcluida = {
    aerodynamic: false, crescendolls: false, some: false, super: false,
    veridis: false, voyager: false, harder: false, one: false
};

// Botões Ativos na Nave
let btnNave = {
    btnAerodynamic: false, btnCrescendolls: false, btnSome: false, btnSuper: false,
    btnVeridis: false, btnVoyager: false, btnHarder: false, btnOne: false
};

// Dicionários para guardar as imagens carregadas
let buttonLine = {};
let buttonHover = {};
let buttonConc = {};

// Lista única com os nomes base dos ficheiros
let svgNames = ["Aerodynamic", "Crescendolls", "Some", "Super", "Veridis", "Voyager", "Harder", "One"];

function preloadNave() {
    for (let nome of svgNames) {
        buttonLine[nome] = loadImage('imagens/btn' + nome + 'Line.svg');
        buttonHover[nome] = loadImage('imagens/btn' + nome + 'Hover.svg');
        buttonConc[nome] = loadImage('imagens/btn' + nome + 'Conc.svg');
    }
}

function drawNave() {
    background(0);
    let larguraEscalada = bgNave.width * scaleRatioNave;
    let centroX = (width - larguraEscalada) / 2;
    push(); 
    translate(centroX, 0); 
    scale(scaleRatioNave);
    
    imageMode(CORNER);
    image(bgNave, 0, 0);

    // --- DESENHAR OS BOTÕES ---
    drawBtnImagem(699, 805, btnNave.btnVoyager, TarefaConcluida.voyager, buttonLine["Voyager"], buttonHover["Voyager"], buttonConc["Voyager"]);
    drawBtnImagem(1090, 906, btnNave.btnCrescendolls, TarefaConcluida.crescendolls, buttonLine["Crescendolls"], buttonHover["Crescendolls"], buttonConc["Crescendolls"]);
    drawBtnImagem(1180, 909, btnNave.btnAerodynamic, TarefaConcluida.aerodynamic, buttonLine["Aerodynamic"], buttonHover["Aerodynamic"], buttonConc["Aerodynamic"]);
    drawBtnImagem(946, 830, btnNave.btnHarder, TarefaConcluida.harder, buttonLine["Harder"], buttonHover["Harder"], buttonConc["Harder"]);
    drawBtnImagem(1180, 767, btnNave.btnSuper, TarefaConcluida.super, buttonLine["Super"], buttonHover["Super"], buttonConc["Super"]);
    drawBtnImagem(1292, 837, btnNave.btnVeridis, TarefaConcluida.veridis, buttonLine["Veridis"], buttonHover["Veridis"], buttonConc["Veridis"]);
    drawBtnImagem(1184, 839, btnNave.btnSome, TarefaConcluida.some, buttonLine["Some"], buttonHover["Some"], buttonConc["Some"]);
    drawBtnImagem(522, 850, btnNave.btnOne, TarefaConcluida.one, buttonLine["One"], buttonHover["One"], buttonConc["One"]);

    pop(); // <-- FECHA AQUI O BLOCO DA ESCALA! Tudo o que está cá dentro mexeu-se por igual.

    verificarProgressoNave();
}

/**
 * Função desenhar os botões SVG com tamanhos automáticos e rato virtual
 */
function drawBtnImagem(x, y, isUnlocked, isConcluded, imgLine, imgHover, imgConc) {

    let fatorAjuste = 1.22;
    let w = imgLine.width * fatorAjuste;
    let h = imgLine.height * fatorAjuste;

    // --- CORREÇÃO AQUI: O Rato Virtual precisa de saber o centroX! ---
    let larguraEscalada = bgNave.width * scaleRatioNave;
    let centroX = (width - larguraEscalada) / 2;

    // Subtraímos o centroX ao mouseX para compensar o empurrão do ecrã
    let virtualMouseX = (mouseX - centroX) / scaleRatioNave;
    let virtualMouseY = mouseY / scaleRatioNave;
    // ------------------------------------------------------------------

    let over = virtualMouseX > x - w / 2 && virtualMouseX < x + w / 2 && virtualMouseY > y - h / 2 && virtualMouseY < y + h / 2;

    push();
    imageMode(CENTER);

    if (isConcluded) {
        image(imgConc, x, y, w, h);
    }
    else if (isUnlocked) {
        if (over) {
            cursor(HAND);
            image(imgHover, x, y, w, h);
        } else {
            image(imgLine, x, y, w, h);
        }
    }
    pop();
}
// Configura quais botões aparecem dependendo do personagem
function configurarBotoesNave() {
    for (let key in btnNave) { btnNave[key] = false; }

    if (personagemAtual === "BARYL") {
        btnNave.btnVoyager = true;
        btnNave.btnCrescendolls = true;
    } else if (personagemAtual === "ARPEGIUS") {
        btnNave.btnHarder = true;
        btnNave.btnAerodynamic = true;
    } else if (personagemAtual === "OCTAVE") {
        btnNave.btnSuper = true;
        btnNave.btnVeridis = true;
    } else if (personagemAtual === "STELLA") {
        btnNave.btnSome = true;
        btnNave.btnOne = true;
    }
}

// Verifica se o personagem terminou as suas duas tarefas
function verificarProgressoNave() {
    if (personagemAtual === "BARYL" && TarefaConcluida.voyager && TarefaConcluida.crescendolls) {
        personagensStatus.arpegius = true;
        goTo("MENU_PERSONAGENS");
        personagemAtual = "";
    }
    else if (personagemAtual === "ARPEGIUS" && TarefaConcluida.aerodynamic && TarefaConcluida.harder) {
        personagensStatus.octave = true;
        goTo("MENU_PERSONAGENS");
        personagemAtual = "";
    }
    else if (personagemAtual === "OCTAVE" && TarefaConcluida.super && TarefaConcluida.veridis) {
        personagensStatus.stella = true;
        goTo("MENU_PERSONAGENS");
        personagemAtual = "";
    }
    else if (personagemAtual === "STELLA" && TarefaConcluida.some && TarefaConcluida.one) {
        personagensStatus.stella = true;
        goTo("MENU_PERSONAGENS");
    }
}

// Lógica de clique na Nave com tamanhos automáticos e rato virtual
function handleNaveClick() {

    // --- CORREÇÃO AQUI: O Clique também precisa de saber o centroX! ---
    let larguraEscalada = bgNave.width * scaleRatioNave;
    let centroX = (width - larguraEscalada) / 2;

    // Subtraímos o centroX ao mouseX
    let virtualMouseX = (mouseX - centroX) / scaleRatioNave;
    let virtualMouseY = mouseY / scaleRatioNave;
    // ------------------------------------------------------------------

    function clickBtn(x, y, img) {
        let fatorAjuste = 1.22; // Tem de ser igual ao do drawBtnImagem
        let w = img.width * fatorAjuste;
        let h = img.height * fatorAjuste;

        return virtualMouseX > x - w / 2 && virtualMouseX < x + w / 2 && virtualMouseY > y - h / 2 && virtualMouseY < y + h / 2;
    }

    // Verificações de clique
    if (btnNave.btnVoyager && !TarefaConcluida.voyager && clickBtn(699, 805, buttonLine["Voyager"])) goTo("TAREFA6");
    if (btnNave.btnCrescendolls && !TarefaConcluida.crescendolls && clickBtn(1090, 906, buttonLine["Crescendolls"])) goTo("TAREFA3");
    if (btnNave.btnAerodynamic && !TarefaConcluida.aerodynamic && clickBtn(1180, 909, buttonLine["Aerodynamic"])) goTo("TAREFA1");
    if (btnNave.btnHarder && !TarefaConcluida.harder && clickBtn(946, 830, buttonLine["Harder"])) goTo("TAREFA2");
    if (btnNave.btnSuper && !TarefaConcluida.super && clickBtn(1180, 767, buttonLine["Super"])) goTo("TAREFA4");
    if (btnNave.btnVeridis && !TarefaConcluida.veridis && clickBtn(1292, 837, buttonLine["Veridis"])) goTo("TAREFA7");
    if (btnNave.btnSome && !TarefaConcluida.some && clickBtn(1184, 839, buttonLine["Some"])) goTo("TAREFA5");
    if (btnNave.btnOne && !TarefaConcluida.one && clickBtn(522, 850, buttonLine["One"])) goTo("TAREFA8");
}