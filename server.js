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

    console.log(`User joined ${data.roomId}: ${socket.id}`);
    console.log(user);
    socket.join(user.room);

    // socket.join(roomId);
    // console.log(`user with id-${socket.id} joined room - ${roomId}`);
  });

  socket.on("send_msg", (data) => {
    console.log(data, "DATA");
    //This will send a message to a specific room ID
    socket.to(data.roomId).emit("receive_msg", data);
  });

  socket.on("start game", (userData) => {
    console.log(userData, "UserData");
    const url = `https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`;
    axios
      .get(url)
      .then((data) => {
        console.log(data, "MORE DATA");
        const singlePlayer = (deckId, users) => {
          axios
            .get(
              `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=4
            
              `
            )
            .then((data) => {
              console.log(data, "card data");
              // const players = getPlayersCards(data.data.cards, 4);
              // newArr = players.map((player, i) => {
              //   if (i === 0) {
              //     player.player1 = userData.users[0].id;
              //   }
              //   if (i === 1) {
              //     player.player2 = userData.users[1].id;
              //   }
              //   if (i === 2) {
              //     player.player3 = userData.users[2].id;
              //   }
              //   if (i === 3) {
              //     player.player4 = userData.users[3].id;
              //   }
              //   if (i === 4) {
              //     player.player5 = userData.users[4].id;
              //   }
              //   if (i === 5) {
              //     player.player6 = userData.users[5].id;
              //   }
              //   return player;
              // });
              // console.log(newArr);
              // console.log(userData.room);
              // io.to(userData.room).emit("result", newArr);
              // return newArr;
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

    io.to(userData.room).emit("game screen");
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3010;
httpServer.listen(PORT, () => {
  console.log(`Socket.io server is running on port ${PORT}`);
});
