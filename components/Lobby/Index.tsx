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
import GameNotifications from "../Game/GameNotifications/Index";

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
  /* border: 2px solid ${variables.color1}; */
  width: 100%;
  display: grid;
  grid-template-columns: 360px 880fr;
  @media ${MediaQueries.mobile} {
    grid-template-columns: unset;
    /* display: flex; */
    /* flex-direction: column-reverse;
    justify-content: flex-end; */
  }
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

  const [confirmedUsersToDrink, setConfirmedUsersToDrink] = useState(false);

  const [countdown, setCountdown] = useState(5);

  const [activeModal, setActiveModal] = useState(true);

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
    setUsersToDrink((prevUsersToDrink) => [...(prevUsersToDrink ?? []), user]);
  };

  const confirmWhoDrinksHandler = () => {
    // console.log(usersToDrink);
    socket.emit("send_users_to_drink", {
      roomId,
      usersToDrink,
      activeModal: true,
      confirmedUsersToDrink: true,
    });

    setActiveModal(false);
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
      // console.log(data, "receive_current_player_message");
      setBooleanMessage(data.selectionMessage);
      setButtonsTrue(data.buttonsTrue);

      setCurrentUserMessageTrue(data.currentUsersMessageTrue);
      setCurrentUsersMessageFalse(data.currentUsersMessageFalse);
      setOtherUsersMessageTrue(data.otherUsersMessageTrue);
    });

    socket.on("receive_other_players_message", (data: any) => {
      // console.log(data, "receive_other_players_message");
      setBooleanMessage(data.selectionMessage);
      setButtonsTrue(data.buttonsTrue);

      setOtherUsersMessageTrue(data.otherUsersMessageTrue);
      setCurrentUsersMessageFalse(data.currentUsersMessageFalse);
      setCurrentUserMessageTrue(data.currentUsersMessageTrue);
    });

    socket.on("receive_users_to_drink", (data: any) => {
      // console.log(data, "receive_users_to_drink");
      setUsersToDrink(data.usersToDrink);
      setCurrentUserMessageTrue("");
      setOtherUsersMessageFalse("");
      setOtherUsersMessageTrue("");
      setCurrentUsersMessageFalse("");
      setButtonsTrue(false);
      setActiveModal(data.activeModal);
      setConfirmedUsersToDrink(data.confirmedUsersToDrink);
    });

    socket.on("receive_modal_active", (data: any) => {
      setActiveModal(data.activeModal);
    });

    setIsCurrentPlayer(users[currentPlayerIndex]?.username);

    const timer = setTimeout(() => {
      if (booleanMessage === false) {
        setActiveModal(false);
      }
      if (usersToDrink !== undefined && confirmedUsersToDrink) {
        setActiveModal(false);
        setConfirmedUsersToDrink(false);
        setUsersToDrink(undefined);
      }
    }, 5000);

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

  return (
    <MainContainer>
      <MainInnerContainer>
        {/* <Chat
          socket={socket}
          username={username}
          roomId={roomId}
          users={users}
        /> */}
        <FullGameContainer>
          {/* <Header>
            Lobby for Room id: <b>{roomId}</b>
          </Header> */}
          {!gameStarted && (
            <LobbyInfo
              roomId={roomId}
              gameStarted={gameStarted}
              users={users}
              usersLockedIn={usersLockedIn}
              startGameHandler={startGameHandler}
              lockInPlayersHandler={lockInPlayersHandler}
              username={username}
              socket={socket}
            />
          )}
          {gameStarted && (
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
          )}
          <GameNotifications
            booleanMessage={booleanMessage}
            activeModal={activeModal}
            socket={socket}
            currentUsersMessageTrue={currentUsersMessageTrue}
            otherUsersMessageTrue={otherUsersMessageTrue}
            users={users}
            buttonsTrue={buttonsTrue}
            whoDrinksHandler={whoDrinksHandler}
            confirmWhoDrinksHandler={confirmWhoDrinksHandler}
            usersToDrink={usersToDrink}
            currentUsersMessageFalse={currentUsersMessageFalse}
            username={username}
            confirmedUsersToDrink={confirmedUsersToDrink}
          />
        </FullGameContainer>
      </MainInnerContainer>
    </MainContainer>
  );
};

export default GameLobby;
