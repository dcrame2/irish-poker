import React, { useState } from "react";
import PlayersInLobby from "./PlayersInLobby/Index";
import { buttonType, boxShadows, h1styles, pBase } from "@/styles/Type";
import styled from "styled-components";
import CurrentPlayer from "./CurrentPlayer/Index";
import { variables } from "@/styles/Variables";
import { motion } from "framer-motion";
import { MediaQueries } from "@/styles/Utilities";
import styles from "../../../src/styles/page.module.css";

const LobbyInfoContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  /* width: 50%; */
  width: 100%;
  @media ${MediaQueries.tablet} {
    width: 100%;
  }
  @media ${MediaQueries.mobile} {
    width: 100%;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;
`;

const GameButtonContainer = styled.div`
  background-color: ${variables.color1};
  border-radius: 12px;
  margin: 0 12px;
  position: relative;
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: center;
  min-height: 100px;
  margin-top: 20px;
  ${boxShadows}
`;

const Button = styled.button`
  ${buttonType}
  display: flex;
  align-items: center;
`;

const OtherPlayersStartingGameMessage = styled.div`
  background-color: ${variables.color1};
  border-radius: 12px;
  margin: 0 12px;
  position: relative;
  display: flex;
  gap: 20px;
  padding: 12px 24px;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  ${boxShadows}
`;

const Message = styled.div`
  text-align: center;
`;

const IrishPoker = styled.h1`
  ${h1styles}
`;

const DrinkingGame = styled.p`
  ${pBase}
  text-align: center;
`;
function LobbyInfo({
  gameStarted,
  users,
  usersLockedIn,
  lockInPlayersHandler,
  startGameHandler,
  username,
  roomId,
  socket,
  playerData,
  showSpinner,
}: any) {
  const motionProps = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
    },
    exit: {
      opacity: 0,
    },
    transition: {
      duration: 0.8,
    },
  };
  return (
    <LobbyInfoContainer {...motionProps}>
      {!gameStarted && (
        <>
          <HeaderContainer>
            <DrinkingGame>Drinking Game 🍻</DrinkingGame>
            <IrishPoker>Irish Poker</IrishPoker>
          </HeaderContainer>
          <CurrentPlayer users={users} username={username} roomId={roomId} />
          <PlayersInLobby users={users} />
          {users[0]?.username === username ? (
            <GameButtonContainer>
              {playerData === undefined ? (
                <>
                  <Button onClick={lockInPlayersHandler}>
                    {!showSpinner ? (
                      "Lock in Players"
                    ) : (
                      <>
                        Lock in Players
                        <div className={styles.loading_spinner}></div>
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={startGameHandler}>Start Game</Button>
                </>
              )}
            </GameButtonContainer>
          ) : (
            <OtherPlayersStartingGameMessage>
              <Message>
                {users[0]?.username} will start the game when all players are
                here
              </Message>
            </OtherPlayersStartingGameMessage>
          )}
        </>
      )}
    </LobbyInfoContainer>
  );
}

export default LobbyInfo;
