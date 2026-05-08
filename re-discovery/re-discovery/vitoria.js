// ═══════════════════════════════════════════════
//  VITORIA.JS — Cena final animada
//
//  ORDEM DE DESENHO (de baixo para cima):
//  1. Nave
//  2. Disco  ← ABAIXO do vidro
//  3. Vidro (blendMode SCREEN) ← SEMPRE O ÚLTIMO, cobre tudo
// ═══════════════════════════════════════════════

let vitoriaFase    = 0;
let _discoY        = 0;
let _discoScale    = 1.0;
let _discoW        = 0;
let _discoH        = 0;
let _mostrarVidro4  = false;
let _noiseDisparado = false;

// ── Entrada ───────────────────────────────────
function iniciarCenaFinal() {
    _discoW = width * 0.15;
    let proporcao = disco[4].height / disco[4].width;
    _discoH = _discoW * proporcao;

    // BUG 1 CORRIGIDO: começa completamente fora do ecrã por baixo
    // O disco entra de baixo da janela e sobe até ao centro
    _discoY         = height + _discoH;
    _discoScale     = 1.0;
    _mostrarVidro4  = false;
    _noiseDisparado = false;
    vitoriaFase     = 1;

    goTo("VITORIA");
}

// ── Draw ──────────────────────────────────────
function drawVitoriaScreen() {

    // FASE 4: Quarto 2 (após noise)
    if (vitoriaFase === 4 && transitionType === "NONE") {
        imageMode(CORNER);
        image(bgQuarto2Img, 0, 0, quartoNewW, quartoNewH);
        _drawFinalUI();
        return;
    }

    let larguraEscalada = bgNave.width * scaleRatioNave;
    let centroX = (width - larguraEscalada) / 2;

    // ── CAMADA 1: NAVE ────────────────────────
    push();
    translate(centroX, 0);
    scale(scaleRatioNave);
    imageMode(CORNER);
    image(bgNave, 0, 0);
    pop();

    // ── CAMADA 2: DISCO (abaixo do vidro) ─────
    push();
    imageMode(CENTER);
    drawingContext.shadowBlur  = 30;
    drawingContext.shadowColor = color(255, 215, 0);
    image(disco[4], width / 2, _discoY, _discoW * _discoScale, _discoH * _discoScale);
    drawingContext.shadowBlur = 0;
    pop();

    // ── CAMADA 3: VIDRO (sempre por cima de tudo, incluindo o disco) ──
    // BUG 2 CORRIGIDO: desenhado DEPOIS do disco em passo separado
    push();
    translate(centroX, 0);
    scale(scaleRatioNave);
    imageMode(CORNER);
    blendMode(SCREEN);
    if (_mostrarVidro4) {
        if (imgVidros[4]) image(imgVidros[4], 0, 0, bgNave.width, bgNave.height);
    } else {
        if (imgVidros[3]) image(imgVidros[3], 0, 0, bgNave.width, bgNave.height);
    }
    blendMode(BLEND);
    pop();

    // ── LÓGICA DAS FASES ──────────────────────

    // FASE 1: disco sobe de fora do ecrã até ao centro
    if (vitoriaFase === 1) {
        let alvoY = height / 2;
        _discoY = lerp(_discoY, alvoY, 0.04);

        if (abs(_discoY - alvoY) < 1) {
            _discoY     = alvoY;
            vitoriaFase = 2;
        }
    }

    // FASE 2: zoom ~2.26x
    else if (vitoriaFase === 2) {
        _discoScale += 0.018;
        if (_discoScale >= 2.26) {
            _discoScale = 2.26;
            vitoriaFase = 3;
        }
    }

    // FASE 3: mostra vidro[4], pausa 600ms, dispara NOISE
    else if (vitoriaFase === 3) {
        _mostrarVidro4 = true;
        if (!_noiseDisparado) {
            _noiseDisparado = true;
            setTimeout(() => {
                vitoriaFase = 4;
                goTo("VITORIA", "NOISE");
            }, 600);
        }
    }
}

function _drawFinalUI() {
    // Título final ou Créditos rápidos (opcional)
    push();
    textAlign(CENTER, CENTER);
    textFont('Impact');
    fill(255);
    textSize(width * 0.04);
    // Efeito de brilho no título final
    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = color(62, 255, 81);
    text("RE-DISCOVERY COMPLETE", width / 2, height * 0.45);
    pop();

    // Atualiza e Desenha os botões usando as funções globais do menu.js
    updateButton(restartBtnFinal);
    updateButton(aboutBtnFinal);

    drawButton(restartBtnFinal);
    drawButton(aboutBtnFinal);
}

function handleVitoriaClick() {
    // Só permite clique se a animação tiver acabado
    if (vitoriaFase === 4 && transitionType === "NONE") {
        
        // Clique no RESTART
        if (mouseX > restartBtnFinal.x - restartBtnFinal.w/2 && mouseX < restartBtnFinal.x + restartBtnFinal.w/2 &&
            mouseY > restartBtnFinal.y - restartBtnFinal.h/2 && mouseY < restartBtnFinal.y + restartBtnFinal.h/2) {
            location.reload(); // Faz o refresh total da página
        }
        
        // Clique no ABOUT
        if (mouseX > aboutBtnFinal.x - aboutBtnFinal.w/2 && mouseX < aboutBtnFinal.x + aboutBtnFinal.w/2 &&
            mouseY > aboutBtnFinal.y - aboutBtnFinal.h/2 && mouseY < aboutBtnFinal.y + aboutBtnFinal.h/2) {
            goTo("ABOUT", "FADE");
        }
    }
}