import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { MediaQueries } from "@/styles/Utilities";
import { variables } from "@/styles/Variables";
import { buttonType, h2styles, h3styles, pLarge, pSmall } from "@/styles/Type";
import { convertToNum } from "../../../utils/users";
import AllCards from "./AllCards/Index";

interface PlayerAndCardContainerProps {
  isCurrentPlayer: string;
  username: string;
}

const GameContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${variables.darkGreen};
`;

const GameInnerContainer = styled.div`
  position: relative;
  display: flex;
  border-radius: 120px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80%;
  width: 90%;
  border: 25px solid ${variables.black};
  background-color: ${variables.middleGreen};
`;

const PlayerAndCardContainer = styled.div<PlayerAndCardContainerProps>`
  display: flex;
  flex-direction: row;
  gap: 50px;
  margin-bottom: 30px;
  background-color: ${(props) =>
    props?.isCurrentPlayer === props?.username
      ? " rgba(255, 255, 255, 0.238)"
      : "transparent"};
  padding: 12px;
  transition: all 1.5s ease-in 0.5s;
  border-radius: 6px;
  transform: ${(props) =>
    props?.isCurrentPlayer === props?.username ? "scale(1.3)" : "scale(1)"};

  @media ${MediaQueries.mobile} {
    gap: 18px;
    padding: 8px;
    transform: ${(props) =>
      props?.isCurrentPlayer === props?.username ? "scale(1.1)" : "scale(1)"};
  }
`;

const PlayerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const CloverIcon = styled.img`
  width: 50px;
  height: 50px;
  padding: 6px;
  border-radius: 50%;
  border: 1px solid white;
  @media ${MediaQueries.mobile} {
    width: 30px;
    height: 30px;
    padding: 6px;
  }
`;

const PlayerUpNext = styled.p`
  /* ${pLarge} */
  /* padding: 30px 0 50px; */
  /* margin-top: 8px; */
  display: flex;
  justify-content: center;
  padding: 4px 8px;
  align-items: center;
  gap: 8px;
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

const Player = styled.div`
  ${pSmall}
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
  roomId,
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
          }</span> guessed <span class="option">${option}</span>! The card was a:  <span class="value">${card?.value.toLowerCase()}</span> of <span class="suit">${card?.suit.toLowerCase()}</span>`,
      currentUsersMessageFalse: `<span class="player">
      ${
        card?.player
      }</span> guessed <span class="option">${option}</span>! The card was a:  <span class="value">${card?.value.toLowerCase()}</span> of <span class="suit">${card?.suit.toLowerCase()}</span> <div class="message-container">${isCurrentPlayer} was incorrect and is drinking!</div>`,
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
      }</span> guessed <span class="option">${option}</span>! The card was a:  <span class="value">${card?.value.toLowerCase()}</span> of <span class="suit">${card?.suit.toLowerCase()}</span> <div class="message-container">${isCurrentPlayer} was incorrect and is drinking!</div>!`,
      currentUsersMessageTrue: `
      <span class="player">
      ${
        card?.player
      }</span> guessed <span class="option">${option}</span>! The card was a:  <span class="value">${card?.value.toLowerCase()}</span> of <span class="suit">${card?.suit.toLowerCase()}</span>`,
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
  };

  return (
    <GameContainer>
      {allGameData && <PlayerUpNext>{isCurrentPlayer} turn</PlayerUpNext>}
      <GameInnerContainer>
        {allGameData &&
          allGameData?.cardData.map((player: Player, playerIndex: number) => {
            return (
              <PlayerAndCardContainer
                isCurrentPlayer={isCurrentPlayer}
                username={player[playerIndex].player}
                key={`player-${playerIndex}`}
              >
                <PlayerContainer className="item">
                  <CloverIcon src="clover.svg" alt="clover" />
                  <Player>{player[playerIndex].player} </Player>
                </PlayerContainer>
                <AllCards player={player} />
              </PlayerAndCardContainer>
            );
          })}

        {currentRound === 4 && <p>GAME IS OVER</p>}
      </GameInnerContainer>
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
