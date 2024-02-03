const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const axios = require("axios");

const httpServer = http.createServer();

const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000", // Replace with your frontend URL
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Joining a room
  socket.on("join_room", (data) => {
    const user = userJoin(socket.id, data.userName, data.roomId);

    // console.log(`User joined ${data.roomId}: ${socket.id}`);
    socket.join(user.room);

    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  socket.on("current_index", (data) => {
    // console.log(data, "send_card_data");
    data.currentPlayerIndex =
      (data.currentPlayerIndex + 1) % data.cardData.length;
    socket.emit("receive_updatedIndex", data.currentPlayerIndex);
    socket
      .to(data.roomId)
      .emit("receive_updatedIndex", data.currentPlayerIndex);
  });

  socket.on("send_current_player", (data) => {
    // console.log(data, "current_player");

    socket.emit("receive_current_player", data);
    socket.to(data.roomId).emit("receive_current_player", data);
  });

  socket.on("send_msg", (data) => {
    socket.to(data.roomId).emit("receive_msg", data);
  });

  socket.on("updated_card_data", (data) => {
    // console.log(data.cardData, "updateCardData");
    socket.emit("receive_updated_card_data", data.cardData);
    socket.to(data.roomId).emit("receive_updated_card_data", data.cardData);
  });

  socket.on("send_current_round", (data) => {
    socket.emit("receive_current_round", data.currentRound);
    socket.to(data.roomId).emit("receive_current_round", data.currentRound);
  });

  socket.on("send_answer", (data) => {
    console.log(data, "send_answer");

    const broadcastData = {
      otherUsersMessage: data.otherUsersMessage,
      currentUsersMessage: data.currentUsersMessage,
    };

    socket.emit("receive_answer", data);
    socket.to(data.roomId).emit("receive_answer", data);

    socket.broadcast.to(data.roomId).emit("receive_answer_0", data.buttonsTrue);
  });

  socket.on("start_game", (data) => {
    console.log(data.cardData, "START GAME");
    socket.emit("allGameData", data);
    socket.to(data.roomId).emit("allGameData", data);
  });

  socket.on("lockin_players", (userData) => {
    console.log(userData, "userData");
    storedUserData = userData;
    const url = `https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`;
    axios
      .get(url)
      .then((data) => {
        const singlePlayer = (deckId, users) => {
          axios
            .get(
              `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${
                userData.users.length * 4
              }`
            )
            .then((data) => {
              const allPlayersCardsUnorganized = data.data.cards;
              // Number of cards you want in each players hand
              let cardsPerPlayer = 4;
              // Calculate the number of subarrays needed
              let numberOfPlayers = Math.ceil(
                allPlayersCardsUnorganized.length / cardsPerPlayer
              );
              // Initialize an array to store the subarrays
              let allPlayersCards = [];
              // Loop through and create subarrays
              for (let i = 0; i < numberOfPlayers; i++) {
                let startIndex = i * cardsPerPlayer;
                let endIndex = startIndex + cardsPerPlayer;
                let singlePlayersData = allPlayersCardsUnorganized
                  .slice(startIndex, endIndex)
                  .map((obj, index) => {
                    // This will add additional information to each players casrds that I use later to display messages and control cards.
                    let isCardNext = i === 0 && index === 0;
                    return {
                      ...obj,
                      player: `${userData.users[i].username}`,
                      socketId: `${userData.users[i].id}`,
                      cardNext: isCardNext,
                    };
                  });
                allPlayersCards.push(singlePlayersData);
              }
              console.log(allPlayersCards, "allPlayersCards");

              socket.emit("allPlayersCards", allPlayersCards);
              io.to(userData.roomId).emit("allPlayersCards", allPlayersCards);
            })
            .catch((err) => {
              console.log(`error ${err}`);
            });
        };
        // Process the data and send a response back to the client
        singlePlayer(data.data.deck_id, data.users);
      })
      .catch((err) => {
        console.log(`error ${err}`);
      });
  });

  socket.on("disconnect", () => {
    socket.disconnect();
    console.log("A user disconnected:", socket.id);
  });
});

const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(`Socket.io server is running on port ${PORT}`);
});
