import React, { useEffect, useState, useRef } from "react";
import styled, { keyframes, css } from "styled-components";
import { MediaQueries } from "@/styles/Utilities";
import { variables } from "@/styles/Variables";
import { buttonType, pBase, pLarge, pSmall } from "@/styles/Type";
import { convertToNum } from "../../../utils/users";
import AllCards from "./AllCards/Index";
import Chat from "../../Chat";
import { AnimatePresence, motion } from "framer-motion";

// Define a keyframe for the pulsing animation
const pulseAnimation = keyframes`
  0% {
    background-color: rgba(255, 255, 255, 0.238);
  }
  50% {
    background-color: rgba(255, 255, 255, 0.4);
  }
  100% {
    background-color: rgba(255, 255, 255, 0.238);
  }
`;

interface PlayerAndCardContainerProps {
  isCurrentPlayer: string;
  username: string;
}

const GameContainer = styled(motion.div)`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* justify-content: center; */
  /* background-color: ${variables.darkGreen}; */
  gap: 10px;
  padding-top: 20px;
`;

const GameInnerContainer = styled.div`
  position: relative;
  display: grid;
  grid-auto-columns: 1fr;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
  grid-template-areas:
    ". ."
    ". ."
    "main_user main_user"
    ". ."
    ". .";
  border-radius: 70px;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 88%;
  width: 98%;
  border: 10px solid ${variables.black};
  background-color: ${variables.middleGreen};
  background-image: url("table_bg.webp");
  background-repeat: no-repeat;
  background-size: cover;
  padding: 12px;
`;

const CurrentPlayerContainer = styled.div`
  width: 100%;
  grid-area: main_user;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: scale(1.5);
`;

const PlayerAndCardContainer = styled.div<PlayerAndCardContainerProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  background-color: ${(props) =>
    props?.isCurrentPlayer === props?.username
      ? " rgba(255, 255, 255, 0.238)"
      : "transparent"};
  padding: 12px;
  transition: all 0.5s ease-in;
  border-radius: 6px;

  ${({ isCurrentPlayer, username }) =>
    isCurrentPlayer === username &&
    css`
      animation: ${pulseAnimation} 1s infinite;
    `};
  @media ${MediaQueries.mobile} {
    gap: 8px;
    padding: 4px;
  }
`;

const Player = styled.div`
  ${pSmall}
  color: ${variables.darkGreen};
`;
const PlayerContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 4px 8px;
  align-items: center;
  gap: 8px;
  background-color: ${variables.white};
  border-radius: 16px;
  width: fit-content;
`;

const CloverIcon = styled.img`
  width: 20px;
  height: 20px;
`;

const PlayerUpNext = styled.p`
  display: flex;
  justify-content: center;
  padding: 4px 8px;
  align-items: center;
  gap: 8px;
  ${pBase}
  background-color: ${variables.white};
  border-radius: 16px;
  min-width: fit-content;
  color: ${variables.black};
`;

const MainButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
  @media ${MediaQueries.mobile} {
    position: absolute;
    bottom: 0;
    width: 100%;
    gap: unset;
  }
`;

const BtnContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 24px;
  @media ${MediaQueries.mobile} {
    width: 100%;
    gap: unset;
  }
`;

const Button = styled.button`
  ${buttonType}
  @media ${MediaQueries.mobile} {
    width: 100%;
  }
`;

const Gameover = styled(motion.div)`
  border-top: 3px solid ${variables.middleGreen};
  background-color: ${variables.color2};
  padding: 16px;
  position: fixed;
  width: 100%;
  z-index: 11;
  bottom: 0;
  overflow-y: auto;
  border-radius: 24px 24px 0 0;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  text-align: center;
  height: fit-content;
`;

const Message = styled.p`
  text-align: center;
`;

