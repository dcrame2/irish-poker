import styles from "../../src/styles/page.module.css";
import { io } from "socket.io-client";
import React, { useState, useEffect } from "react";
import GameLobby from "../Lobby/Index";
import styled from "styled-components";
import { buttonType, h1styles, inputType, pXSmall, pBase } from "@/styles/Type";
import { AnimatePresence, motion } from "framer-motion";
import { variables } from "@/styles/Variables";
import Menu from "../Menu/Index";
import { MediaQueries } from "@/styles/Utilities";
import { socketServerUrl } from "../../utils/pathUrl";

const MainContainer = styled.div`
  background-image: url("clover.svg");
  background-repeat: no-repeat;
  position: relative;
  z-index: 2;
  background-position: right;
  height: 100dvh;
  width: 50vw;
  margin: auto;
  &::before {
    z-index: 1;
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.9);
  }

  @media ${MediaQueries.tablet} {
    width: 100vw;
  }

  @media ${MediaQueries.mobile} {
    width: 100vw;
    margin: unset;
    &:before {
      width: 100%;
    }
  }
`;

const InnerContainer = styled(motion.div)`
  height: 100dvh;
  width: 50vw;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 12px;
  z-index: 10;
  position: relative;
  padding: 0 96px;

  @media ${MediaQueries.tablet} {
    width: 100vw;
    padding: 0 96px;
  }
  @media ${MediaQueries.mobile} {
    width: 100vw;
    padding: 0 24px;
  }
`;

const Input = styled.input`
  ${inputType}
`;

const Button = styled.button`
  ${buttonType}
`;

const IrishPoker = styled.h1`
  ${h1styles}
`;

const MadeByContainer = styled.div`
  position: absolute;
  bottom: 12px;
`;

const MadeByText = styled.p`
  ${pXSmall}
`;

const HamburgerContainer = styled(motion.button)`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${variables.darkGreen};
  width: 50px;
  height: 50px;
  border-radius: 50%;
  position: absolute;
  top: 12px;
  left: 12px;
  border: none;
  z-index: 19;
`;

const HamburgerIcon = styled.img`
  width: 30px;
  height: 30px;
`;

const ConnectionMessage = styled.p`
  ${pXSmall}
  font-style: italic;
  text-align: center;
`;

const DrinkingGame = styled.p`
  ${pBase}
  text-align: center;
`;

const TextContainer = styled.div`
  p {
    color: ${variables.color4};
  }
`;

export default function UserSetup() {
  let socket: any;
  socket = io(socketServerUrl());

  const [showChats, setShowChats] = useState(false);
  const [userName, setUserName] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);
  const [roomId, setroomId] = useState("");
  const [users, setUsers] = useState([]);

  const [usenamerExistsMessage, setUsernameExistsMessage] = useState();
  const [roomFullMessage, setRoomFullMessage] = useState();
  console.log(users, "USERSSSSS");

  const handleJoin = () => {
    if (userName !== "" && roomId !== "") {
      // console.log(userName, "userName", roomId, "roomId");
      socket.emit("join_room", { userName, roomId });
      setShowChats(true);
    } else {
      alert("Please fill in Username and Room Id");
    }
  };

  useEffect(() => {
    socket.on("roomUsers", ({ users }: any) => {
      setUsers(users);
    });

    socket.on("username_exists", ({ message }: any) => {
      setUsernameExistsMessage(message);
      setShowChats(false);
    });

    socket.on("room_full", ({ message }: any) => {
      setRoomFullMessage(message);
      setShowChats(false);
    });
  }, [socket]);

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
      duration: 0.5,
    },
  };
  const [showMenu, setShowMenu] = useState(false);

  const openMenuHandler = () => {
    setShowMenu(true);
  };

  return (
    <MainContainer>
      <HamburgerContainer whileHover={{ scale: 1.1 }} onClick={openMenuHandler}>
        <HamburgerIcon src="hamburger-menu.svg" />
      </HamburgerContainer>
      <Menu showMenu={showMenu} setShowMenu={setShowMenu} />
      <AnimatePresence>
        <InnerContainer
          key="key1"
          {...motionProps}
          style={{ display: showChats ? "none" : "" }}
        >
          <DrinkingGame>Drinking Game 🍻</DrinkingGame>
          <IrishPoker>Irish Poker</IrishPoker>

          <Input
            type="text"
            placeholder="Username"
            onChange={(e) => setUserName(e.target.value)}
            disabled={showSpinner}
            maxLength={10}
          />
          {usenamerExistsMessage && (
            <TextContainer
              dangerouslySetInnerHTML={{
                __html: usenamerExistsMessage,
              }}
            ></TextContainer>
          )}
          <Input
            type="text"
            placeholder="Room Name"
            onChange={(e) => setroomId(e.target.value)}
            disabled={showSpinner}
            maxLength={4}
          />
          <ConnectionMessage>
            Join the same Room Name to connect multiplayer
          </ConnectionMessage>
          <Button onClick={() => handleJoin()}>
            {!showSpinner ? (
              "Join"
            ) : (
              <div className={styles.loading_spinner}></div>
            )}
          </Button>
          {/* {roomFullMessage && (
            <TextContainer
              dangerouslySetInnerHTML={{
                __html: roomFullMessage,
              }}
            ></TextContainer>
          )} */}
          <MadeByContainer>
            <MadeByText>Created by Dylan Cramer</MadeByText>
          </MadeByContainer>
        </InnerContainer>
        <motion.div
          style={{ display: !showChats ? "none" : "" }}
          {...motionProps}
          key="key2"
        >
          <GameLobby
            openMenuHandler={openMenuHandler}
            showChats={showChats}
            users={users}
            socket={socket}
            roomId={roomId}
            username={userName}
            setUsers={setUsers}
            setShowChats={setShowChats}
            showSpinner={showSpinner}
            setShowSpinner={setShowSpinner}
          />
        </motion.div>
      </AnimatePresence>
    </MainContainer>
  );
}
