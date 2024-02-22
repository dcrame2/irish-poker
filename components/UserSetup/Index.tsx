import styles from "../../src/styles/page.module.css";
import { io } from "socket.io-client";
import React, { useState, useEffect } from "react";
import GameLobby from "../Lobby/Index";
import styled from "styled-components";
import { buttonType, h1styles, inputType } from "@/styles/Type";
import { AnimatePresence, motion } from "framer-motion";
import { variables } from "@/styles/Variables";
// import Button from "../Button/Index";
const MainContainer = styled.div`
  background-image: url("clover.svg");

  background-repeat: no-repeat;
  position: relative;
  z-index: 2;
  background-position: right;
  height: 100dvh;
  width: 100vw;
  /* border: 2px solid ${variables.color1}; */
  &::before {
    z-index: 1;
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.9);
    /* background-color: ${variables.darkGreen}; */
  }
`;

const InnerContainer = styled(motion.div)`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 12px;
  z-index: 10;
  position: relative;
`;

const Input = styled.input`
  ${inputType}
`;

const Button = styled.button`
  ${buttonType}
`;

const Logo = styled.img`
  width: 100%;
`;

const IrishPoker = styled.h1`
  ${h1styles}
`;

export default function UserSetup() {
  const [showChats, setShowChats] = useState(false);
  const [userName, setUserName] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);
  const [roomId, setroomId] = useState("");
  const [users, setUsers] = useState([]);

  let socket: any;
  // socket = io("https://irish-poker.onrender.com");
  socket = io("http://localhost:3001");

  const handleJoin = () => {
    if (userName !== "" && roomId !== "") {
      console.log(userName, "userName", roomId, "roomId");
      socket.emit("join_room", { userName, roomId });
      setShowSpinner(true);
      setShowChats(true);
    } else {
      alert("Please fill in Username and Room Id");
    }
  };

  useEffect(() => {
    socket.on("roomUsers", ({ users }: any) => {
      setUsers(users);
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
      duration: 0.8,
    },
  };

  return (
    <MainContainer>
      <AnimatePresence mode="wait">
        <InnerContainer
          key="key1"
          {...motionProps}
          style={{ display: showChats ? "none" : "" }}
        >
          <IrishPoker>Irish Poker</IrishPoker>
          <Input
            type="text"
            placeholder="Username"
            onChange={(e) => setUserName(e.target.value)}
            disabled={showSpinner}
            max="12"
          />
          <Input
            type="number"
            placeholder="room id"
            onChange={(e) => setroomId(e.target.value)}
            disabled={showSpinner}
            // max="5"
          />
          <Button onClick={() => handleJoin()}>
            {!showSpinner ? (
              "Join"
            ) : (
              <div className={styles.loading_spinner}></div>
            )}
          </Button>
        </InnerContainer>

        <motion.div
          style={{ display: !showChats ? "none" : "" }}
          {...motionProps}
          key="key2"
        >
          <GameLobby
            showChats={showChats}
            users={users}
            socket={socket}
            roomId={roomId}
            username={userName}
            setUsers={setUsers}
            setShowChats={setShowChats}
          />
        </motion.div>
      </AnimatePresence>
    </MainContainer>
  );
}
