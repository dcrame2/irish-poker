import React, { useState } from "react";
import PlayersInLobby from "./PlayersInLobby/Index";
import { buttonType } from "@/styles/Type";
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
`;

const Button = styled.button`
  ${buttonType}
`;

const Logo = styled.img`
  width: 100%;
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
}: any) {
  const [showChat, setShowChat] = useState(false);
  const showChatHandler = () => {
    setShowChat(true);
  };
  return (
    <LobbyInfoContainer>
      {!gameStarted && (
        <>
          <MessageIconContainer onClick={showChatHandler}>
            <MessageIcon src="chat_icon.svg" />
          </MessageIconContainer>
          {/* {showChat && ( */}
          <Chat
            socket={socket}
            username={username}
            roomId={roomId}
            users={users}
            setShowChat={setShowChat}
            showChat={showChat}
          />
          {/* )} */}
          <Logo src="irish_poker_logo.png" alt="Logo" />
          <CurrentPlayer users={users} username={username} roomId={roomId} />
          <PlayersInLobby users={users} />
          <GameButtonContainer>
            {users.length > 0 && !usersLockedIn && !gameStarted ? (
              <>
                <Button onClick={lockInPlayersHandler}>Rules</Button>
                <Button onClick={lockInPlayersHandler}>Lock in players</Button>
              </>
            ) : (
              <>
                <Button onClick={lockInPlayersHandler}>Rules</Button>
                <Button onClick={startGameHandler}>Start Game</Button>
              </>
            )}
          </GameButtonContainer>
        </>
      )}
    </LobbyInfoContainer>
  );
}

export default LobbyInfo;
