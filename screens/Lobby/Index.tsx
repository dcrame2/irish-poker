"use client";
import React, { useEffect, useState } from "react";
import style from "../../src/styles/chat.module.css";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 100px;
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const IndividualCard = styled.div``;

const ImageOfCard = styled.img`
  width: 50px;
`;

const IndividualCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const CardsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
`;

interface IMsgDataTypes {
  roomId: String | number;
  user: String;
  msg: String;
  time: String;
}

interface GameData {
  users: [];
  roomId: string;
  cardData: [];
}

// Type for a Signle Card that the Card Game API give me
type SingleCard = {
  player: string;
  image: string;
  code: string;
  images: [];
  suit: string;
  value: string;
  selectedColor?: string;
  socketId: string;
  cardNext?: boolean;
};

// All the cards in the Player array
type Player = SingleCard[];
type PlayerData = {};

const ChatPage = ({ socket, username, roomId, users }: any) => {
  // console.log(socket.id, "SOCKKETTTT");
  // console.log(users, "USERS");
  const [currentMsg, setCurrentMsg] = useState("");
  const [chat, setChat] = useState<IMsgDataTypes[]>([]);

  const [playerData, setPlayerData] = useState([]);
  // console.log(playerData, "PLAYER DATA");

  const [selectedCard, setSelectedCard] = useState({});

  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0); // State to track the current player index

  const [allGameData, setAllGameData] = useState<GameData | undefined>();
  const [isCurrentPlayer, setIsCurrentPlayer] = useState();
  // playerData[0]

  const [usersLockedIn, setUsersLockedIn] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const [cardNext, setCardNext] = useState(false);

  // const [gameStarted, setGameStarted] = useState(false);
  const sendData = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentMsg !== "") {
      const msgData: IMsgDataTypes = {
        roomId,
        user: username,
        msg: currentMsg,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      socket.emit("send_msg", msgData);
      setCurrentMsg("");
    }
  };

  const lockInPlayersHandler = () => {
    socket.emit("lockin_players", { users, roomId });
    setUsersLockedIn(true);
    setIsCurrentPlayer(users[0]?.username);
  };

  const startGameHandler = () => {
    // Emit card data to all players
    socket.emit("start_game", { users, roomId, cardData: playerData });
    socket.emit("send_current_player", {
      roomId,
      isCurrentPlayer,
    });
    setGameStarted(true);
    setCardNext(true);
  };

  // Initialize state for the current round
  const [currentRound, setCurrentRound] = useState(0);

  const redOrBlackHandler = () => {
    const currentPlayerCard: SingleCard | undefined =
      allGameData?.cardData[currentPlayerIndex][0];
    console.log(currentPlayerCard, "currentPlayerCard");

    if (!currentPlayerCard) {
      // Handle the case where currentPlayerCard is undefined
      return;
    }
    setSelectedCard(currentPlayerCard);

    const updatedCard: SingleCard = {
      ...currentPlayerCard,
      selectedColor: "red",
      cardNext: false,
    };

    // Update the cardNext for the next player
    const nextPlayerIndex = (currentPlayerIndex + 1) % users.length;
    const nextPlayerCard: SingleCard =
      allGameData?.cardData[nextPlayerIndex][0];

    const nextUpdatedCard: SingleCard = {
      ...nextPlayerCard,
      cardNext: true,
    };

    console.log(nextUpdatedCard, "nextUpdatedCard");

    const updatedPlayerData: PlayerData = (allGameData?.cardData || []).map(
      (player: Player, index) =>
        index === currentPlayerIndex
          ? player.map((card) =>
              card === currentPlayerCard ? updatedCard : card
            )
          : index === nextPlayerIndex
          ? player.map((card) =>
              card === nextPlayerCard ? nextUpdatedCard : card
            )
          : player
    );

    socket.emit("updated_card_data", {
      users,
      roomId,
      cardData: updatedPlayerData,
    });

    socket.emit("current_index", {
      users,
      roomId,
      cardData: updatedPlayerData,
      currentPlayerIndex,
    });

    socket.emit("send_current_player", {
      roomId,
      isCurrentPlayer,
    });
  };

  const overUnderHandler = () => {
    const currentPlayerCard: SingleCard | undefined =
      allGameData?.cardData[currentPlayerIndex][1];
    console.log(currentPlayerCard, "currentPlayerCard");

    if (!currentPlayerCard) {
      // Handle the case where currentPlayerCard is undefined
      return;
    }
    setSelectedCard(currentPlayerCard);

    const updatedCard: SingleCard = {
      ...currentPlayerCard,
      selectedColor: "red",
      cardNext: false,
    };

    // Update the cardNext for the next player
    const nextPlayerIndex = (currentPlayerIndex + 1) % users.length;
    const nextPlayerCard: SingleCard =
      allGameData?.cardData[nextPlayerIndex][1];

    const nextUpdatedCard: SingleCard = {
      ...nextPlayerCard,
      cardNext: true,
    };

    console.log(nextUpdatedCard, "nextUpdatedCard");

    const updatedPlayerData: PlayerData = (allGameData?.cardData || []).map(
      (player: Player, index) =>
        index === currentPlayerIndex
          ? player.map((card) =>
              card === currentPlayerCard ? updatedCard : card
            )
          : index === nextPlayerIndex
          ? player.map((card) =>
              card === nextPlayerCard ? nextUpdatedCard : card
            )
          : player
    );

    socket.emit("updated_card_data", {
      users,
      roomId,
      cardData: updatedPlayerData,
    });

    socket.emit("current_index", {
      users,
      roomId,
      cardData: updatedPlayerData,
      currentPlayerIndex,
    });

    socket.emit("send_current_player", {
      roomId,
      isCurrentPlayer,
    });
  };

  const inOrOutHandler = () => {
    const currentPlayerCard: SingleCard | undefined =
      allGameData?.cardData[currentPlayerIndex][2];
    console.log(currentPlayerCard, "currentPlayerCard");

    if (!currentPlayerCard) {
      // Handle the case where currentPlayerCard is undefined
      return;
    }
    setSelectedCard(currentPlayerCard);

    const updatedCard: SingleCard = {
      ...currentPlayerCard,
      selectedColor: "red",
      cardNext: false,
    };

    // Update the cardNext for the next player
    const nextPlayerIndex = (currentPlayerIndex + 1) % users.length;
    const nextPlayerCard: SingleCard =
      allGameData?.cardData[nextPlayerIndex][2];

    const nextUpdatedCard: SingleCard = {
      ...nextPlayerCard,
      cardNext: true,
    };

    console.log(nextUpdatedCard, "nextUpdatedCard");

    const updatedPlayerData: PlayerData = (allGameData?.cardData || []).map(
      (player: Player, index) =>
        index === currentPlayerIndex
          ? player.map((card) =>
              card === currentPlayerCard ? updatedCard : card
            )
          : index === nextPlayerIndex
          ? player.map((card) =>
              card === nextPlayerCard ? nextUpdatedCard : card
            )
          : player
    );

    socket.emit("updated_card_data", {
      users,
      roomId,
      cardData: updatedPlayerData,
    });

    socket.emit("current_index", {
      users,
      roomId,
      cardData: updatedPlayerData,
      currentPlayerIndex,
    });

    socket.emit("send_current_player", {
      roomId,
      isCurrentPlayer,
    });
  };

  const suitHandler = () => {
    const currentPlayerCard: SingleCard | undefined =
      allGameData?.cardData[currentPlayerIndex][3];
    console.log(currentPlayerCard, "currentPlayerCard");

    if (!currentPlayerCard) {
      // Handle the case where currentPlayerCard is undefined
      return;
    }
    setSelectedCard(currentPlayerCard);

    const updatedCard: SingleCard = {
      ...currentPlayerCard,
      selectedColor: "red",
      cardNext: false,
    };

    // Update the cardNext for the next player
    const nextPlayerIndex = (currentPlayerIndex + 1) % users.length;
    const nextPlayerCard: SingleCard =
      allGameData?.cardData[nextPlayerIndex][3];

    const nextUpdatedCard: SingleCard = {
      ...nextPlayerCard,
      cardNext: true,
    };

    console.log(nextUpdatedCard, "nextUpdatedCard");

    const updatedPlayerData: PlayerData = (allGameData?.cardData || []).map(
      (player: Player, index) =>
        index === currentPlayerIndex
          ? player.map((card) =>
              card === currentPlayerCard ? updatedCard : card
            )
          : index === nextPlayerIndex
          ? player.map((card) =>
              card === nextPlayerCard ? nextUpdatedCard : card
            )
          : player
    );

    socket.emit("updated_card_data", {
      users,
      roomId,
      cardData: updatedPlayerData,
    });

    socket.emit("current_index", {
      users,
      roomId,
      cardData: updatedPlayerData,
      currentPlayerIndex,
    });

    socket.emit("send_current_player", {
      roomId,
      isCurrentPlayer,
    });
  };

  useEffect(() => {
    socket.on("receive_msg", (data: IMsgDataTypes) => {
      setChat((pre) => [...pre, data]);
    });

    socket.on("allPlayersCards", (playersCards: []) => {
      console.log("Received allPlayersCards data:", playersCards);
      setPlayerData(playersCards);
    });

    socket.on("receive_updated_card_data", (updatedPlayersCards: []) => {
      console.log(updatedPlayersCards, "updatedPlayersCards");
      setAllGameData({ users, roomId, cardData: updatedPlayersCards });
    });

    socket.on("allGameData", (gameData: any) => {
      setAllGameData(gameData);
    });

    socket.on("receive_updatedIndex", (data: number) => {
      // console.log(data, "receive_updatedIndex");
      setCurrentPlayerIndex(data);
    });

    socket.on("receive_current_player", (data: any) => {
      // console.log(data, "receive_current_player");
      setIsCurrentPlayer(data);
    });

    socket.on("receive_current_round", (data: any) => {
      console.log(data, "receive_current_round");
      setCurrentRound(data);
    });

    setIsCurrentPlayer(users[currentPlayerIndex]?.username);
  }, [
    socket,
    currentPlayerIndex,
    playerData,
    allGameData,
    isCurrentPlayer,
    currentRound,
  ]);

  const buttonLabels = [
    ["Red", "Black"],
    ["Lower", "Higher"],
    ["In", "Out"],
    ["Club", "Spade", "Diamond", "Heart"],
  ];

  return (
    <Container className={style.chat_div}>
      <div className={style.chat_border}>
        <div style={{ marginBottom: "1rem" }}>
          <h2>In Lobby</h2>
          <p>
            Name: <b>{username}</b> and Room Id: <b>{roomId}</b>
          </p>
        </div>
        <div className="tests">
          {users.map((user: { id: string; username: string; room: string }) => {
            return <p>{user.username} </p>;
          })}
          {chat.map(({ roomId, user, msg, time }, key) => (
            <div
              key={key}
              className={
                user == username
                  ? style.chatProfileRight
                  : style.chatProfileLeft
              }
            >
              <span
                className={style.chatProfileSpan}
                style={{ textAlign: user == username ? "right" : "left" }}
              >
                {user}
              </span>
              <h3 style={{ textAlign: user == username ? "right" : "left" }}>
                {msg}
              </h3>
            </div>
          ))}
        </div>
        <div>
          <form onSubmit={(e) => sendData(e)}>
            <input
              className={style.chat_input}
              type="text"
              value={currentMsg}
              placeholder="Type your message.."
              onChange={(e) => setCurrentMsg(e.target.value)}
            />
            <button className={style.chat_button}>Send</button>
          </form>
          {users.length > 0 && !usersLockedIn ? (
            <button onClick={lockInPlayersHandler}>Continue</button>
          ) : (
            <button onClick={startGameHandler}>Start Game</button>
          )}
        </div>
      </div>

      <CardContainer>
        {allGameData
          ? allGameData.cardData.map((player: Player, playerIndex: number) => {
              return (
                <>
                  <p>{player[playerIndex].player}</p>
                  <IndividualCardContainer>
                    <CardsContainer>
                      {player.map((singleCard: SingleCard, index: number) => {
                        return (
                          <>
                            <IndividualCard key={`player-${index}`}>
                              {singleCard.selectedColor ? (
                                <ImageOfCard src={singleCard.image} />
                              ) : (
                                <ImageOfCard src="green_card.png" />
                              )}
                            </IndividualCard>
                          </>
                        );
                      })}
                    </CardsContainer>
                    <ButtonsContainer>
                      {users[currentPlayerIndex].username === username && (
                        // allGameData?.cardData[currentPlayerIndex][0]
                        //   .cardNext === true &&
                        <div className="btn-container">
                          <button onClick={redOrBlackHandler}>Red</button>
                          <button onClick={redOrBlackHandler}>Black</button>
                        </div>
                      )}
                      {users[currentPlayerIndex].username === username && (
                        // !allGameData?.cardData[currentPlayerIndex][1]
                        //   .cardNext &&
                        <div className="btn-container">
                          <button onClick={overUnderHandler}>Lower</button>
                          <button onClick={overUnderHandler}>Higher</button>
                        </div>
                      )}
                      {users[currentPlayerIndex].username === username && (
                        // !allGameData?.cardData[currentPlayerIndex][2]
                        //   .cardNext &&
                        <div className="btn-container">
                          <button onClick={inOrOutHandler}>In</button>
                          <button onClick={inOrOutHandler}>Out</button>
                        </div>
                      )}
                      {users[currentPlayerIndex].username === username && (
                        // !allGameData?.cardData[currentPlayerIndex][3]
                        //   .cardNext &&
                        <div className="btn-container">
                          <button onClick={suitHandler}>Club</button>
                          <button onClick={suitHandler}>Spade</button>
                          <button onClick={suitHandler}>Diamond</button>
                          <button onClick={suitHandler}>Heart</button>
                        </div>
                      )}
                    </ButtonsContainer>
                  </IndividualCardContainer>
                </>
              );
            })
          : ""}
      </CardContainer>
      {isCurrentPlayer && <p>Player up next: {isCurrentPlayer}</p>}
    </Container>
  );
};

export default ChatPage;

// //SAVE JUST IN CASE
// const updatedPlayerData: PlayerData = (allGameData?.cardData || []).map(
//   (player: Player, index) =>
//     index === currentPlayerIndex
//       ? player.map((card) =>
//           card === currentPlayerCard ? updatedCard : card
//         )
//       : player
// );
