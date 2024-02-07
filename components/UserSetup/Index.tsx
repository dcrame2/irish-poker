import styles from "../../src/styles/page.module.css";
import { io } from "socket.io-client";
import React, { useState, useEffect } from "react";
import ChatPage from "../Lobby/Index";
import styled from "styled-components";
import { Container } from "../../src/styles/Utilities";
import { buttonType, h2styles, pSmall, inputType, pLarge } from "@/styles/Type";
const MainContainer = styled.div`
  /* background-image: url("clover.svg");
  background-repeat: no-repeat;
  position: relative;
  z-index: 2;
  background-position: right;
  &::before {
    z-index: 1;
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.9);
  } */
`;

const InnerContainer = styled.div`
  /* height: 100vh;
  widows: 100vw; */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 1rem;
  z-index: 10;
  position: relative;
`;

const Input = styled.input`
  /* width: 75%; */
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
  socket = io("http://localhost:3001");

  const handleJoin = () => {
    if (userName !== "" && roomId !== "") {
      console.log(userName, "userName", roomId, "roomId");
      socket.emit("join_room", { userName, roomId });
      setShowSpinner(true);
      // You can remove this setTimeout and add your own logic
      setTimeout(() => {
        setShowChat(true);
        setShowSpinner(false);
      }, 1000);
    } else {
      alert("Please fill in Username and Room Id");
    }
  };

  useEffect(() => {
    socket.on("roomUsers", ({ users }: any) => {
      setUsers(users);
    });
  }, [socket]);

  return (
    <MainContainer>
      <InnerContainer
        className={styles.main_div}
        style={{ display: showChat ? "none" : "" }}
      >
        {/* <h1>Irish Poker</h1> */}
        <Input
          className={styles.main_input}
          type="text"
          placeholder="Username"
          onChange={(e) => setUserName(e.target.value)}
          disabled={showSpinner}
        />
        <Input
          className={styles.main_input}
          type="text"
          placeholder="room id"
          onChange={(e) => setroomId(e.target.value)}
          disabled={showSpinner}
        />
        <Button className={styles.main_button} onClick={() => handleJoin()}>
          {!showSpinner ? (
            "Join"
          ) : (
            <div className={styles.loading_spinner}></div>
          )}
        </Button>
      </InnerContainer>
      {/* <div style={{ display: !showChat ? "none" : "" }}> */}
      <ChatPage
        users={users}
        socket={socket}
        roomId={roomId}
        username={userName}
      />
      {/* </div>  */}
    </MainContainer>
  );
}
