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

let storedUserData;

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Joining a room
  socket.on("join_room", (data) => {
    const user = userJoin(socket.id, data.userName, data.roomId);

    console.log(`User joined ${data.roomId}: ${socket.id}`);
    socket.join(user.room);

    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });

    // socket.join(roomId);
    // console.log(`user with id-${socket.id} joined room - ${roomId}`);
  });

  socket.on("send_card_data", (data) => {
    console.log(data.cardData, "send_card_data");
    socket.to(data.roomId).emit("recieve_card_data", data);
  });

  socket.on("send_msg", (data) => {
    console.log(data, "send_msg");
    //This will send a message to a specific room ID
    socket.to(data.roomId).emit("receive_msg", data);
  });

  // Listen for the 'updateCardData' event
  socket.on("updateCardData", (data) => {
    console.log(data.updatedPlayerData, "updateCardData");
    // Broadcast the updated card data to all clients in the same room
    socket.emit("allPlayersCards", data.updatedPlayerData);
    socket
      .to(storedUserData.roomId)
      .emit("allPlayersCards", data.updatedPlayerData);
  });

  socket.on("start game", (userData) => {
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
              // console.log(allPlayersCards, "card data");

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
                    // Add a 'player' property to each object in the subarray
                    return {
                      ...obj,
                      player: `player${i + 1}_${index + 1}_${
                        userData.users[i].username
                      }`,
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
    console.log("A user disconnected:", socket.id);
  });
});

const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(`Socket.io server is running on port ${PORT}`);
});
