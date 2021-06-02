const socket = io('https://still-wildwood-60909.herokuapp.com/')
const messageContainer = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')

const nombre = prompt('¿Cual es tu nombre?')
appendMessage('Te has unido')
socket.emit('nuevoUsu', nombre)

socket.on('mensajeChat', data => {
  appendMessage(`${data.nombre}: ${data.message}`)
})

socket.on('usuarioConectad', nombre => {
  appendMessage(`${nombre} connected`)
})

socket.on('usuarioDesc', nombre => {
  appendMessage(`${nombre} se ha desconectado`)
})

messageForm.addEventListener('submit', e => {
  e.preventDefault()
  const message = messageInput.value
  appendMessage(`Tu: ${message}`)
  socket.emit('enviarMensajeChat', message)
  messageInput.value = ''
})

function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)
}