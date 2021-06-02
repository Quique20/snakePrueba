const io = require('socket.io')();
const { initGame, gameLoop, velocidadActualizada } = require('./game');
const { FRAME_RATE } = require('./constants');
const { makeid } = require('./utils');

const estado = {};
const salasCliente = {};

io.on('connection', client => {

  client.on('keydown', manejarKeydown);
  client.on('newGame', manejarNuevoJuego);
  client.on('joinGame', manejarUnirseJuego);

  function manejarUnirseJuego(Nombresala) {
    const sala = io.sockets.adapter.salas[Nombresala];

    let usuarios;
    if (sala) {
      usuarios = sala.sockets;
    }

    let numClients = 0;
    if (usuarios) {
      numClients = Object.keys(usuarios).length;
    }

    if (numClients === 0) {
      client.emit('codigoDesc');
      return;
    } else if (numClients > 1) {
      client.emit('muchosJugadores');
      return;
    }

    salasCliente[client.id] = Nombresala;

    client.join(Nombresala);
    client.number = 2;
    client.emit('init', 2);
    
    intervalJuego(Nombresala);
  }

  function manejarNuevoJuego() {
    let Nombresala = makeid(5);
    salasCliente[client.id] = Nombresala;
    client.emit('gameCode', Nombresala);

    estado[Nombresala] = initGame();

    client.join(Nombresala);
    client.number = 1;
    client.emit('init', 1);
  }

  function manejarKeydown(keyCode) {
    const Nombresala = salasCliente[client.id];
    if (!Nombresala) {
      return;
    }
    try {
      keyCode = parseInt(keyCode);
    } catch(e) {
      console.error(e);
      return;
    }

    const vel = velocidadActualizada(keyCode);

    if (vel) {
      estado[Nombresala].players[client.number - 1].vel = vel;
    }
  }
});

function intervalJuego(Nombresala) {
  const intervalId = setInterval(() => {
    const ganador = gameLoop(estado[Nombresala]);
    
    if (!ganador) {
      emitEstado(Nombresala, state[Nombresala])
    } else {
      emitGameOver(Nombresala, ganador);
      estado[Nombresala] = null;
      clearInterval(intervalId);
    }
  }, 1000 / FRAME_RATE);
}

function emitEstado(sala, gameState) {
  io.sockets.in(sala)
    .emit('gameState', JSON.stringify(gameState));
}

function emitGameOver(sala, ganador) {
  io.sockets.in(sala)
    .emit('gameOver', JSON.stringify({ ganador }));
}

io.listen(process.env.PORT || 3000);
