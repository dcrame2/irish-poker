import { boxShadows, h1styles, pLarge, h3styles, pXSmall } from "@/styles/Type";
import { variables } from "@/styles/Variables";
import React from "react";
import styled from "styled-components";

const CurrentPlayerContainer = styled.div`
  margin: 0 12px;
`;

const CurrentPlayerInnerContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

const CloverIcon = styled.img`
  width: 50px;
  height: 50px;
`;

const Username = styled.p`
  ${pLarge}
`;

const SquareContainer = styled.div`
  display: flex;
  gap: 20px;
  padding: 12px;
  flex-direction: column;
  align-items: center;
  background-color: ${variables.color1};
  border-radius: 12px;
  min-height: 160px;
  justify-content: center;
  ${boxShadows}
`;

const LobbyRoomInfo = styled.div`
  display: flex;
  gap: 20px;
  padding: 12px;
  flex-direction: column;
  align-items: center;
  background-color: ${variables.color1};
  border-radius: 12px;
  min-height: 160px;
  justify-content: center;
  ${boxShadows}
`;

const RoomName = styled.p`
  ${h3styles}
`;

function CurrentPlayer({
  users,
  username,
  roomId,
}: {
  users: [];
  username: string;
  roomId: string;
}) {
  return (
    <CurrentPlayerContainer>
      <CurrentPlayerInnerContainer>
        <LobbyRoomInfo>
          <p>Lobby for room</p>
          <RoomName>{roomId}</RoomName>
        </LobbyRoomInfo>
        <SquareContainer>
          <CloverIcon src="clover.svg" alt="Clover" />
          <Username>{username}</Username>
        </SquareContainer>
      </CurrentPlayerInnerContainer>
    </CurrentPlayerContainer>
  );
}

export default CurrentPlayer;
