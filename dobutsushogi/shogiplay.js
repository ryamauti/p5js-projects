// Click and Drag an object
// Daniel Shiffman <http://www.shiffman.net>

var pecas = new Array();

var GRIDSIZE = 220;
var GRIDOFFSET_X = 100;
var GRIDOFFSET_Y = 100;

var SPRITESIZE = 190;

var draggedSprite;


function setup() {
  createCanvas(1800, 900);

  var elef = loadImage('Elefante.gif');
  var grfa = loadImage('Girafa.gif');

  // Starting location
  criaPeca(elef, 0, 1, 1);
  criaPeca(grfa, 0, 2, 1);

}

function draw() {
  background(11); 

  drawSprites(); 

  if (draggedSprite != null) {
    draggedSprite.position.x = mouseX + draggedSprite.offsetX;
    draggedSprite.position.x = round(Math.round(draggedSprite.position.x/GRIDSIZE)) * GRIDSIZE;
    draggedSprite.position.y = mouseY + draggedSprite.offsetY;
    draggedSprite.position.y = round(Math.round(draggedSprite.position.y/GRIDSIZE)) * GRIDSIZE;
  }
}


function criaPeca(tipo, rota, posx, posy) {
    // Starting location
    var sprt = createSprite(GRIDSIZE * posx, GRIDSIZE * posy, SPRITESIZE, SPRITESIZE);
    sprt.addImage(tipo);
    sprt.rotation = rota * 180;
  
    sprt.onMouseOver = function() {
      if (draggedSprite == null)
        this.scale = 0.9;
    };
    sprt.onMouseOut = function() {
      if (draggedSprite == null)
        this.scale = 1;
    };
    
    sprt.onMousePressed = function() {    
      this.scale = 1.1;
      this.offsetX = this.position.x - mouseX;
      this.offsetY = this.position.y - mouseY;
      if (draggedSprite == null) {
        draggedSprite = this;
      }
    };
  
    sprt.onMouseReleased = function() {
      draggedSprite = null;
      this.scale = 1;
    };

    pecas.push(sprt);
}