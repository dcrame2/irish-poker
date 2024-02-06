import styles from "../../src/styles/page.module.css";
import { io } from "socket.io-client";
import React, { useState, useEffect } from "react";
import ChatPage from "../../screens/Lobby/Index";
import styled from "styled-components";
import { Container } from "../../src/styles/Utilities";
const MainContainer = styled.div`
  /* ${Container} */
`;

const InnerContainer = styled.div`
  height: 100vh;
  widows: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 1rem;
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
        <input
          className={styles.main_input}
          type="text"
          placeholder="Username"
          onChange={(e) => setUserName(e.target.value)}
          disabled={showSpinner}
        />
        <input
          className={styles.main_input}
          type="text"
          placeholder="room id"
          onChange={(e) => setroomId(e.target.value)}
          disabled={showSpinner}
        />
        <button className={styles.main_button} onClick={() => handleJoin()}>
          {!showSpinner ? (
            "Join"
          ) : (
            <div className={styles.loading_spinner}></div>
          )}
        </button>
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
