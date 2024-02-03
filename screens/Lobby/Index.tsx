"use client";
import React, { useEffect, useState, useRef } from "react";
import style from "../../src/styles/chat.module.css";
import styled from "styled-components";
import { motion } from "framer-motion";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 60px;
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const IndividualCard = styled.div`
  min-width: 50px;
`;

const ImageOfCard = styled(motion.img)`
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

const Message = styled.div`
  display: flex;
  flex-direction: column;
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
  selectedOption?: string;
  socketId: string;
  cardNext?: boolean;
};

// All the cards in the Player array
type Player = SingleCard[];
type PlayerData = {};

const ChatPage = ({ socket, username, roomId, users }: any) => {
  const [currentMsg, setCurrentMsg] = useState("");
  const [chat, setChat] = useState<IMsgDataTypes[]>([]);
  const [playerData, setPlayerData] = useState([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

  const [allGameData, setAllGameData] = useState<GameData | undefined>();
  const [isCurrentPlayer, setIsCurrentPlayer] = useState();

  const [usersLockedIn, setUsersLockedIn] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  // Initialize state for the current round
  const [currentRound, setCurrentRound] = useState(0);

  const [booleanMessage, setBooleanMessage] = useState(false);
  const [currentUsersMessage, setCurrentUsersMessage] = useState();
  const [otherUsersMessage, setOtherUsersMessage] = useState();
  const [buttonsTrue, setButtonsTrue] = useState(false);

  const otherPlayers = users?.filter(
    (user: any) => user?.username !== username
  );

  const currentPlayer = users?.filter(
    (user: any) => user?.username === username
  );

  console.log(currentPlayer, "current MF");

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
    socket.emit("start_game", { users, roomId, cardData: playerData });
    socket.emit("send_current_player", {
      roomId,
      isCurrentPlayer,
      currentRound,
    });
    setGameStarted(true);
  };

  function convertToNum(value: string) {
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

  const redOrBlackHandler = (option: string) => {
    const currentPlayerCard: SingleCard | undefined =
      allGameData?.cardData[currentPlayerIndex][currentRound];

    if (!currentPlayerCard) {
      // Handle the case where currentPlayerCard is undefined
      return;
    }

    const updatedCard: SingleCard = {
      ...((currentPlayerCard as SingleCard) || {}),
      selectedOption: option,
    };

    // Update the cardNext for the next player
    const nextPlayerIndex = (currentPlayerIndex + 1) % users.length;
    const nextPlayerCard: SingleCard | any =
      allGameData?.cardData[nextPlayerIndex][currentRound];

    const nextUpdatedCard: SingleCard | any = {
      ...nextPlayerCard,
      cardNext: true,
    };

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

    const card: Player | any =
      allGameData?.cardData[currentPlayerIndex][currentRound];
    const prevCard = allGameData?.cardData[currentPlayerIndex][0];

    const prevPrevCard = allGameData?.cardData[currentPlayerIndex][1];

    const { suit, value }: any = card || {};
    const { value: prevValue }: any = prevCard || {};
    const { value: prevPrevValue }: any = prevPrevCard || {};

    let isCorrect = false;

    switch (option) {
      case "red":
        isCorrect = suit === "HEARTS" || suit === "DIAMONDS";
        break;

      case "black":
        isCorrect = suit === "SPADES" || suit === "CLUBS";
        break;

      case "lower":
        isCorrect = convertToNum(prevValue) > convertToNum(value);
        break;

      case "higher":
        isCorrect = convertToNum(prevValue) < convertToNum(value);
        break;

      case "in":
        isCorrect =
          convertToNum(prevValue) > convertToNum(value) &&
          convertToNum(prevPrevValue) > convertToNum(value);
        break;

      case "out":
        isCorrect =
          convertToNum(prevValue) < convertToNum(value) &&
          convertToNum(prevPrevValue) < convertToNum(value);
        break;

      case "spade":
        isCorrect = suit === "SPADES";
        break;

      case "diamond":
        isCorrect = suit === "DIAMONDS";
        break;

      case "heart":
        isCorrect = suit === "HEARTS";
        break;

      case "club":
        isCorrect = suit === "CLUBS";
        break;

      default:
        break;
    }

    //TODO: need to add back some logic about the # equaling eachother

    let selectionMessage = isCorrect ? true : false;

    // Display the appropriate message based on the result
    if (isCorrect) {
      socket.emit("send_answer", {
        roomId,
        selectionMessage,
        currentUsersMessage: `
        CORRECT!
        ${isCurrentPlayer} guessed ${option}! The card was a: ${card?.value.toLowerCase()} of ${card?.suit.toLowerCase()}`,
        otherUsersMessage: `One moment...${isCurrentPlayer} is choosing who drinks`,
        buttonsTrue: true,
      });

      socket.emit("send_info_to_current_player", {});

      socket.emit("send_info_to_current_user", {});
    } else {
      socket.emit("send_answer", {
        roomId,
        selectionMessage,
        currentUsersMessage: `${isCurrentPlayer} was incorrect and is drinking!`,
        otherUsersMessage: "",
      });
    }

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
      setCurrentPlayerIndex(data);
    });

    socket.on("receive_current_player", ({ isCurrentPlayer }: any) => {
      setIsCurrentPlayer(isCurrentPlayer);
    });

    if (
      allGameData?.cardData.every(
        (player: Player) => player[currentRound]?.selectedOption
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

    socket.on("receive_answer", (data: any) => {
      console.log(data, "receive_answer");
      setBooleanMessage(data.selectionMessage);
      setCurrentUsersMessage(data.currentUsersMessage);
      setOtherUsersMessage(data.otherUsersMessage);
    });

    socket.on("receive_answer_0", (data: any) => {
      // setOtherUsersMessage(data);
      setButtonsTrue(data);
    });

    setIsCurrentPlayer(users[currentPlayerIndex]?.username);
  }, [
    socket,
    currentPlayerIndex,
    playerData,
    allGameData,
    isCurrentPlayer,
    currentRound,
    booleanMessage,
    currentUsersMessage,
    otherUsersMessage,
  ]);

  const ref = useRef(null);

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
                    <CardsContainer ref={ref}>
                      {player.map((singleCard: SingleCard, index: number) => {
                        return (
                          <>
                            {/* allGameData?.cardData[0][0].images.png */}

                            <IndividualCard key={`player-${index}`}>
                              {singleCard.selectedOption ? (
                                <ImageOfCard
                                  key={`${singleCard.selectedOption}-${singleCard.image}`}
                                  initial={{
                                    opacity: 0,
                                    rotateX: 360,
                                    rotateY: 720,
                                    scale: 0,
                                  }}
                                  animate={{
                                    rotateX: 0,
                                    opacity: 1,
                                    rotateY: 0,
                                    scale: 1,
                                  }}
                                  transition={{
                                    duration: `0.8`,
                                    ease: "easeInOut",
                                  }}
                                  src={singleCard.image}
                                />
                              ) : (
                                <ImageOfCard
                                  key={`default-${singleCard.code}`}
                                  initial={{
                                    opacity: 0,
                                    rotateX: 180,
                                    rotateY: 360,
                                    scale: 0,
                                  }}
                                  animate={{
                                    rotateX: 0,
                                    opacity: 1,
                                    rotateY: 0,
                                    scale: 1,
                                  }}
                                  transition={{
                                    duration: `0.5`,
                                    ease: "easeInOut",
                                  }}
                                  src="green_card.png"
                                />
                              )}
                            </IndividualCard>
                          </>
                        );
                      })}
                    </CardsContainer>
                  </IndividualCardContainer>
                </>
              );
            })
          : ""}
        <MainButtonsContainer>
          {users[currentPlayerIndex]?.username === username &&
            currentRound === 0 && (
              <BtnContainer className="btn-container">
                <Buttons onClick={() => redOrBlackHandler("red")}>Red</Buttons>
                <Buttons onClick={() => redOrBlackHandler("black")}>
                  Black
                </Buttons>
              </BtnContainer>
            )}
          {users[currentPlayerIndex]?.username === username &&
            currentRound === 1 && (
              <BtnContainer className="btn-container">
                <Buttons onClick={() => redOrBlackHandler("lower")}>
                  Lower
                </Buttons>
                <Buttons onClick={() => redOrBlackHandler("higher")}>
                  Higher
                </Buttons>
              </BtnContainer>
            )}
          {users[currentPlayerIndex]?.username === username &&
            currentRound === 2 && (
              <BtnContainer className="btn-container">
                <Buttons onClick={() => redOrBlackHandler("in")}>In</Buttons>
                <Buttons onClick={() => redOrBlackHandler("out")}>Out</Buttons>
              </BtnContainer>
            )}
          {users[currentPlayerIndex]?.username === username &&
            currentRound === 3 && (
              <BtnContainer className="btn-container">
                <Buttons onClick={() => redOrBlackHandler("club")}>
                  Club
                </Buttons>
                <Buttons onClick={() => redOrBlackHandler("spade")}>
                  Spade
                </Buttons>
                <Buttons onClick={() => redOrBlackHandler("diamond")}>
                  Diamond
                </Buttons>
                <Buttons onClick={() => redOrBlackHandler("heart")}>
                  Heart
                </Buttons>
              </BtnContainer>
            )}
        </MainButtonsContainer>
      </CardContainer>
      {currentRound === 4 ? (
        <p>GAME IS OVER</p>
      ) : (
        <Message>
          {booleanMessage ? (
            <>
              <h1>HIIIIIII</h1>

              <p>{currentUsersMessage}</p>
              {buttonsTrue &&
                otherPlayers?.map((player: any) => (
                  // onClick={() => handleButtonClick(player.id)}
                  <button key={player?.id}>{player?.username}</button>
                ))}
              <p>{otherUsersMessage}</p>
            </>
          ) : (
            <>
              <p>{currentUsersMessage}</p>
              <p>{otherUsersMessage}</p>
            </>
          )}

          <p>Player up next: {isCurrentPlayer}</p>
        </Message>
      )}
    </Container>
  );
};

export default ChatPage;