const GameoverText = styled.p`
  ${pLarge}
  margin-bottom: 10px;
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

function FullGame({
  allGameData,
  currentPlayerIndex,
  users,
  currentRound,
  isCurrentPlayer,
  username,
  socket,
  countdown,
  roomId,
  activeModal,
  backToLobbyHandler,
  statusCode,
}: any) {
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
      (player: Player, index: number) =>
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
          (convertToNum(prevValue) < convertToNum(value) &&
            convertToNum(prevPrevValue) > convertToNum(value)) ||
          (convertToNum(prevValue) > convertToNum(value) &&
            convertToNum(prevPrevValue) < convertToNum(value));
        break;

      case "out":
        isCorrect =
          (convertToNum(prevValue) > convertToNum(value) &&
            convertToNum(prevPrevValue) > convertToNum(value)) ||
          (convertToNum(prevValue) < convertToNum(value) &&
            convertToNum(prevPrevValue) < convertToNum(value));
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

    socket.emit("send_modal_active", {
      roomId,
      activeModal: true,
    });

    socket.emit("send_current_player_message", {
      roomId,
      selectionMessage,
      currentUsersMessageTrue: `
          <span class="player">
          ${
            card?.player
          }</span> guessed <span class="option">${option}</span>! <br/> The card was a:  <span class="value">${card?.value.toLowerCase()}</span> of <span class="suit">${card?.suit.toLowerCase()}</span>`,
      currentUsersMessageFalse: `<span class="player">
      ${
        card?.player
      }</span> guessed <span class="option">${option}</span>! <br/> The card was a:  <span class="value">${card?.value.toLowerCase()}</span> of <span class="suit">${card?.suit.toLowerCase()}</span> <div class="message-container">${isCurrentPlayer} was incorrect and is drinking!</div>`,
      otherUsersMessageTrue: "",
      buttonsTrue: true,
    });

    socket.emit("send_other_players_message", {
      socketId: users[currentPlayerIndex].id,
      roomId,
      selectionMessage,
      otherUsersMessageTrue: `One moment...${isCurrentPlayer} is choosing who drinks`,
      currentUsersMessageFalse: ` <span class="player">
      ${
        card?.player
      }</span> guessed <span class="option">${option}</span>! <br/> The card was a:  <span class="value">${card?.value.toLowerCase()}</span> of <span class="suit">${card?.suit.toLowerCase()}</span> <div class="message-container">${isCurrentPlayer} was incorrect and is drinking!</div>`,
      currentUsersMessageTrue: `
      <span class="player">
      ${
        card?.player
      }</span> guessed <span class="option">${option}</span>! <br/> The card was a:  <span class="value">${card?.value.toLowerCase()}</span> of <span class="suit">${card?.suit.toLowerCase()}</span>`,
      buttonsTrue: false,
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

    socket.emit("countdown", {
      roomId,
      countdown: countdown,
    });
  };

  const motionProps = {
    initial: {
      opacity: 0,
      y: "-100%",
    },
    animate: {
      opacity: 1,
      y: 0,
    },
    exit: {
      y: "-100%",
      opacity: 0,
    },
    transition: {
      duration: 0.8,
    },
  };

  return (
    <GameContainer {...motionProps}>
      {allGameData && (
        <PlayerUpNext>
          <CloverIcon src="clover.svg" alt="Clover" />
          {isCurrentPlayer}'s turn
        </PlayerUpNext>
      )}
      <GameInnerContainer>
        {allGameData && (
          <>
            {allGameData?.cardData.map(
              (player: Player, playerIndex: number) => {
                console.log(users[playerIndex]?.username, "playerIndex"); //TODO: need to adjust the loop for the players
                const index = Math.min(playerIndex, users.length);
                const user = users[index];
                const isCurrentUser: boolean = user?.username === username;
                return (
                  <React.Fragment key={`player-${playerIndex}`}>
                    {isCurrentUser ? (
                      <CurrentPlayerContainer>
                        <PlayerAndCardContainer
                          isCurrentPlayer={isCurrentPlayer}
                          username={user?.username}
                        >
                          <PlayerContainer>
                            <CloverIcon src="clover.svg" alt="clover" />
                            <Player>{user?.username}</Player>
                          </PlayerContainer>
                          <AllCards player={player} />
                        </PlayerAndCardContainer>
                      </CurrentPlayerContainer>
                    ) : (
                      <PlayerAndCardContainer
                        isCurrentPlayer={isCurrentPlayer}
                        username={user?.username}
                      >
                        <PlayerContainer>
                          <CloverIcon src="clover.svg" alt="clover" />
                          <Player>{user?.username}</Player>
                        </PlayerContainer>
                        <AllCards player={player} />
                      </PlayerAndCardContainer>
                    )}
                  </React.Fragment>
                );
              }
            )}
          </>
        )}
      </GameInnerContainer>
      <AnimatePresence mode="wait">
        {currentRound === 4 && activeModal === false && (
          <Gameover {...motionProps}>
            <GameoverText>GAME OVER</GameoverText>
            {users[0]?.username === username ? (
              <Button onClick={backToLobbyHandler}>Back to Lobby</Button>
            ) : (
              <Message>{users[0]?.username} can restart the game</Message>
            )}
          </Gameover>
        )}
      </AnimatePresence>
      {allGameData && (
        <MainButtonsContainer>
          {users[currentPlayerIndex]?.username === username &&
            currentRound === 0 && (
              <BtnContainer className="btn-container">
                <Button onClick={() => gameLogicHandler("red")}>Red</Button>
                <Button onClick={() => gameLogicHandler("black")}>Black</Button>
              </BtnContainer>
            )}
          {users[currentPlayerIndex]?.username === username &&
            currentRound === 1 && (
              <BtnContainer className="btn-container">
                <Button onClick={() => gameLogicHandler("lower")}>Lower</Button>
                <Button onClick={() => gameLogicHandler("higher")}>
                  Higher
                </Button>
              </BtnContainer>
            )}
          {users[currentPlayerIndex]?.username === username &&
            currentRound === 2 && (
              <BtnContainer className="btn-container">
                <Button onClick={() => gameLogicHandler("in")}>In</Button>
                <Button onClick={() => gameLogicHandler("out")}>Out</Button>
              </BtnContainer>
            )}
          {users[currentPlayerIndex]?.username === username &&
            currentRound === 3 && (
              <BtnContainer className="btn-container">
                <Button onClick={() => gameLogicHandler("club")}>Club</Button>
                <Button onClick={() => gameLogicHandler("spade")}>Spade</Button>
                <Button onClick={() => gameLogicHandler("diamond")}>
                  Diamond
                </Button>
                <Button onClick={() => gameLogicHandler("heart")}>Heart</Button>
              </BtnContainer>
            )}
        </MainButtonsContainer>
      )}
    </GameContainer>
  );
}

export default FullGame;
