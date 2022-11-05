const socket = io('http://localhost:3000');

socket.on('message', data => {
    console.log(data)
    appendMessages(data)
})
socket.on('output-messages', data => {
    console.log(data)
    if (data.length) {
        data.forEach(message => {
            appendMessages(message.msg)
        });
    }
})

msgForm.addEventListener('submit', e => {
    e.preventDefault()
    socket.emit('chatmessage', msgForm.msg.value)
    console.log('submit from msgfrom', msgForm.msg.value)
    msgForm.msg.value = '';


})
