// Click and Drag an object
// Daniel Shiffman <http://www.shiffman.net>

var dragging = false; // Is the object being dragged?
var rollover = false; // Is the mouse over the ellipse?

//var x, y, w, h;          // Location and size
//var offsetX, offsetY;    // Mouseclick offset

var pecas = new Array();

var GRIDSIZE = 220;
var GRIDOFFSET_X = 100;
var GRIDOFFSET_Y = 100;

var tempx;
var tempy;
var indiceMovimento;

var capturas = 3;
var elef;
var elefrev;
var grfa;
var grfarev; 
var galo; 
var galorev; 
var pnto;
var pntorev;
var leao;
var leaorev;


function setup() {
  createCanvas(1800, 900);

  elef = loadImage('Elefante.gif');
  elefrev = loadImage('ElefanteRev.gif');
  grfa = loadImage('Girafa.gif');
  grfarev = loadImage('GirafaRev.gif');
  galo = loadImage('Galo.gif');
  galorev = loadImage('GaloRev.gif');
  pnto = loadImage('Pintinho.gif');
  pntorev = loadImage('PintinhoRev.gif');
  leao = loadImage('Leao.gif');
  leaorev = loadImage('LeaoRev.gif');

  // Starting location
  criaPeca(elef, 'ele', 'terra', 1, 3);
  criaPeca(elefrev, 'vs', 'ceu', 3, 0);
  criaPeca(leao, 'leo', 'terra', 2, 3);
  criaPeca(leaorev, 'vk', 'ceu', 2, 0);
  criaPeca(grfa, 'gir', 'terra', 3, 3);
  criaPeca(grfarev, 'vs', 'ceu', 1, 0);
  criaPeca(pnto, 'pio', 'terra', 2, 2);
  criaPeca(pntorev, 'vs', 'ceu', 2, 1);
}


function alteraPeca(sprt, imagem, tipo, jogador, posx, posy) {    
  sprt.tipo = tipo;
  sprt.img = imagem;
  sprt.jogador = jogador;
  sprt.x = GRIDSIZE * posx;
  sprt.y = GRIDSIZE * posy; 
}


function criaPeca(imagem, tipo, jogador, posx, posy) {    
  var sprt = {};
  alteraPeca(sprt, imagem, tipo, jogador, posx, posy)
  pecas.push(sprt);
}



function draw() {
  background(11); 
  
  for (i = 0; i < pecas.length; i++) {
    dragger(pecas[i]);        
  } 
}



function dragger(obj) {

  var w = obj.img.width;
  var h = obj.img.height;

  // Is mouse over object
  if (mouseX > obj.x && mouseX < obj.x + w && mouseY > obj.y && mouseY < obj.y + h) {
    if (obj.tipo != 'vs' && obj.tipo != 'vk')
      obj.rollover = true;    
  } 
  else {
    
    obj.rollover = false;
  }
  
  // Adjust location if being dragged
  if (obj.dragging) {	
    obj.x = mouseX + obj.offsetX;
    obj.x = round(Math.round(obj.x/GRIDSIZE)) * GRIDSIZE;
    obj.y = mouseY + obj.offsetY;
    obj.y = round(Math.round(obj.y/GRIDSIZE)) * GRIDSIZE;
  }

  stroke(0);  
  // Different fill based on state
  if (obj.dragging) {
    tint(255, 127); 
  } else if (obj.rollover) {
    tint(255, 196); 
  } else {
    tint(255, 255); 
  }

  image(obj.img, obj.x, obj.y);
  
}

function mousePressed() {
  for (i = 0; i < pecas.length; i++) {
    // Did I click on the rectangle?
    if (pecas[i].rollover) {
      pecas[i].dragging = true;

      tempx = pecas[i].x/GRIDSIZE;
      tempy = pecas[i].y/GRIDSIZE;
      indiceMovimento = i;
      
      // If so, keep track of relative location of click to corner of rectangle
      pecas[i].offsetX = pecas[i].x - mouseX;
      pecas[i].offsetY = pecas[i].y - mouseY;
    }
  }
}

function mouseReleased() {
  // Quit dragging
  for (k = 0; k < pecas.length; k++) {
    if (pecas[k].dragging == true) {      
      pecas[k].dragging = false;
      decidir(pecas[k]);
      indiceMovimento = -1; 
    }
  }  
}


function decidir(obj) {
  var x = obj.x/GRIDSIZE;
  var y = obj.y/GRIDSIZE;

  // se nao se mover
  if (x == tempx && y == tempy) {
    condicaoErro('dnmv', obj);

  } else if (x > 3 || x < 1 || y > 3 || y < 0) {
    // fora do grid
    condicaoErro('outgrid', obj);

  } else if (tempx <= 3 && !(
    // movimentos validos  
    (obj.tipo == 'pio' && tempx == x && tempy == y + 1) ||
    (obj.tipo == 'gir' && ((Math.abs(tempx - x) == 1 && tempy == y) || (tempx == x && Math.abs(tempy - y) == 1))) ||
    (obj.tipo == 'ele' && (Math.abs(tempx - x) == 1 && Math.abs(tempy - y) == 1)) ||
    (obj.tipo == 'leo' && (Math.abs(tempx - x) <= 1 && Math.abs(tempy - y) <= 1)) ||
    (obj.tipo == 'gal' && (      
      (Math.abs(tempx - x) <= 1 && tempy == y + 1) ||
      (Math.abs(tempx - x) == 1 && tempy == y) ||
      (tempx == x && tempy == y - 1))))) {
    condicaoErro('a peca nao se move assim', obj);

  } else if (tempx > 3) {
    for (i = 0; i < pecas.length; i++) {
      if (x == pecas[i].x/GRIDSIZE && y == pecas[i].y/GRIDSIZE && indiceMovimento != i) {
        condicaoErro('a recolocacao precisa ser em um lugar vazio', obj);
      }
    }  
  } else {
    // sobre uma peca
    for (i = 0; i < pecas.length; i++) {
      if (x == pecas[i].x/GRIDSIZE && y == pecas[i].y/GRIDSIZE) {
        if (pecas[i].tipo == 'vk') {
          fimDeJogo();

        } else if (pecas[i].tipo == 'vs') {
          captura(pecas[i]);
          passaVez();

        } else if (pecas[i].jogador == 'terra' && indiceMovimento != i) {
          condicaoErro('peca amiga: ' + pecas[i].tipo, obj);

        } else if (obj.tipo == 'leo' && obj.y == 0) {
          fimDeJogo();
        
        } else {
          passaVez();          
        }
      }
    } 
  }
}

function captura(obj) {
  console.log('captura');
  if (obj.img == elefrev) {
    alteraPeca(obj, elef, 'ele', 'terra', 4.25, capturas);    
  } else if (obj.img == grfarev) {
    alteraPeca(obj, grfa, 'gir', 'terra', 4.25, capturas);    
  } else {
    alteraPeca(obj, pnto, 'pio', 'terra', 4.25, capturas); 
  }  
  capturas -= .75;
}

function passaVez() {
  console.log('ok, passa a vez');  
}

function condicaoErro(mensagem, obj) {
  console.log(mensagem);
  obj.x = tempx * GRIDSIZE;
  obj.y = tempy * GRIDSIZE;
}

function fimDeJogo() {
  console.log('vitoria!');
}