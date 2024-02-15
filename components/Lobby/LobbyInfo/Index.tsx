import React, { useState } from "react";
import PlayersInLobby from "./PlayersInLobby/Index";
import { buttonType, boxShadows, h1styles } from "@/styles/Type";
import styled from "styled-components";
import { useAnimationFrame } from "framer-motion";
import CurrentPlayer from "./CurrentPlayer/Index";
import { variables } from "@/styles/Variables";
import Chat from "../../Chat";

const LobbyInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
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
  top: 15px;
  right: 15px;
  border: none;
`;

const MessageIcon = styled.img`
  width: 30px;
  height: 30px;
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

const Logo = styled.img`
  width: 100%;
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
  return (
    <LobbyInfoContainer>
      {!gameStarted && (
        <>
          <IrishPoker>Irish Poker</IrishPoker>
          <CurrentPlayer users={users} username={username} roomId={roomId} />
          <PlayersInLobby users={users} />
          {users[0]?.username === username ? (
            <GameButtonContainer>
              {users.length > 0 &&
              !usersLockedIn &&
              !gameStarted &&
              playerData !== null ? ( //TODO: NEED TO DO SOMETHING WITH PLAYER DATA TO ENSURE I GET ALL THE DATA BEFORE SHOWING THE START GAME BTN FOR PEOPLE WHO MAY CLICK FAST
                <>
                  {/* <Button onClick={lockInPlayersHandler}>Rules</Button> */}
                  <Button onClick={lockInPlayersHandler}>
                    Lock in players
                  </Button>
                </>
              ) : (
                <>
                  {/* <Button onClick={lockInPlayersHandler}>Rules</Button> */}
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
