const BG_COLOUR = '#231f20';
const SNAKE_COLOUR = '#c2c2c2';
const FOOD_COLOUR = '#e66916';

const socket = io('https://still-wildwood-60909.herokuapp.com/');

//se activan los metodos que vamos a usar mediante socket.on
socket.on('init', manejarInit);
socket.on('gameState', manejarEstadoJuego);
socket.on('gameOver', manejarFinJuego);
socket.on('gameCode', manejarCodigoJuego);
socket.on('codigoDesc', manejarCodigoJuegoDesc);
socket.on('muchosJugadores', manejarMuchosJugadores);

//cogemos las variables mediante getElement
const pantallaJuego = document.getElementById('pantallaJuego');
const pantallaInicial = document.getElementById('pantallaInicial');
const btnNuevoJuego = document.getElementById('btnNuevoJuego');
const btnUnirse = document.getElementById('btnUnirse');
const inputCodigo = document.getElementById('inputCodigo');
const displayCodigo = document.getElementById('displayCodigo');

btnNuevoJuego.addEventListener('click', newGame);
btnUnirse.addEventListener('click', joinGame);

//se crea un nuevo juego
function newGame() {
  socket.emit('newGame');
  init();
}
//funcion para unirse a un juego
function joinGame() {
  const code = inputCodigo.value;
  socket.emit('joinGame', code);
  init();
}

let canvas, ctx;
let numeroJugador;
let gameActive = false;
//se genera el canvas
function init() {
  pantallaInicial.style.display = "none";
  pantallaJuego.style.display = "block";

  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');

  canvas.width = canvas.height = 600;

  ctx.fillStyle = BG_COLOUR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  document.addEventListener('keydown', keydown);
  gameActive = true;
}
//se registra la tecla pulsada
function keydown(e) {
  socket.emit('keydown', e.keyCode);
}
//se pinta el canvas y la comida
function pintarCanvas(state) {
  ctx.fillStyle = BG_COLOUR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const food = state.food;
  const gridsize = state.gridsize;
  const size = canvas.width / gridsize;

  ctx.fillStyle = FOOD_COLOUR;
  ctx.fillRect(food.x * size, food.y * size, size, size);

  pintarJugador(state.players[0], size, SNAKE_COLOUR);
  pintarJugador(state.players[1], size, 'red');
}
//se pinta a cada jugador
function pintarJugador(playerState, size, colour) {
  const snake = playerState.snake;

  ctx.fillStyle = colour;
  for (let cell of snake) {
    ctx.fillRect(cell.x * size, cell.y * size, size, size);
  }
}

function manejarInit(number) {
  numeroJugador = number;
}
//funcion para manejar el estado del juego (finalizado/en curso)
function manejarEstadoJuego(gameState) {
  if (!gameActive) {
    return;
  }
  gameState = JSON.parse(gameState);
  requestAnimationFrame(() => pintarCanvas(gameState));
}
//función que dicta que jugador es el ganador
function manejarFinJuego(data) {
  if (!gameActive) {
    return;
  }
  data = JSON.parse(data);

  gameActive = false;

  if (data.winner === numeroJugador) {
    alert('¡Has ganado!');
  } else {
    alert('Has perdido, mas suerte a la próxima');
  }
}
//funcion para manejar el codigo de la sala
function manejarCodigoJuego(gameCode) {
  displayCodigo.innerText = gameCode;
}
//funcion para manejar un código desconocido
function manejarCodigoJuegoDesc() {
  reset();
  alert('Código de juego desconocido')
}
//función para una sala con muchos jugadores
function manejarMuchosJugadores() {
  reset();
  alert('Imposible unirse a este juego');
}

function reset() {
  numeroJugador = null;
  inputCodigo.value = '';
  pantallaInicial.style.display = "block";
  pantallaJuego.style.display = "none";
}
