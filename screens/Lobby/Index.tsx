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

const IndividualCard = styled.div`
  min-width: 50px;
`;

const ImageOfCard = styled.img`
  width: 50px;
`;

const IndividualCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const MainButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;

const BtnContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Buttons = styled.button``;

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
  console.log(socket.id, "SOCKKETTTT");
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
      currentRound,
    });
    setGameStarted(true);
    setCardNext(true);
  };

  // Initialize state for the current round
  const [currentRound, setCurrentRound] = useState(0);

  const redOrBlackHandler = () => {
    const currentPlayerCard: SingleCard | undefined =
      allGameData?.cardData[currentPlayerIndex][currentRound];
    console.log(currentPlayerCard, "currentPlayerCard");

    if (!currentPlayerCard) {
      // Handle the case where currentPlayerCard is undefined
      return;
    }
    setSelectedCard(currentPlayerCard);

    const updatedCard: SingleCard = {
      ...currentPlayerCard,
      selectedColor: "red",
      // cardNext: false,
    };

    // Update the cardNext for the next player
    const nextPlayerIndex = (currentPlayerIndex + 1) % users.length;
    const nextPlayerCard: SingleCard =
      allGameData?.cardData[nextPlayerIndex][currentRound];

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
      currentRound,
    });

    // if (
    //   allGameData?.cardData.every(
    //     (player: Player) => player[currentRound]?.cardNext === true
    //   )
    // ) {
    //   socket.emit("send_current_round", {
    //     roomId,
    //     currentRound: currentRound + 1,
    //   });
    // }
  };

  const allPlayersPlayedCurrentRound = () => {
    return (
      allGameData?.cardData.every(
        (player: Player) => player[currentRound]?.cardNext === false
      ) ||
      allGameData?.cardData.every(
        (player: Player) => player[currentRound]?.selectedColor
      )
    );
  };

  // const redOrBlackHandler = () => {
  //   const currentPlayerCard: SingleCard | undefined =
  //     allGameData?.cardData[currentPlayerIndex][currentRound - 1];

  //   if (!currentPlayerCard) {
  //     // Handle the case where currentPlayerCard is undefined
  //     return;
  //   }

  //   setSelectedCard(currentPlayerCard);

  //   const updatedCard: SingleCard = {
  //     ...currentPlayerCard,
  //     selectedColor: "red",
  //     cardNext: false,
  //   };

  //   // Update the cardNext for the next player
  //   const nextPlayerIndex = (currentPlayerIndex + 1) % users.length;
  //   const nextPlayerCard: SingleCard =
  //     allGameData?.cardData[nextPlayerIndex][currentRound - 1];

  //   const nextUpdatedCard: SingleCard = {
  //     ...nextPlayerCard,
  //     cardNext: true,
  //   };

  //   const updatedPlayerData: PlayerData = (allGameData?.cardData || []).map(
  //     (player: Player, index) =>
  //       index === currentPlayerIndex
  //         ? player.map((card, cardIndex) =>
  //             cardIndex === currentRound - 1 ? updatedCard : card
  //           )
  //         : index === nextPlayerIndex
  //         ? player.map((card, cardIndex) =>
  //             cardIndex === currentRound - 1 ? nextUpdatedCard : card
  //           )
  //         : player
  //   );

  //   socket.emit("updated_card_data", {
  //     users,
  //     roomId,
  //     cardData: updatedPlayerData,
  //   });

  //   socket.emit("current_index", {
  //     users,
  //     roomId,
  //     cardData: updatedPlayerData,
  //     currentPlayerIndex,
  //   });

  //   socket.emit("send_current_player", {
  //     roomId,
  //     isCurrentPlayer,
  //   });

  //   socket.emit("send_current_round", {
  //     roomId,
  //     currentRound,
  //   });

  //   // Move to the next round if all players have played their current round cards
  //   if (allPlayersPlayedCurrentRound()) {
  //     setCurrentRound(currentRound + 1);
  //   }
  // };

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

    socket.on(
      "receive_current_player",
      ({ isCurrentPlayer, currentRound }: any) => {
        // console.log(currentRound, "receive_current_player");
        setIsCurrentPlayer(isCurrentPlayer);
      }
    );

    if (
      allGameData?.cardData.every(
        (player: Player) => player[currentRound]?.selectedColor
      )
    ) {
      socket.emit("send_current_round", {
        roomId,
        currentRound: currentRound + 1,
      });
    }

    socket.on("receive_current_round", (data: any) => {
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
                                // <ImageOfCard src={singleCard.image} />
                                <p>{singleCard.code}</p>
                              ) : (
                                <ImageOfCard src="white_card.png" />
                              )}
                            </IndividualCard>
                          </>
                        );
                      })}
                    </CardsContainer>
                    <MainButtonsContainer>
                      {users[currentPlayerIndex].username === username &&
                        currentRound === 0 && (
                          <BtnContainer className="btn-container">
                            <Buttons onClick={redOrBlackHandler}>Red</Buttons>
                            <Buttons onClick={redOrBlackHandler}>Black</Buttons>
                          </BtnContainer>
                        )}
                      {users[currentPlayerIndex].username === username &&
                        currentRound === 1 && (
                          <BtnContainer className="btn-container">
                            <Buttons onClick={redOrBlackHandler}>Lower</Buttons>
                            <Buttons onClick={redOrBlackHandler}>
                              Higher
                            </Buttons>
                          </BtnContainer>
                        )}
                      {users[currentPlayerIndex].username === username &&
                        currentRound === 2 && (
                          <BtnContainer className="btn-container">
                            <Buttons onClick={redOrBlackHandler}>In</Buttons>
                            <Buttons onClick={redOrBlackHandler}>Out</Buttons>
                          </BtnContainer>
                        )}
                      {users[currentPlayerIndex].username === username &&
                        // allGameData?.cardData[currentPlayerIndex][currentRound]
                        //   .cardNext === true && (
                        currentRound === 3 && (
                          <BtnContainer className="btn-container">
                            <Buttons onClick={redOrBlackHandler}>Club</Buttons>
                            <Buttons onClick={redOrBlackHandler}>Spade</Buttons>
                            <Buttons onClick={redOrBlackHandler}>
                              Diamond
                            </Buttons>
                            <Buttons onClick={redOrBlackHandler}>Heart</Buttons>
                          </BtnContainer>
                        )}
                      {/* {currentRound === 4 && <p>GAME OVER</p>} */}
                    </MainButtonsContainer>
                  </IndividualCardContainer>
                </>
              );
            })
          : ""}
      </CardContainer>
      {currentRound === 4 ? (
        <p>GAME IS OVER</p>
      ) : (
        <p>Player up next: {isCurrentPlayer}</p>
      )}
    </Container>
  );
};

export default ChatPage;
