
let vitoriaFase    = 0;
let _discoY        = 0;
let _discoScale    = 1.0;
let _discoW        = 0;
let _discoH        = 0;
let _mostrarVidro4  = false;
let _noiseDisparado = false;

function iniciarCenaFinal() {
    _discoW = width * 0.15;
    let proporcao = disco[4].height / disco[4].width;
    _discoH = _discoW * proporcao;

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

    if (vitoriaFase === 4 && transitionType === "NONE") {
        imageMode(CORNER);
        image(bgQuarto2Img, 0, 0, quartoNewW, quartoNewH);
        _drawFinalUI();
        return;
    }

    let larguraEscalada = bgNave.width * scaleRatioNave;
    let centroX = (width - larguraEscalada) / 2;

    //nave
    push();
    translate(centroX, 0);
    scale(scaleRatioNave);
    imageMode(CORNER);
    image(bgNave, 0, 0);
    pop();

    //disco
    push();
    imageMode(CENTER);
    drawingContext.shadowBlur  = 30;
    drawingContext.shadowColor = color(255, 215, 0);
    image(disco[4], width / 2, _discoY, _discoW * _discoScale, _discoH * _discoScale);
    drawingContext.shadowBlur = 0;
    pop();

    //bidro
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

    //disco sobe
    if (vitoriaFase === 1) {
        let alvoY = height / 2;
        _discoY = lerp(_discoY, alvoY, 0.04);

        if (abs(_discoY - alvoY) < 1) {
            _discoY     = alvoY;
            vitoriaFase = 2;
        }
    }

    //zoom do disco
    else if (vitoriaFase === 2) {
        _discoScale += 0.018;
        if (_discoScale >= 2.26) {
            _discoScale = 2.26;
            vitoriaFase = 3;
        }
    }

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
    push();
    textAlign(CENTER, CENTER);
    textFont('Impact');
    fill(255);
    textSize(width * 0.04);
    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = color(62, 255, 81);
    text("RE-DISCOVERY COMPLETE", width / 2, height * 0.45);
    pop();

    updateButton(restartBtnFinal);
    updateButton(aboutBtnFinal);

    drawButton(restartBtnFinal);
    drawButton(aboutBtnFinal);
}

function handleVitoriaClick() {
    // so deixa clicar se a animação tiver acabado
    if (vitoriaFase === 4 && transitionType === "NONE") {
        
        //restart
        if (mouseX > restartBtnFinal.x - restartBtnFinal.w/2 && mouseX < restartBtnFinal.x + restartBtnFinal.w/2 &&
            mouseY > restartBtnFinal.y - restartBtnFinal.h/2 && mouseY < restartBtnFinal.y + restartBtnFinal.h/2) {
            location.reload(); // refresh
        }
        
        // aboyt
        if (mouseX > aboutBtnFinal.x - aboutBtnFinal.w/2 && mouseX < aboutBtnFinal.x + aboutBtnFinal.w/2 &&
            mouseY > aboutBtnFinal.y - aboutBtnFinal.h/2 && mouseY < aboutBtnFinal.y + aboutBtnFinal.h/2) {
            goTo("ABOUT", "FADE");
        }
    }
}