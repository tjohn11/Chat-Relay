const socket = io();
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const userList = document.getElementById('users');

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

socket.emit('joinRoom', { username, room});

socket.on('roomList', roomList => {
    console.log(roomList);
});

socket.on('roomUsers', ({ room, users }) => {
    displayRoom(room);
    displayUsers(users);
});

socket.on('message', message => {
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
                ${message.user}
                <span>${message.time}</span>
                <p class="text">
                ${message.text}
                </p>
            </p>
        `;
    document.getElementById('chat-messages').appendChild(div);
};

const displayRoom = room => {
    const roomName = document.getElementById('room-name');
    roomName.innerText = room;
};

const displayUsers = users => {
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
};