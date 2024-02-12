import React from "react";
import PlayersInLobby from "./PlayersInLobby/Index";
import { buttonType } from "@/styles/Type";
import styled from "styled-components";
import { useAnimationFrame } from "framer-motion";
import CurrentPlayer from "./CurrentPlayer/Index";

const LobbyInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
`;

const GameButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;

const Button = styled.button`
  ${buttonType}
`;

function LobbyInfo({
  gameStarted,
  users,
  usersLockedIn,
  lockInPlayersHandler,
  startGameHandler,
  username,
  roomId,
}: any) {
  return (
    <LobbyInfoContainer>
      {!gameStarted && (
        <>
          <CurrentPlayer users={users} username={username} roomId={roomId} />
          <PlayersInLobby users={users} />
          <GameButtonContainer>
            {users.length > 0 && !usersLockedIn && !gameStarted ? (
              <Button onClick={lockInPlayersHandler}>Lock in players</Button>
            ) : (
              <Button onClick={startGameHandler}>Start Game</Button>
            )}
          </GameButtonContainer>
        </>
      )}
    </LobbyInfoContainer>
  );
}

export default LobbyInfo;
