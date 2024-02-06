const users = [];

// Join user to chat
function userJoin(id, username, room) {
  const user = {
    id,
    username,
    room,
  };

  users.push(user);

  return user;
}

// Get current user
function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

// User leaves chat
function userLeave(id) {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get room users
function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}

function convertToNum(value) {
  if (value === "ACE") {
    return 14;
  } else if (value === "KING") {
    return 13;
  } else if (value === "QUEEN") {
    return 12;
  } else if (value === "JACK") {
    return 11;
  } else {
    return Number(value);
  }
}

module.exports = {
  convertToNum,
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
};
