//se inicializan todas las variables
const BG_COLOUR = '#231f20';
const SNAKE_COLOUR = '#c2c2c2';
const FOOD_COLOUR = '#e66916';
//se genera el canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = canvas.height =400;
//variables de ratio de frames, tamaño de pantalla y tamaño del cuadrado del canvas
const FR = 10;
const S = 20;
const T = canvas.width / S;

let pos, vel, comida, snake;
//función para iniciar el juego
function init(){
  pos = {x: 10, y: 10};
  vel = {x: 0, y: 0};

  snake = [
    {x: 8, y: 10},
    {x: 9, y: 10},
    {x: 10, y: 10},
  ]

  comidarandom();
}

init();
//función para generar comida en una posición aleatoria
function comidarandom(){
  comida = {
    x: Math.floor(Math.random() * T),
    y: Math.floor(Math.random() * T),
  }

  for (let cell of snake) {
    if(cell.x === comida.x && comida.y === cell.y) {
      return comidarandom();
    }
  }
}

document.addEventListener('keydown', keydown);
//función para cuando pulse una tecla la serpiente se mueva
function keydown(e){
  switch(e.keyCode) {
    case 37: {
      return vel = {x: -1, y: 0}
    }
    case 38: {
      return vel = {x: 0, y: -1}
    }
    case 39: {
      return vel = {x: 1, y: 0}
    }
    case 40: {
      return vel = {x: 0, y: 1}
    }
  }
}

setInterval(() => {
  requestAnimationFrame(gameLoop);
}, 1000 /FR);


//función para que el juego no se pare al coger una comida
function gameLoop(){
  ctx.fillStyle = BG_COLOUR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = SNAKE_COLOUR;
  for (let cell of snake) {
    ctx.fillRect(cell.x*S, cell.y*S, S,S);
  }

  ctx.fillStyle = FOOD_COLOUR;
  ctx.fillRect(comida.x*S,comida.y*S,S,S);

  pos.x += vel.x;
  pos.y += vel.y;

  if (pos.x < 0 || pos.x > T || pos.y < 0 || pos.y > T) {
    init();
  }

  if (comida.x === pos.x && comida.y === pos.y) {
    snake.push({...pos});
    pos.x += vel.x;
    pos.y += vel.y;
    comidarandom();
  }

  if (vel.x || vel.y) {
    for (let cell of snake) {
      if (cell.x === pos.x && cell.y === pos.y) {
        return init();
      }
    }
    snake.push({...pos});
    snake.shift();
  }
}
