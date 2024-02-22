const socket = io()

let user
let chatBox = document.getElementById('chatBox')

Swal.fire({
    title: "Acceder al chat",
    input: "text",
    text: "Ingresa un nombre para acceder al chat",
    inputValidator: (value) => {
        return !value && "Necesitas escribir un nombre de usuario para continuar"
    },
    allowOutsideClick: false

}).then(result => {
    user = result.value
    socket.emit('showMessages')
    let title = document.getElementById('title')
    title.innerHTML = `Bienvenido al chat ${user}!`
})

chatBox.addEventListener('keyup', e => {
    if (e.key === "Enter") {
        if (chatBox.value.trim().length > 0) {
            socket.emit('message', { user: user, message: chatBox.value })
            chatBox.value = ''
        }
    }
})

sendMessage.addEventListener('click', e => {
    if (chatBox.value.trim().length > 0) {
        socket.emit('message', { user: user, message: chatBox.value })
        chatBox.value = ''
    }
})

socket.on('messageLogs', data => {
    let log = document.getElementById('messageLogs')
    let messages = ''

    data.forEach(message => {
        messages = messages + `${message.user} dice: ${message.message} </br>`
    })

    log.innerHTML = messages
})