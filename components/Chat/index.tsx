import React, { useEffect, useState, useRef } from "react";
import style from "../../src/styles/chat.module.css";
import styled from "styled-components";
import { motion } from "framer-motion";

interface IMsgDataTypes {
  roomId: String | number;
  user: String;
  msg: String;
  time: String;
}

function Chat({ roomId, username, socket, users }: any) {
  const [chat, setChat] = useState<IMsgDataTypes[]>([]);
  const [currentMsg, setCurrentMsg] = useState("");
  const sendData = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentMsg !== "") {
      const msgData: IMsgDataTypes = {
        roomId,
        user: username,
        msg: currentMsg,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      socket.emit("send_msg", msgData);
      setCurrentMsg("");
    }
  };

  useEffect(() => {
    socket.on("receive_msg", (data: IMsgDataTypes) => {
      setChat((pre) => [...pre, data]);
    });
  }, [socket]);

  return (
    <div className={style.chat_border}>
      <div style={{ marginBottom: "1rem" }}>
        <h2>In Lobby yoooo</h2>
        <p>
          Name: <b>{username}</b> and Room Id: <b>{roomId}</b>
        </p>
      </div>
      <div className="tests">
        {users.map((user: { id: string; username: string; room: string }) => {
          return <p>{user.username} </p>;
        })}
        {chat.map(({ roomId, user, msg, time }, key) => (
          <div
            key={key}
            className={
              user == username ? style.chatProfileRight : style.chatProfileLeft
            }
          >
            <span
              className={style.chatProfileSpan}
              style={{ textAlign: user == username ? "right" : "left" }}
            >
              {user}
            </span>
            <h3 style={{ textAlign: user == username ? "right" : "left" }}>
              {msg}
            </h3>
          </div>
        ))}
      </div>
      <div>
        <form onSubmit={(e) => sendData(e)}>
          <input
            className={style.chat_input}
            type="text"
            value={currentMsg}
            placeholder="Type your message.."
            onChange={(e) => setCurrentMsg(e.target.value)}
          />
          <button className={style.chat_button}>Send</button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
