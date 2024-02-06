import React, { useEffect, useState, useRef } from "react";
import style from "../../src/styles/chat.module.css";
import styled from "styled-components";
import { motion } from "framer-motion";
import { variables } from "@/styles/Variables";
import { buttonType, h2styles, pSmall, inputType } from "@/styles/Type";

const ChatContainer = styled.div`
  border-right: 2px solid ${variables.color1};
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  /* background-color: #183c24; */
`;

const ChatsFormContainer = styled.div`
  padding: 12px;
`;

const Chats = styled.div`
  align-self: flex-end;
`;

const Header = styled.h2`
  ${h2styles}
  text-align: center;
  border-bottom: 2px solid ${variables.color1};
`;

const Form = styled.form`
  display: flex;
  width: 100%;
  margin-top: 24px;
`;

const Input = styled.input`
  width: 75%;
  ${inputType}
`;

const Button = styled.button`
  ${buttonType}
  align-self: stretch;
  width: 30%;
`;

const IndividualChat = styled.div`
  &.chatProfileRight {
    display: flex;
    align-items: center;
    gap: 5px;
    flex-direction: row-reverse;
    margin-bottom: 5px;
  }
  &.chatProfileLeft {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-bottom: 5px;
  }
`;

const ChatIcon = styled.span`
  background-color: ${variables.black};
  height: 3rem;
  width: 3rem;
  /* border-radius: 50%; */
  border: 2px solid ${variables.white};
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
`;

const MessageText = styled.h3`
  ${pSmall}
`;

const NoMessage = styled.p`
  color: #fff;
  opacity: 0.3;
  ${pSmall}
  text-align: center;
`;

interface IMsgDataTypes {
  roomId: String | number;
  user: String;
  msg: String;
  time: String;
}

function Chat({ roomId, username, socket, users }: any) {
  const [chat, setChat] = useState<IMsgDataTypes[]>([]);
  const [currentMsg, setCurrentMsg] = useState("");
  console.log(chat, "CHAT");
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
    <ChatContainer>
      <Header>HEADER</Header>
      {chat.length === 0 && <NoMessage>No Messages</NoMessage>}
      <ChatsFormContainer>
        <Chats>
          {chat.map(({ roomId, user, msg, time }, key) => (
            <IndividualChat
              key={`${key}-${msg}`}
              className={
                user == username ? "chatProfileRight" : "chatProfileLeft"
              }
            >
              <ChatIcon
                style={{ textAlign: user == username ? "right" : "left" }}
              >
                {user}
              </ChatIcon>
              <MessageText
                style={{ textAlign: user == username ? "right" : "left" }}
              >
                {msg}
              </MessageText>
            </IndividualChat>
          ))}
        </Chats>

        <Form onSubmit={(e) => sendData(e)}>
          <Input
            type="text"
            value={currentMsg}
            placeholder="Type your message.."
            onChange={(e) => setCurrentMsg(e.target.value)}
          />
          <Button>Send</Button>
        </Form>
      </ChatsFormContainer>
    </ChatContainer>
  );
}

export default Chat;
