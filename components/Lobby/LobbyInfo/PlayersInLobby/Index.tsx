import React from "react";
import styled from "styled-components";
import {
  buttonType,
  h2styles,
  pSmall,
  inputType,
  pLarge,
  boxShadows,
} from "@/styles/Type";
import { variables } from "@/styles/Variables";

const PlayersContainer = styled.div`
  background-color: ${variables.color1};
  border-radius: 12px;
  margin: 0 12px;
  position: relative;
  /* width: 100%; */
  display: flex;
  align-items: center;
  min-height: 100px;
  margin-top: 20px;
  ${boxShadows}
`;

const PlayersInLobbyInnerContainer = styled.div`
  padding: 12px;
`;

const PlayersInLobbyContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
`;

const Player = styled.div`
  ${pSmall}
  color: ${variables.darkGreen};
`;
const PlayerContainer = styled.div`
  margin-top: 8px;
  display: flex;
  justify-content: center;
  padding: 4px 8px;
  align-items: center;
  gap: 8px;
  background-color: ${variables.white};
  border-radius: 16px;
  min-width: fit-content;
`;

const CloverIcon = styled.img`
  width: 20px;
  height: 20px;
`;

function PlayersInLobby({ users }: any) {
  return (
    <PlayersContainer className="container">
      <PlayersInLobbyInnerContainer>
        <p>Players in Lobby</p>
        <PlayersInLobbyContainer>
          {users?.map(
            (user: { id: string; username: string; room: string }) => {
              return (
                <PlayerContainer key={user?.id} className="item">
                  <CloverIcon src="clover.svg" alt="clover" />
                  <Player>{user?.username} </Player>
                </PlayerContainer>
              );
            }
          )}
        </PlayersInLobbyContainer>
      </PlayersInLobbyInnerContainer>
    </PlayersContainer>
  );
}

export default PlayersInLobby;
