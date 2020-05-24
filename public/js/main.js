const socket = io();
const chatForm = document.getElementById('chat-form');

socket.on('message', message => {
    console.log(message);
    displayMessage(message);
});

chatForm.addEventListener('submit', submit => {
    submit.preventDefault();
    const msg = submit.target.elements.msg.value;
    socket.emit('chat message', msg);
    submit.target.elements.msg.value = '';
    submit.target.elements.msg.focus();
});

const displayMessage = message => {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML =
        `
            <p class="meta">
                <p class="text">
                ${message}
                </p>
            </p>
        `;
    document.getElementById('chat-messages').appendChild(div);
    // console.log(document.getElementById('chat-messages'));
};