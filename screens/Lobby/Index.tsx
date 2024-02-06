"use client";
import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import Chat from "../../components/Chat";
import { Container } from "../../src/styles/Utilities";
import { convertToNum } from "../../utils/users";
import { variables } from "@/styles/Variables";
import { buttonType, h2styles, pSmall, inputType, pLarge } from "@/styles/Type";

const MainContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 60px;
  height: 100vh;
  widows: 100vw;
`;

const MainInnerContainer = styled.div`
  border: 2px solid ${variables.color1};
  width: 100%;
  display: grid;
  grid-template-columns: 360px 880fr;
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

// const IndividualCardContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 20px;
//   /* position: absolute; */
// `;

const MainButtonsContainer = styled.div`
  display: flex;
  /* justify-content: space-between; */
  /* height: 100%; */
  gap: 10px;
`;

const BtnContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 24px;
  position: absolute;
  bottom: 0;
`;

const Buttons = styled.button``;

const CardsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  /* display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 10px; */
`;

const Message = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 600px;
  align-items: center;
  justify-content: center;
`;

const Header = styled.h2`
  ${h2styles}
  text-align: center;
  border-bottom: 2px solid ${variables.color1};
  text-transform: uppercase;
`;

const PlayersContainer = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  /* height: 100%; */
`;

const Player = styled.div`
  ${pSmall}
`;

const Button = styled.button`
  ${buttonType}
`;

const GameButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;

const PlayerContainer = styled.div`
  margin-top: 20px;
  width: 120px;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const CloverIcon = styled.img`
  width: 40px;
  height: 40px;
`;

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  /* position: relative; */
`;

const CurrentPlayerCard = styled(IndividualCard)`
  z-index: 1;
  /* transform: scale(1.4); */
  /* margin-top: 200px; */
  //
`;

const OtherPlayersCard = styled(IndividualCard)`
  opacity: 0.5;
`;

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

