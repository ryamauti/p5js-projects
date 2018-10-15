var tam = 80;
var col;
var row;

function setup() {
	createCanvas(1200, 800);
	s = new Snake();
	a = new Apple();
	frameRate(10);
}

function draw() {
	// put drawing code here
	background(51);
	s.update();	
	checaFruta();	 
	s.show();  
	a.show();
	checaColisao();
}

function checaFruta() {
	if (s.x[0] === a.x && s.y[0] === a.y) {		
		s.grow();				
		a = new Apple();
	}
}

function checaColisao() {
	// colisao alem da parede
	if (s.x[0] >= width || s.x[0] < 0 || s.y[0] >= height || s.y[0] < 0) {		
		endGame();
	}

	// colisao na cobra
	for (var i = s.value; i > 0; i--) {
		if (s.x[0] === s.x[i] && s.y[0] === s.y[i]) {		
			endGame();
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
		for (var i = s.value; i >= 0; i--) {
			if (this.x === s.x[i] && this.y === s.y[i]) {		
				this.checa = 1;
			}
		} 
	} while (this.checa > 0);
	

	

	this.spd = [0, 0];
	this.value = 1;

	this.show = function() {
		fill(255, 0, 0);
		rect(this.x, this.y, tam, tam);
	}
}

function Snake() {
	// construtor	
	this.x = [0];	
	this.y = [0];	
	this.spd = [1, 0];	
	this.value = 0;

	this.dir = function(x, y) {
		this.spd[0] = x;
		this.spd[1] = y;		
	}

	this.grow = function() {
		this.value += 1;				
	}

	this.update = function() {
		for (var i = this.value; i > 0; i--) {
			this.x[i] = this.x[i-1];
			this.y[i] = this.y[i-1];
		}
		this.x[0] += this.spd[0]*tam;
		this.y[0] += this.spd[1]*tam;
	}

	this.show = function() {
		fill(255);
		rect(this.x[0], this.y[0], tam, tam);

		for (var i = 1; i <= this.value; i++) {
			fill(128);
			rect(this.x[i], this.y[i], tam, tam);			
		}
	}
}


function keyPressed() {
	if (keyCode === UP_ARROW && s.spd[1] === 0) {
		s.dir(0, -1);
	} else if (keyCode === DOWN_ARROW && s.spd[1] === 0) {
		s.dir(0, 1);
	} else if (keyCode === LEFT_ARROW && s.spd[0] === 0) {
		s.dir(-1, 0);
	} else if (keyCode === RIGHT_ARROW && s.spd[0] === 0) {
		s.dir(1, 0);
	}
}

function endGame() {
	noLoop();
	alert('Jogo terminou, seu score eh de : ' + s.value);
}