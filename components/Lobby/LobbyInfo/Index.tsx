import React, { useState } from "react";
import PlayersInLobby from "./PlayersInLobby/Index";
import { buttonType, boxShadows, h1styles } from "@/styles/Type";
import styled from "styled-components";
import CurrentPlayer from "./CurrentPlayer/Index";
import { variables } from "@/styles/Variables";
import { motion } from "framer-motion";
import { MediaQueries } from "@/styles/Utilities";

const LobbyInfoContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  width: 50%;
  @media ${MediaQueries.mobile} {
    width: 100%;
  }
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
  /* min-height: 100px; */
  margin-top: 20px;
  ${boxShadows}
`;

const Message = styled.div`
  text-align: center;
`;

const IrishPoker = styled.h1`
  ${h1styles}
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
          <IrishPoker>Irish Poker</IrishPoker>
          <CurrentPlayer users={users} username={username} roomId={roomId} />
          <PlayersInLobby users={users} />
          {users[0]?.username === username ? (
            <GameButtonContainer>
              {
                // users.length > 0 &&
                // !usersLockedIn &&
                // !gameStarted &&
                playerData === undefined ? (
                  <>
                    <Button onClick={lockInPlayersHandler}>
                      Lock in players
                    </Button>
                  </>
                ) : (
                  <>
                    <Button onClick={startGameHandler}>Start Game</Button>
                  </>
                )
              }
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
