import React from "react";
import PlayersInLobby from "./PlayersInLobby/Index";
import { buttonType } from "@/styles/Type";
import styled from "styled-components";

const LobbyInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
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
}: any) {
  return (
    <LobbyInfoContainer>
      {!gameStarted && (
        <>
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
