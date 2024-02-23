"use client";
import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import Chat from "../Chat";
import { variables } from "@/styles/Variables";
import { buttonType, h2styles, pLarge, pSmall, h1styles } from "@/styles/Type";
import { MediaQueries } from "@/styles/Utilities";
import FullGame from "../Game/FullGame/Index";
import LobbyInfo from "./LobbyInfo/Index";
import GameNotifications from "../Game/GameNotifications/Index";
import Menu from "../Menu/Index";

const Player = styled.div`
  ${pSmall}
`;

const IrishPoker = styled.h1`
  ${h1styles}
  position: relative;
  z-index: 1001;
`;

const MainContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 60px;
  /* background-color: ${variables.darkGreen}; */
  height: 100dvh;
  /* widows: 100vw; */
  position: relative;
  z-index: 9;
`;

const MainInnerContainer = styled.div`
  width: 100%;
  display: grid;
  /* grid-template-columns: 360px 880fr; */
  @media ${MediaQueries.mobile} {
    grid-template-columns: unset;
  }
`;

const FullGameContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const HamburgerContainer = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${variables.darkGreen};
  width: 50px;
  height: 50px;
  border-radius: 50%;
  position: absolute;
  top: 12px;
  left: 12px;
  border: none;
  z-index: 19;
`;

const HamburgerIcon = styled.img`
  width: 30px;
  height: 30px;
`;

const MessageIconContainer = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${variables.darkGreen};
  width: 50px;
  height: 50px;
  border-radius: 50%;
  position: absolute;
  top: 12px;
  right: 12px;
  border: none;
  z-index: 19;
`;

const MessageIcon = styled.img`
  width: 30px;
  height: 30px;
`;

const CloverPageTransitionContainer = styled(motion.div)`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-image: url("clover.svg");
  background-repeat: no-repeat;
  background-position: right;
  background-color: ${variables.black};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  &::before {
    z-index: 1;
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.9);
  }
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

