import styles from "../../src/styles/page.module.css";
import { io } from "socket.io-client";
import React, { useState, useEffect } from "react";
import GameLobby from "../Lobby/Index";
import styled from "styled-components";
import { buttonType, inputType } from "@/styles/Type";
import { AnimatePresence, motion } from "framer-motion";
import { variables } from "@/styles/Variables";
const MainContainer = styled.div`
  background-image: url("clover.svg");
  background-repeat: no-repeat;
  position: relative;
  z-index: 2;
  background-position: right;
  height: 100vh;
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

export default function UserSetup() {
  const [showChat, setShowChat] = useState(false);
  const [userName, setUserName] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);
  const [roomId, setroomId] = useState("");
  const [users, setUsers] = useState([]);

  let socket: any;
  socket = io("http://localhost:1234");

  const handleJoin = () => {
    if (userName !== "" && roomId !== "") {
      console.log(userName, "userName", roomId, "roomId");
      socket.emit("join_room", { userName, roomId });
      setShowSpinner(true);
      setShowChat(true);
    } else {
      alert("Please fill in Username and Room Id");
    }
  };

  useEffect(() => {
    socket.on("roomUsers", ({ users }: any) => {
      setUsers(users);
      setShowChat(true);
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
          style={{ display: showChat ? "none" : "" }}
        >
          <h1>Irish Poker</h1>
          <Input
            type="text"
            placeholder="Username"
            onChange={(e) => setUserName(e.target.value)}
            disabled={showSpinner}
          />
          <Input
            type="text"
            placeholder="room id"
            onChange={(e) => setroomId(e.target.value)}
            disabled={showSpinner}
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
          style={{ display: !showChat ? "none" : "" }}
          {...motionProps}
          key="key2"
        >
          <GameLobby
            users={users}
            socket={socket}
            roomId={roomId}
            username={userName}
          />
        </motion.div>
      </AnimatePresence>
    </MainContainer>
  );
}
