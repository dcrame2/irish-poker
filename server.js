const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const axios = require("axios");

const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

const app = express();
app.use(cors());

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    // origin: "https://irishpokeronline.netlify.app",
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Joining a room
  socket.on("join_room", (data) => {
    const user = userJoin(socket.id, data.userName, data.roomId);
    socket.join(user.room);

    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  socket.on("current_index", (data) => {
    data.currentPlayerIndex =
      (data.currentPlayerIndex + 1) % data.cardData.length;
    socket.emit("receive_updatedIndex", data.currentPlayerIndex);
    socket
      .to(data.roomId)
      .emit("receive_updatedIndex", data.currentPlayerIndex);
  });

  socket.on("send_current_player", (data) => {
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

  socket.on("send_current_player_message", (data) => {
    socket.emit("receive_current_player_message", data);
  });

  socket.on("send_other_players_message", (data) => {
    socket.broadcast
      .to(data.roomId)
      .except(data.socketId)
      .emit("receive_other_players_message", data);
  });

  socket.on("send_users_to_drink", (data) => {
    socket.emit("receive_users_to_drink", data);
    socket.to(data.roomId).emit("receive_users_to_drink", data);
  });

  socket.on("start_game", (data) => {
    console.log(data.cardData, "START GAME");
    socket.emit("all_game_data", data);
    socket.to(data.roomId).emit("all_game_data", data);
  });

  socket.on("send_modal_active", (data) => {
    socket.emit("receive_modal_active", data);
    socket.to(data.roomId).emit("receive_modal_active", data);
  });

  socket.on("countdown", (data) => {
    console.log(data.countdown, "COUNTDOWN");
    socket.emit("receive_countdown", data);
    socket.to(data.roomId).emit("receive_countdown", data);
  });

  socket.on("send_reset_game", (data) => {
    console.log(data, "receive_reset_game");
    socket.emit("receive_reset_game", data);
    socket.to(data.roomId).emit("receive_reset_game", data);
  });

  socket.on("send_show_game", (data) => {
    console.log(data, "send_show_game");
    socket.emit("receive_show_game", data);
    socket.to(data.roomId).emit("receive_show_game", data);
  });

  socket.on("lockin_players", (userData) => {
    console.log(userData, "userData");
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
              console.log(data.status, "RESPONSE DATA");
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
              socket.emit("card_status_code", data.status);

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

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Express server and Socket.IO are running on port ${PORT}`);
});
