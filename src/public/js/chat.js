const socket = io()

let user
let chatBox = document.getElementById('chatBox')

Swal.fire({
    title: "Accediendo al chat",
    text: "Bienvenido al chat",
    allowOutsideClick: false

}).then(result => {
    user = document.getElementById('user').innerHTML
    socket.emit('showMessages')
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