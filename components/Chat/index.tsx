import React, { useEffect, useState, useRef } from "react";
import style from "../../src/styles/chat.module.css";
import styled from "styled-components";

import { variables } from "@/styles/Variables";
import { buttonType, h2styles, pSmall, inputType, pBase } from "@/styles/Type";
import { MediaQueries } from "@/styles/Utilities";
import { AnimatePresence, motion } from "framer-motion";
import Close from "../../svg/close/Index";

const ChatContainer = styled(motion.div)`
  position: absolute;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 20;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background-color: ${variables.color2};
  padding: 12px;
`;

const ChatsFormContainer = styled.div`
  /* padding: 12px; */
`;

const Chats = styled.div`
  align-self: flex-end;
`;

const Header = styled.h2`
  ${h2styles}
  text-align: center;
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

const IndividualChat = styled(motion.div)`
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

const MessageText = styled.h3`
  ${pBase}
`;

const NoMessage = styled.p`
  color: #fff;
  opacity: 0.3;
  ${pSmall}
  text-align: center;
`;

const CloseContainer = styled.div`
  width: 20px;
  position: absolute;
  top: 15px;
  right: 15px;
  height: 20px;
  z-index: 21;
`;

const Player = styled.div`
  ${pSmall}
  color: ${variables.darkGreen};
`;
const PlayerContainer = styled.div`
  /* margin-top: 8px; */
  display: flex;
  justify-content: center;
  padding: 4px 8px;
  align-items: center;
  gap: 8px;
  background-color: ${variables.white};
  border-radius: 16px;
  width: fit-content;
`;

const CloverIcon = styled.img`
  width: 20px;
  height: 20px;
`;

const MessageAndNameContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  background-color: ${variables.color1};
  padding: 8px;
  border-radius: 24px;
`;

const Time = styled.p`
  ${pSmall}
  opacity: 0.7;
`;

interface IMsgDataTypes {
  roomId: String | number;
  user: String;
  msg: String;
  time: String;
}

function Chat({
  roomId,
  username,
  socket,
  users,
  setShowChat,
  showChat,
  chat,
  setChat,
  setMessageTracker,
}: any) {
  // const [chat, setChat] = useState<IMsgDataTypes[]>([]);
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
      setChat((pre: IMsgDataTypes[]) => [...pre, data]);
    });
  }, [socket]);

  const closeChatHandler = () => {
    setShowChat(false);
    setMessageTracker(0);
  };

  const motionPropsTop = {
    initial: {
      opacity: 0,
      x: "100%",
    },
    animate: {
      x: 0,
      opacity: 1,
    },
    exit: {
      x: "100%",
      opacity: 0,
    },
    transition: {
      duration: 0.4,
    },
  };

  const motionPropsRight = {
    initial: {
      opacity: 0,
      x: -100,
    },
    animate: {
      x: 0,
      opacity: 1,
    },
    exit: {
      x: -100,
      opacity: 0,
    },
    transition: {
      duration: 0.4,
    },
  };
  const motionPropsLeft = {
    initial: {
      opacity: 0,
      x: 100,
    },
    animate: {
      x: 0,
      opacity: 1,
    },
    exit: {
      x: 100,
      opacity: 0,
    },
    transition: {
      duration: 0.4,
    },
  };

  return (
    <AnimatePresence mode="wait">
      {showChat && (
        <ChatContainer {...motionPropsTop}>
          <Header>Chat Room</Header>
          <CloseContainer onClick={closeChatHandler}>
            <Close />
          </CloseContainer>
          {chat.length === 0 && <NoMessage>No Messages</NoMessage>}
          <ChatsFormContainer>
            <Chats>
              {chat.map(
                (
                  {
                    roomId,
                    user,
                    msg,
                    time,
                  }: {
                    roomId: string;
                    user: string;
                    msg: string;
                    time: string;
                  },
                  key: string
                ) => (
                  <AnimatePresence mode="wait">
                    <IndividualChat
                      key={`${key}-${msg}`}
                      className={
                        user == username
                          ? "chatProfileRight"
                          : "chatProfileLeft"
                      }
                      {...(user == username
                        ? motionPropsLeft
                        : motionPropsRight)}
                    >
                      <MessageAndNameContainer>
                        <PlayerContainer
                          style={{
                            textAlign: user == username ? "right" : "left",
                          }}
                        >
                          <CloverIcon src="clover.svg" alt="clover" />
                          <Player>{user}</Player>
                        </PlayerContainer>

                        <MessageText
                          style={{
                            textAlign: user == username ? "right" : "left",
                          }}
                        >
                          {msg}
                        </MessageText>
                        <Time>Time: {time}</Time>
                      </MessageAndNameContainer>
                    </IndividualChat>
                  </AnimatePresence>
                )
              )}
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
      )}
    </AnimatePresence>
  );
}

export default Chat;