const GameLobby = ({
  socket,
  username,
  roomId,
  users,
  setUsers,
  openMenuHandler,
  showMenu,
  setShowMenu,
}: any) => {
  const [playerData, setPlayerData] = useState();
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

  const [countdown, setCountdown] = useState(7);

  const [activeModal, setActiveModal] = useState<boolean>();
  const [whoDrinksTriggered, setWhoDrinksTriggered] = useState(false);

  const [statusCode, setStatusCode] = useState(null);

  console.log(playerData, "playerData");

  // console.log(currentPlayerIndex, "currentPlayerIndex");
  console.log(currentRound, "currentRound");
  // console.log(users, "USSSSERSSS");

  const lockInPlayersHandler = () => {
    socket.emit("lockin_players", { users, roomId });
    setUsersLockedIn(true);
    setIsCurrentPlayer(users[0]?.username);
    setCurrentRound(0);
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
      currentRound: 0,
    });
    setGameStarted(true);
    setCurrentRound(0);
  };

  const whoDrinksHandler = (user: any) => {
    if (usersToDrink?.includes(user)) {
      // If the user is already in the array, remove them
      setUsersToDrink(usersToDrink?.filter((u: any) => u !== user));
    } else {
      // If the user is not in the array, add them
      setUsersToDrink((prevUsersToDrink) => [
        ...(prevUsersToDrink ?? []),
        user,
      ]);
    }
    setWhoDrinksTriggered(true);
  };

  const confirmWhoDrinksHandler = () => {
    socket.emit("send_users_to_drink", {
      roomId,
      usersToDrink,
      activeModal: true,
      confirmedUsersToDrink: true,
      countdown: 7,
    });

    setActiveModal(false);
    setButtonsTrue(false);
    setWhoDrinksTriggered(false);
  };

  useEffect(() => {
    // Clean up the socket listener

    socket.on("allPlayersCards", (playersCards: any) => {
      console.log("Received allPlayersCards data:", playersCards);
      setPlayerData(playersCards);
    });

    socket.on("card_status_code", (data: any) => {
      setStatusCode(data);
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
      allGameData?.cardData?.every(
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
      setCountdown(data.countdown);
    });

    socket.on("receive_modal_active", (data: any) => {
      setActiveModal(data.activeModal);
    });

    setIsCurrentPlayer(users[currentPlayerIndex]?.username);

    // Listen for countdown updates from the Socket.IO server
    socket.on("receive_countdown", (data: any) => {
      console.log(data.countdown, "COUNTDOWN");
      setCountdown(data.countdown);
    });

    socket.on("receive_reset_game", (data: any) => {
      setGameStarted(data.gameStarted);
      console.log(data, "receive_reset_game");
      setPlayerData(data.cardData);
      setAllGameData({
        users: data.users,
        roomId: data.roomId,
        cardData: data.cardData,
      });
      setUsers(data.users);
      setCurrentRound(data.currentRound);
      setUsersLockedIn(data.usersLockedIn);
      setCurrentPlayerIndex(data);
      // setCountdown(data.countdown);
      // setUsers(data.users);
      // setAllGameData(data.allGameData);
    });

    // Decrement the countdown every second while the modal is active
    const countdownTimer = setInterval(() => {
      if (activeModal && countdown > 0 && gameStarted) {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }
    }, 1000);

    // Handle closing the modal when countdown reaches zero
    if (countdown === 0) {
      if (booleanMessage === false) {
        setActiveModal(false);
      }
      if (
        (usersToDrink !== undefined && confirmedUsersToDrink) ||
        users.length === 1
      ) {
        setActiveModal(false);
        setConfirmedUsersToDrink(false);
        setUsersToDrink(undefined);
      }
      setCountdown(7);
    }

    return () => {
      // socket.off("receive_reset_game");
      clearInterval(countdownTimer);
      socket.off("receive_countdown");
    };
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
    gameStarted,
  ]);

  const [showChat, setShowChat] = useState(false);

  const showChatHandler = () => {
    setShowChat(true);
  };

  const backToLobbyHandler = () => {
    socket.emit("send_reset_game", {
      roomId: roomId,
      gameStarted: false,
      cardData: undefined,
      currentRound: 0,
      usersLockedIn: false,
      currentPlayerIndex: 0,
      users: users,
    });
  };

  const motionProps = {
    initial: {
      y: "0%",
    },
    animate: {
      y: "100%",
      transitionEnd: {
        y: "-100%",
      },
    },
    exit: {
      y: "0%",
      transitionEnd: {
        y: "0%",
        delay: 0.3,
      },
    },
    transition: {
      duration: 0.8,
    },
  };

  return (
    <MainContainer>
      <MainInnerContainer>
        <FullGameContainer>
          <HamburgerContainer onClick={openMenuHandler}>
            <HamburgerIcon src="hamburger-menu.svg" />
          </HamburgerContainer>
          <MessageIconContainer onClick={showChatHandler}>
            <MessageIcon src="chat_icon.svg" />
          </MessageIconContainer>
          <Chat
            socket={socket}
            username={username}
            roomId={roomId}
            users={users}
            setShowChat={setShowChat}
            showChat={showChat}
          />
          <Menu showMenu={showMenu} setShowMenu={setShowMenu} />
          <AnimatePresence mode="wait">
            {!gameStarted && (
              <LobbyInfo
                playerData={playerData}
                roomId={roomId}
                gameStarted={gameStarted}
                users={users}
                usersLockedIn={usersLockedIn}
                startGameHandler={startGameHandler}
                lockInPlayersHandler={lockInPlayersHandler}
                username={username}
                socket={socket}
                allGameData={allGameData}
              />
            )}
            {gameStarted && (
              <CloverPageTransitionContainer {...motionProps}>
                <IrishPoker>Irish Poker</IrishPoker>
                <p>Game has started</p>
              </CloverPageTransitionContainer>
            )}
            {gameStarted && (
              <FullGame
                backToLobbyHandler={backToLobbyHandler}
                username={username}
                users={users}
                allGameData={allGameData}
                currentPlayerIndex={currentPlayerIndex}
                currentRound={currentRound}
                isCurrentPlayer={isCurrentPlayer}
                socket={socket}
                roomId={roomId}
                countdown={countdown}
                setGameStarted={setGameStarted}
                setCurrentRound={setCurrentRound}
                setPlayerData={setPlayerData}
                setUsersLockedIn={setUsersLockedIn}
                setCurrentPlayerIndex={setCurrentPlayerIndex}
                setUsers={setUsers}
                setAllGameData={setAllGameData}
                activeModal={activeModal}
              />
            )}
          </AnimatePresence>
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
            countdown={countdown}
            whoDrinksTriggered={whoDrinksTriggered}
          />
        </FullGameContainer>
      </MainInnerContainer>
    </MainContainer>
  );
};

export default GameLobby;
