const io = require('socket.io')()

const users = {}

io.on('connection', socket => {
  socket.on('nuevoUsu', nombre => {
    users[socket.id] = nombre
    socket.broadcast.emit('usuarioConectad', nombre)
  })
  socket.on('enviarMensajeChat', message => {
    socket.broadcast.emit('mensajeChat', { message: message, nombre: users[socket.id] })
  })
  socket.on('disconnect', () => {
    socket.broadcast.emit('usuarioDesc', users[socket.id])
    delete users[socket.id]
  })
})