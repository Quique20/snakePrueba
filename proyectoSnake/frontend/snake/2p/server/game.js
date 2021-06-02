const { GRID_SIZE } = require('./constants');
//exporta los modulos principales
module.exports = {
  initGame,
  gameLoop,
  velocidadActualizada,
}
//funcion para iniciar el juego
function initGame() {
  const estado = createGameEstado()
  randomcomida(estado);
  return estado;
}
//funcion para crear a cada jugador y su posicion
function createGameEstado() {
  return {
    jugadores: [{
      pos: {
        x: 3,
        y: 10,
      },
      vel: {
        x: 1,
        y: 0,
      },
      snake: [
        {x: 1, y: 10},
        {x: 2, y: 10},
        {x: 3, y: 10},
      ],
    }, {
      pos: {
        x: 18,
        y: 10,
      },
      vel: {
        x: 0,
        y: 0,
      },
      snake: [
        {x: 20, y: 10},
        {x: 19, y: 10},
        {x: 18, y: 10},
      ],
    }],
    comida: {},
    gridsize: GRID_SIZE,
  };
}
//funcion para genera un loop y que el juego solo termine con ciertas condiciones
function gameLoop(estado) {
  if (!estado) {
    return;
  }

  const jugadorUno = estado.jugadores[0];
  const jugadorDos = estado.jugadores[1];

  jugadorUno.pos.x += jugadorUno.vel.x;
  jugadorUno.pos.y += jugadorUno.vel.y;

  jugadorDos.pos.x += jugadorDos.vel.x;
  jugadorDos.pos.y += jugadorDos.vel.y;
  //el juego termina si el jugador se sale del canvas
  if (jugadorUno.pos.x < 0 || jugadorUno.pos.x > GRID_SIZE || jugadorUno.pos.y < 0 || jugadorUno.pos.y > GRID_SIZE) {
    return 2;
  }

  if (jugadorDos.pos.x < 0 || jugadorDos.pos.x > GRID_SIZE || jugadorDos2.pos.y < 0 || jugadorDos2.pos.y > GRID_SIZE) {
    return 1;
  }
  //si el jugador coge comida su tamaño aumentará
  if (estado.comida.x === jugadorUno.pos.x && estado.comida.y === jugadorUno.pos.y) {
    jugadorUno.snake.push({ ...jugadorUno.pos });
    jugadorUno.pos.x += jugadorUno.vel.x;
    jugadorUno.pos.y += jugadorUno.vel.y;
    randomcomida(estado);
  }

  if (estado.comida.x === jugadorDos.pos.x && estado.comida.y === jugadorDos.pos.y) {
    jugadorDos.snake.push({ ...jugadorDos.pos });
    jugadorDos.pos.x += jugadorDos.vel.x;
    jugadorDos.pos.y += jugadorDos.vel.y;
    randomcomida(estado);
  }
  //si los jugadores colisionan, el que hay a provocado la colisión perderá
  if (jugadorUno.vel.x || jugadorUno.vel.y) {
    for (let cell of jugadorUno.snake) {
      if (cell.x === jugadorUno.pos.x && cell.y === jugadorUno.pos.y) {
        return 2;
      }
    }

    jugadorUno.snake.push({ ...jugadorUno.pos });
    jugadorUno.snake.shift();
  }

  if (jugadorDos.vel.x || jugadorDos.vel.y) {
    for (let cell of jugadorDos.snake) {
      if (cell.x === jugadorDos.pos.x && cell.y === jugadorDos.pos.y) {
        return 1;
      }
    }

    jugadorDos.snake.push({ ...jugadorDos.pos });
    jugadorDos.snake.shift();
  }

  return false;
}

function randomcomida(estado) {
  comida = {
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE),
  }

  for (let cell of estado.jugadores[0].snake) {
    if (cell.x === comida.x && cell.y === comida.y) {
      return randomcomida(estado);
    }
  }

  for (let cell of estado.jugadores[1].snake) {
    if (cell.x === comida.x && cell.y === comida.y) {
      return randomcomida(estado);
    }
  }

  estado.comida = comida;
}

function velocidadActualizada(keyCode) {
  switch (keyCode) {
    case 37: { // izquierda
      return { x: -1, y: 0 };
    }
    case 38: { // abajo
      return { x: 0, y: -1 };
    }
    case 39: { // derecha
      return { x: 1, y: 0 };
    }
    case 40: { // arriba
      return { x: 0, y: 1 };
    }
  }
}