const GameLobby = ({ socket, username, roomId, users }: any) => {
  const [playerData, setPlayerData] = useState([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

  const [allGameData, setAllGameData] = useState<GameData | undefined>();
  const [isCurrentPlayer, setIsCurrentPlayer] = useState();

  const [usersLockedIn, setUsersLockedIn] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  // Initialize state for the current round
  const [currentRound, setCurrentRound] = useState(0);

  const [booleanMessage, setBooleanMessage] = useState(false);
  const [buttonsTrue, setButtonsTrue] = useState(false);

  const [currentUsersMessageTrue, setCurrentUserMessageTrue] = useState("");
  const [currentUsersMessageFalse, setCurrentUsersMessageFalse] = useState("");
  const [otherUsersMessageTrue, setOtherUsersMessageTrue] = useState("");
  const [otherUsersMessageFalse, setOtherUsersMessageFalse] = useState("");
  const [usersToDrink, setUsersToDrink] = useState<any[]>();

  const [countdown, setCountdown] = useState(5);

  const otherPlayers = users?.filter(
    (user: any) => user?.username !== username
  );

  const currentPlayer = users?.filter(
    (user: any) => user?.username === username
  );

  const lockInPlayersHandler = () => {
    socket.emit("lockin_players", { users, roomId });
    setUsersLockedIn(true);
    setIsCurrentPlayer(users[0]?.username);
  };

  const startGameHandler = () => {
    socket.emit("start_game", {
      users,
      roomId,
      cardData: playerData,
      gameStarted: true,
    });
    socket.emit("send_current_player", {
      roomId,
      isCurrentPlayer,
      currentRound,
    });
    setGameStarted(true);
  };

  const gameLogicHandler = (option: string) => {
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

    socket.emit("send_current_player_message", {
      roomId,
      selectionMessage,
      currentUsersMessageTrue: `
      CORRECT!
      ${
        card?.player
      } guessed ${option}! The card was a: ${card?.value.toLowerCase()} of ${card?.suit.toLowerCase()}`,
      currentUsersMessageFalse: `${isCurrentPlayer} was incorrect and is drinking!`,
    });

    socket.emit("send_other_players_message", {
      roomId,
      selectionMessage,
      otherUsersMessageTrue: `One moment...${isCurrentPlayer} is choosing who drinks`,
      otherUsersMessageFalse: `${isCurrentPlayer} was incorrect and is drinking!`,
      currentUsersMessageTrue: `
      CORRECT!
      ${
        card?.player
      } guessed ${option}! The card was a: ${card?.value.toLowerCase()} of ${card?.suit.toLowerCase()}`,
    });

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

  let usersToDrinkArr: any = [];
  const whoDrinksHandler = (user: any) => {
    usersToDrinkArr.push(user);
    setUsersToDrink((prevUsersToDrink) => [
      ...(prevUsersToDrink ?? []), // Ensure prevUsersToDrink is an array
      user,
    ]);
    console.log(usersToDrinkArr, "USERS TO DRINK");
  };

  const confirmWhoDrinksHandler = () => {
    console.log(usersToDrink);
    socket.emit("send_users_to_drink", {
      roomId,
      usersToDrink,
    });
    setButtonsTrue(false);
  };

  useEffect(() => {
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
      setGameStarted(gameData.gameStarted);
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

    socket.on("receive_current_player_message", (data: any) => {
      console.log(data, "receive_current_player_message");
      setBooleanMessage(data.selectionMessage);
      setCurrentUserMessageTrue(data.currentUsersMessageTrue);
      setCurrentUsersMessageFalse(data.currentUsersMessageFalse);
      setButtonsTrue(true);
    });

    socket.on("receive_other_players_message", (data: any) => {
      console.log(data, "receive_other_players_message");
      setOtherUsersMessageTrue(data.otherUsersMessageTrue);
      setOtherUsersMessageFalse(data.otherUsersMessageFalse);
      setBooleanMessage(data.selectionMessage);
      setCurrentUserMessageTrue(data.currentUsersMessageTrue);
    });

    socket.on("receive_users_to_drink", (data: any) => {
      console.log(data, "receive_users_to_drink");
      setUsersToDrink(data);
      setCurrentUserMessageTrue("");
      setOtherUsersMessageFalse("");
      setOtherUsersMessageTrue("");
      setCurrentUsersMessageFalse("");
      setButtonsTrue(false);
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
    currentUsersMessageTrue,
    setCurrentUsersMessageFalse,
    setOtherUsersMessageTrue,
    setOtherUsersMessageFalse,
    usersToDrink,
    buttonsTrue,
    countdown,
  ]);

  const ref = useRef(null);

  return (
    <MainContainer>
      <MainInnerContainer>
        <Chat
          socket={socket}
          username={username}
          roomId={roomId}
          users={users}
        />
        <CardContainer>
          <Header>
            Lobby for Room id: <b>{roomId}</b>
          </Header>
          {!gameStarted && (
            <PlayersContainer className="container">
              {users.map(
                (user: { id: string; username: string; room: string }) => {
                  return (
                    <PlayerContainer className="item">
                      <CloverIcon src="vercel.svg" alt="clover" />
                      <Player>{user.username} </Player>
                    </PlayerContainer>
                  );
                }
              )}
            </PlayersContainer>
          )}
          {!gameStarted && (
            <GameButtonContainer>
              {users.length > 0 && !usersLockedIn && !gameStarted ? (
                <Button onClick={lockInPlayersHandler}>Lock in players</Button>
              ) : (
                <Button onClick={startGameHandler}>Start Game</Button>
              )}
            </GameButtonContainer>
          )}
          <GameContainer>
            {allGameData
              ? allGameData?.cardData.map(
                  (player: Player, playerIndex: number) => {
                    const CardComponent =
                      currentPlayerIndex === playerIndex
                        ? CurrentPlayerCard
                        : OtherPlayersCard;

                    return (
                      <CardsContainer ref={ref}>
                        <p>{player[playerIndex].player}</p>
                        {player.map((singleCard: SingleCard, index: number) => {
                          return (
                            <>
                              <CardComponent key={`player-${index}`}>
                                {singleCard.selectedOption ? (
                                  // <ImageOfCard
                                  //   key={`${singleCard.selectedOption}-${singleCard.image}`}
                                  //   initial={{
                                  //     opacity: 0,
                                  //     rotateX: 360,
                                  //     rotateY: 720,
                                  //     scale: 0,
                                  //   }}
                                  //   animate={{
                                  //     rotateX: 0,
                                  //     opacity: 1,
                                  //     rotateY: 0,
                                  //     scale: 1,
                                  //   }}
                                  //   transition={{
                                  //     duration: `0.8`,
                                  //     ease: "easeInOut",
                                  //   }}
                                  //   src={singleCard.image}
                                  // />
                                  <p>{singleCard.code}</p>
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
                                    src="white_card.png"
                                  />
                                )}
                              </CardComponent>
                            </>
                          );
                        })}
                      </CardsContainer>
                    );
                  }
                )
              : ""}
            {allGameData && (
              <MainButtonsContainer>
                {users[currentPlayerIndex]?.username === username &&
                  currentRound === 0 && (
                    <BtnContainer className="btn-container">
                      <Button onClick={() => gameLogicHandler("red")}>
                        Red
                      </Button>
                      <Button onClick={() => gameLogicHandler("black")}>
                        Black
                      </Button>
                    </BtnContainer>
                  )}
                {users[currentPlayerIndex]?.username === username &&
                  currentRound === 1 && (
                    <BtnContainer className="btn-container">
                      <Button onClick={() => gameLogicHandler("lower")}>
                        Lower
                      </Button>
                      <Button onClick={() => gameLogicHandler("higher")}>
                        Higher
                      </Button>
                    </BtnContainer>
                  )}
                {users[currentPlayerIndex]?.username === username &&
                  currentRound === 2 && (
                    <BtnContainer className="btn-container">
                      <Button onClick={() => gameLogicHandler("in")}>In</Button>
                      <Button onClick={() => gameLogicHandler("out")}>
                        Out
                      </Button>
                    </BtnContainer>
                  )}
                {users[currentPlayerIndex]?.username === username &&
                  currentRound === 3 && (
                    <BtnContainer className="btn-container">
                      <Button onClick={() => gameLogicHandler("club")}>
                        Club
                      </Button>
                      <Button onClick={() => gameLogicHandler("spade")}>
                        Spade
                      </Button>
                      <Button onClick={() => gameLogicHandler("diamond")}>
                        Diamond
                      </Button>
                      <Button onClick={() => gameLogicHandler("heart")}>
                        Heart
                      </Button>
                    </BtnContainer>
                  )}
              </MainButtonsContainer>
            )}
          </GameContainer>

          {currentRound === 4 ? (
            <p>GAME IS OVER</p>
          ) : (
            <Message>
              {booleanMessage ? (
                <>
                  <p>{currentUsersMessageTrue}</p>
                  <p>{otherUsersMessageTrue}</p>
                  {buttonsTrue &&
                    otherPlayers?.map((player: any) => (
                      <button
                        onClick={() => whoDrinksHandler(player?.username)}
                        key={player?.id}
                      >
                        {player?.username}
                      </button>
                    ))}
                  {buttonsTrue && (
                    <button onClick={confirmWhoDrinksHandler}>
                      Confirm Players to Drinks
                    </button>
                  )}
                  {usersToDrink &&
                    usersToDrink.map((user: string, index: number) => {
                      return <p key={user}>{user}</p>;
                    })}
                </>
              ) : (
                <>
                  <p>{otherUsersMessageFalse}</p>
                </>
              )}
              {allGameData && <p>Player up next: {isCurrentPlayer}</p>}
            </Message>
          )}
        </CardContainer>
      </MainInnerContainer>
    </MainContainer>
  );
};

export default GameLobby;
