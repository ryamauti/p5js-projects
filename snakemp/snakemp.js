let tam = 30;
let frutaQtde = 10;
var frutas = [];
let cobraQtde = 3;
var cobras = [];
var col;
var row;
var rodando;	// estado 0: falso | 1: aguardando | 2: jogando
let timer = 5;
let fRate = 8;


function setup() {
	createCanvas(1800, 900);
	// Cobras
	for (var i = 0; i < cobraQtde; i++) {
		cobras[i] = new Snake(i);
	}
	// Frutas	
	for (var i = 0; i < frutaQtde; i++) {
		frutas[i] = new Apple();
	}
	
	frameRate(fRate); 
	rodando = 0;
}

function draw() {		
	background(51);

	if (rodando === 2) {
		// 1. cobras caminham
		for (var i = 0; i < cobras.length; i++) { cobras[i].update(); }

		for (var i = 0; i < cobras.length; i++) { 
			// 2. cobras verificam colisoes
			checaColisao(cobras[i]); 
			// 3. cobras comem
			for (var k = 0; k < frutas.length; k++) {					
				if (checaFruta(cobras[i], frutas[k])) {
					frutas[k] = new Apple();	
				}
				// 4.1 atualizar o canvas com as frutas
				frutas[k].show();
			}		
		}
		// 4.2 atualizar o canvas com as cobras
		for (var i = 0; i < cobras.length; i++) { cobras[i].show(); }	
		
		// 5. checa se todos morreram. se sim, exibir placar	
		var mortos = 0
		for (var i = 0; i < cobras.length; i++) { 		
			if (cobras[i].alive === false) {
				mortos += 1; 
			}		 
		}
		if (mortos === cobraQtde) {
			endGame();
		}
	} else if (rodando === 1) {
		// 4. atualizar o canvas
		for (var i = 0; i < cobras.length; i++) { cobras[i].show(); }	
		textSize(120);
  		textAlign(CENTER, CENTER);
  		fill(255)  	  		  		
		if (frameCount % fRate == 0 && timer > 0) { // if the frameCount is divisible by 60, then a second has passed. it will stop at 0
			timer --;			
		}		
		if (timer === 0) {
			text("JÁ", width * .5, height * .50);
			rodando = 2;
			for (var k = 0; k < frutas.length; k++) {									
				// 4.1 atualizar o canvas com as frutas
				frutas[k].show();
			}
		} else {
			text(timer, width * .5, height * .50);	
		}

		
	} else {
		// texto de inicio
		textSize(80);
  		textAlign(CENTER, CENTER);
  		fill(255)
  		text("Snake Multiplayer", width * .5, height * .20);
  		textSize(50);
  		fill(200)
  		text("BRANCO move com as setas", width * .5, height * .35);
  		text("AMARELO move com WASD", width * .5, height * .47);
  		text("VERDE move com IJKL", width * .5, height * .61);
  		textSize(40);
  		fill(255)
  		text("Clique com o mouse para começar", width * .5, height * .75);
  				
		if (mouseIsPressed) {
    		rodando = 1;
  		}
	} 
}

function checaFruta(s, frt) {
	if (s.x[0] === frt.x && s.y[0] === frt.y) {		
		s.grow(frt.value);				
		return true;
	}
	return false;
}


function checaColisao(s) {
	// colisao alem da parede
	if (s.x[0] >= width || s.x[0] < 0 || s.y[0] >= height || s.y[0] < 0) {		
		s.alive = false;
	}

	// colisao na propria cobra - talvez seja desnecessario
	for (var i = s.value; i > 0; i--) {
		if (s.x[0] === s.x[i] && s.y[0] === s.y[i]) {		
			s.alive = false;
		}
	}

	// colisao nas outras cobras, exceto a cabeca
	for (var j = 0; j < cobraQtde; j++) { 
		for (var i = s.value; i > 0; i--) {
			if (s.x[0] === cobras[j].x[i] && s.y[0] === cobras[j].y[i]) {		
				s.alive = false;
			}
		}
	}
}

