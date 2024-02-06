import React from "react";
import styled from "styled-components";
import { buttonType, h2styles, pSmall, inputType, pLarge } from "@/styles/Type";

const PlayersContainer = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Player = styled.div`
  ${pSmall}
`;
const PlayerContainer = styled.div`
  margin-top: 20px;
  width: 120px;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const CloverIcon = styled.img`
  width: 40px;
  height: 40px;
`;

function PlayersInLobby({ users }: any) {
  return (
    <PlayersContainer className="container">
      {users?.map((user: { id: string; username: string; room: string }) => {
        return (
          <PlayerContainer className="item">
            <CloverIcon src="clover.svg" alt="clover" />
            <Player>{user?.username} </Player>
          </PlayerContainer>
        );
      })}
    </PlayersContainer>
  );
}

export default PlayersInLobby;
