"use client";
import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import Chat from "../Chat";
import { variables } from "@/styles/Variables";
import { buttonType, h2styles, pLarge, pSmall } from "@/styles/Type";
import { MediaQueries } from "@/styles/Utilities";
import FullGame from "../Game/FullGame/Index";
import LobbyInfo from "./LobbyInfo/Index";

const Player = styled.div`
  ${pSmall}
`;

const MainContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 60px;
  height: 100vh;
  widows: 100vw;
  position: relative;
  z-index: 9;
`;

const MainInnerContainer = styled.div`
  border: 2px solid ${variables.color1};
  width: 100%;
  display: grid;
  grid-template-columns: 360px 880fr;
`;

const FullGameContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Header = styled.h2`
  ${h2styles}
  text-align: center;
  border-bottom: 2px solid ${variables.color1};
  text-transform: uppercase;
`;

const Button = styled.button`
  ${buttonType}
`;

const CorrectMessaging = styled(motion.div)`
  border: 3px solid ${variables.color1};
  background-color: ${variables.color2};
  padding: 16px;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 11;
  width: 60vw;
  max-width: 400px;
  max-height: 80vh;
  overflow-y: auto;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    background: #000;
    opacity: 0.5;
    z-index: -1;
  }
`;
const IncorrectMessaging = styled(motion.div)`
  border: 3px solid ${variables.color1};
  background-color: ${variables.color2};
  padding: 16px;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 11;
  width: 60vw;
  max-width: 400px;
  max-height: 80vh;
  overflow-y: auto;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    background: #000;
    opacity: 0.5;
    z-index: -1;
  }
`;

const Description = styled.p`
  ${pSmall}
`;

const HeaderForMessage = styled.p`
  ${pLarge}
`;

interface GameData {
  users: [];
  roomId: string;
  cardData: [];
}

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

type Player = SingleCard[];
type PlayerData = {};

const GameLobby = ({ socket, username, roomId, users, showChat }: any) => {
  const [playerData, setPlayerData] = useState([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

  const [allGameData, setAllGameData] = useState<GameData | undefined>();
  const [isCurrentPlayer, setIsCurrentPlayer] = useState();

  const [usersLockedIn, setUsersLockedIn] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);

  const [booleanMessage, setBooleanMessage] = useState(null);
  const [buttonsTrue, setButtonsTrue] = useState(false);

  const [currentUsersMessageTrue, setCurrentUserMessageTrue] = useState("");
  const [currentUsersMessageFalse, setCurrentUsersMessageFalse] = useState("");
  const [otherUsersMessageTrue, setOtherUsersMessageTrue] = useState("");
  const [otherUsersMessageFalse, setOtherUsersMessageFalse] = useState("");
  const [usersToDrink, setUsersToDrink] = useState<any[]>();

  const [countdown, setCountdown] = useState(5);

  const [activeModal, setActiveModal] = useState(true);

  const otherPlayers = users?.filter(
    (user: any) => user?.username !== username
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

    socket.on("all_game_data", (gameData: any) => {
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

    socket.on("receive_modal_active", (data: any) => {
      setActiveModal(data.activeModal);
      console.log(data, "receive_modal_active");
      // setActiveModal(data);
    });

    setIsCurrentPlayer(users[currentPlayerIndex]?.username);

    const timer = setTimeout(() => {
      setActiveModal(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [
    socket,
    currentPlayerIndex,
    playerData,
    allGameData,
    isCurrentPlayer,
    currentRound,
    booleanMessage,
    currentUsersMessageTrue,
    currentUsersMessageFalse,
    otherUsersMessageTrue,
    otherUsersMessageFalse,
    usersToDrink,
    buttonsTrue,
    countdown,
  ]);

  const motionProps = {
    initial: {
      opacity: 0,
      y: 200,
    },
    animate: {
      opacity: 1,
      y: 0,
    },
    exit: {
      opacity: 0,
      y: 200,
    },
    transition: {
      duration: 0.4,
    },
  };

  return (
    <MainContainer>
      <MainInnerContainer>
        <Chat
          socket={socket}
          username={username}
          roomId={roomId}
          users={users}
        />
        <FullGameContainer>
          <Header>
            Lobby for Room id: <b>{roomId}</b>
          </Header>
          <LobbyInfo
            gameStarted={gameStarted}
            users={users}
            usersLockedIn={usersLockedIn}
            startGameHandler={startGameHandler}
            lockInPlayersHandler={lockInPlayersHandler}
          />
          <FullGame
            username={username}
            users={users}
            allGameData={allGameData}
            currentPlayerIndex={currentPlayerIndex}
            currentRound={currentRound}
            isCurrentPlayer={isCurrentPlayer}
            socket={socket}
            roomId={roomId}
          />
          <AnimatePresence mode="wait">
            {booleanMessage !== null && activeModal && (
              <>
                {booleanMessage ? (
                  <CorrectMessaging key={`${socket.id}`} {...motionProps}>
                    <p>{currentUsersMessageTrue}</p>
                    <p>{otherUsersMessageTrue}</p>
                    {buttonsTrue &&
                      users.length !== 1 &&
                      otherPlayers?.map((player: any) => (
                        <Button
                          onClick={() => whoDrinksHandler(player?.username)}
                          key={player?.id}
                        >
                          {player?.username}
                        </Button>
                      ))}
                    {buttonsTrue && users.length !== 1 && (
                      <Button onClick={confirmWhoDrinksHandler}>
                        Confirm Players to Drinks
                      </Button>
                    )}
                    {usersToDrink &&
                      users.length !== 1 &&
                      usersToDrink.map((user: string, index: number) => {
                        return <p key={user}>{user}</p>;
                      })}
                  </CorrectMessaging>
                ) : (
                  <IncorrectMessaging key={`${socket.id}-1`} {...motionProps}>
                    <HeaderForMessage>Irish Poker</HeaderForMessage>
                    <Description>{otherUsersMessageFalse}</Description>
                  </IncorrectMessaging>
                )}
              </>
            )}
          </AnimatePresence>
        </FullGameContainer>
      </MainInnerContainer>
    </MainContainer>
  );
};

export default GameLobby;
