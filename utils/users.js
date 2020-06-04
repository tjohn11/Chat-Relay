let users = [];

const getCurrentUser = userID =>  {
    const currentUser = users.find(user => user.id === userID);
    return currentUser;
};

const currentRoomUsers = room => {
    return users.filter(user => user.room === room);
}

const joinRoom = (id, username, room) => {
    const user = { id, username, room };
    users.push(user);
    return user;
};

const leaveRoom = userid => {
    const index = users.findIndex(user => user.id === userid);
    if (index !== -1) return users.splice(index, 1)[0];
};


module.exports = {
    getCurrentUser,
    currentRoomUsers,
    joinRoom,
    leaveRoom
};