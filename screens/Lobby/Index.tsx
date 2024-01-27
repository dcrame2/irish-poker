"use client";
import React, { useEffect, useState } from "react";
import style from "../../src/styles/chat.module.css";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 100px;
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const IndividualCard = styled.div``;

const ImageOfCard = styled.img`
  width: 50px;
`;

const IndividualCardContainer = styled.div`
  display: flex;
`;

const ButtonsContainer = styled.div`
  display: flex;
`;

interface IMsgDataTypes {
  roomId: String | number;
  user: String;
  msg: String;
  time: String;
}

const ChatPage = ({ socket, username, roomId, users }: any) => {
  const [currentMsg, setCurrentMsg] = useState("");
  const [chat, setChat] = useState<IMsgDataTypes[]>([]);

  const [playerData, setPlayerData] = useState([]);
  console.log(playerData);

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
  const [gameStarted, setGameStarted] = useState(false);

  const startGameHandler = () => {
    // Emit card data to all players
    socket.emit("start game", { users, roomId, cardData: playerData });
    setGameStarted(true);
  };

  useEffect(() => {
    socket.on("receive_msg", (data: IMsgDataTypes) => {
      setChat((pre) => [...pre, data]);
    });

    // Listen for the 'subarraysData' event
    socket.on("allPlayersCards", (playersCards: []) => {
      console.log("Received allPlayersCards data:", playersCards);
      setPlayerData(playersCards);
      // TODO: I will write code here that will need to do kind of like the messages above and I will need to add another toggle that says the images were shown
      // Do whatever you need to do with the allPlayersCards data on the client side
    });
  }, [socket]);

  type SingleCard = {
    player: string;
    image: string;
    code: string;
    images: [];
    suit: string;
    value: string;
  };

  type Player = SingleCard[];

  return (
    <Container className={style.chat_div}>
      <div className={style.chat_border}>
        <div style={{ marginBottom: "1rem" }}>
          <h2>In Lobby</h2>
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
                user == username
                  ? style.chatProfileRight
                  : style.chatProfileLeft
              }
            >
              <span
                className={style.chatProfileSpan}
                style={{ textAlign: user == username ? "right" : "left" }}
              >
                {user.charAt(0)}
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
          {/* Conditionally render the "Start Game" button */}
          {users.length > 0 && (
            <button onClick={startGameHandler}>Start Game</button>
          )}
        </div>
      </div>
      <CardContainer>
        {playerData
          ? playerData.map((player: Player) => {
              console.log(player, "player");
              return (
                <IndividualCardContainer>
                  {player.map((singleCard: SingleCard) => {
                    return (
                      <>
                        <IndividualCard>
                          <p>{singleCard.player}</p>
                          <ImageOfCard src={singleCard.image} />
                        </IndividualCard>
                        {/* <ButtonsContainer>
                          <button>Red</button>
                          <button>Green</button>
                        </ButtonsContainer> */}
                      </>
                    );
                  })}
                </IndividualCardContainer>
              );
            })
          : ""}
      </CardContainer>
    </Container>
  );
};

export default ChatPage;
