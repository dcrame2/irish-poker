import styles from "../../src/styles/page.module.css";
import { io } from "socket.io-client";
import React, { useState, useEffect } from "react";
import ChatPage from "../../screens/Lobby/Index";

export default function UserSetup() {
  const [showChat, setShowChat] = useState(false);
  const [userName, setUserName] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);
  const [roomId, setroomId] = useState("");
  const [users, setUsers] = useState([]);

  let socket: any;
  socket = io("https://irish-poker.onrender.com");

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
    <div>
      <div
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
      </div>
      <div style={{ display: !showChat ? "none" : "" }}>
        <ChatPage
          users={users}
          socket={socket}
          roomId={roomId}
          username={userName}
        />
      </div>
    </div>
  );
}