function Apple() {
	// construtor
	this.geraFruta = function() {
		this.x = floor(random(0, width / tam))*tam;
		this.y = floor(random(0, height / tam))*tam;		
	}

	do {
		this.geraFruta();
		this.checa = 0;
		// checa se a maca esta nascendo no corpo das cobras
		for (var j = 0; j < cobraQtde; j++) { 
			for (var i = cobras[j].value; i >= 0; i--) {
				if (this.x === cobras[j].x[i] && this.y === cobras[j].y[i]) {		
					this.checa = 1;
				}
			} 
		}
		// checa se a maca esta nascendo em outra maca
		for (var k = 0; k < frutas.length; k++) { 		
			if (this.x === frutas[k].x && this.y === frutas[k].y) {		
				this.checa = 1;
			}			 
		}
	} while (this.checa > 0);	

	this.spd = [0, 0];
	this.value = floor(random(1, 6));

	this.show = function() {		
		fill(255 - (this.value - 1)*50, 0, 0);
		rect(this.x, this.y, tam, tam);
	}
}


function Snake(jog) {
	// construtor
	this.alive = true;	
	this.x = [];	
	this.y = [];

	temp = snakeAttrib(jog);
	this.ch = temp[0];
	this.cb = temp[1];
	this.x[0] = temp[2];	
	this.y[0] = temp[3];	
	this.spd = temp[4];	
	this.value = 0;
	
	this.dir = function(x, y) {
		this.spd[0] = x;
		this.spd[1] = y;		
	}

	this.grow = function(x) {
		this.value += x;				
	}

	this.update = function() {
		for (var i = this.value; i > 0; i--) {
			this.x[i] = this.x[i-1];
			this.y[i] = this.y[i-1];
		}
		// se a cobra estiver morta, pare de andar
		if (this.alive) {
			this.x[0] += this.spd[0]*tam;
			this.y[0] += this.spd[1]*tam;	
		} 		
	}

	this.show = function() {
		fill(this.ch);
		rect(this.x[0], this.y[0], tam, tam);

		for (var i = 1; i <= this.value; i++) {
			fill(this.cb);
			rect(this.x[i], this.y[i], tam, tam);			
		}
	}
}

function snakeAttrib(jog) {
	// 0: BRANCO
	if (jog === 0) {
		this.corHead = color(255, 255, 255);
		this.corBody = color(127, 127, 127);
		this.x = 0;	
		this.y = 0;	
		this.spd = [1, 0];	
	}
	// 1: AMARELO
	if (jog === 1) {
		this.corHead = color(255, 255, 0);
		this.corBody = color(127, 127, 0);
		this.x = 0;	
		this.y = floor(height / tam - 1) * tam;	
		this.spd = [1, 0];	
	}
	// 2: VERDE
	if (jog === 2) {
		this.corHead = color(0, 255, 0);
		this.corBody = color(0, 127, 0);
		this.x = 0;	
		this.y = floor(height * .5 / tam) * tam;		
		this.spd = [1, 0];	
	}

	// 3: AZUL - nao instalado
	if (jog === 3) {
		this.corHead = color(0, 0, 255);
		this.corBody = color(0, 0, 127);
		this.x = width - tam;	
		this.y = tam * 2;		
		this.spd = [-1, 0];	
	}
	return [this.corHead, this.corBody, this.x, this.y, this.spd];
}


function keyPressed() {
	s = cobras[0];
	if (keyCode === UP_ARROW && s.spd[1] === 0) {
		s.dir(0, -1);
	} else if (keyCode === DOWN_ARROW && s.spd[1] === 0) {
		s.dir(0, 1);
	} else if (keyCode === LEFT_ARROW && s.spd[0] === 0) {
		s.dir(-1, 0);
	} else if (keyCode === RIGHT_ARROW && s.spd[0] === 0) {
		s.dir(1, 0);
	}

	s = cobras[1];
	if (keyCode === 87 && s.spd[1] === 0) {			// W
		s.dir(0, -1);
	} else if (keyCode === 83 && s.spd[1] === 0) {	// S
		s.dir(0, 1);
	} else if (keyCode === 65 && s.spd[0] === 0) {	// A
		s.dir(-1, 0);
	} else if (keyCode === 68 && s.spd[0] === 0) {	// D
		s.dir(1, 0);
	}

	s = cobras[2];
	if (keyCode === 73 && s.spd[1] === 0) {			// I
		s.dir(0, -1);
	} else if (keyCode === 75 && s.spd[1] === 0) {	// K
		s.dir(0, 1);
	} else if (keyCode === 74 && s.spd[0] === 0) {	// J
		s.dir(-1, 0);
	} else if (keyCode === 76 && s.spd[0] === 0) {	// L
		s.dir(1, 0);
	}
}


function endGame() {
	noLoop();
	alert('Jogo terminou');
}