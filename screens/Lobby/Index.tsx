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
  flex-direction: column;
  gap: 20px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const CardsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
`;

interface IMsgDataTypes {
  roomId: String | number;
  user: String;
  msg: String;
  time: String;
}

const ChatPage = ({ socket, username, roomId, users }: any) => {
  // console.log(socket.id, "SOCKKETTTT");
  // console.log(users, "USERS");
  const [currentMsg, setCurrentMsg] = useState("");
  const [chat, setChat] = useState<IMsgDataTypes[]>([]);

  const [playerData, setPlayerData] = useState([]);
  // console.log(playerData, "PLAYER DATA");

  const [showFirstCard, setShowFirstCard] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});

  // console.log(selectedCard, "currentPlayerCard");

  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0); // State to track the current player index

  const [nextPlayerIndex, setNextPlayerIndex] = useState(0);
  const [isCurrentPlayer, setIsCurrentPlayer] = useState(null);
  // playerData[0]

  //TODO: need to set current player to the playerData[0] and then increment them. need to figure out how to set the state for a promised object

  // console.log(currentPlayerIndex, "yooooo current player index");

  // console.log(isCurrentPlayer, "CURRENT PLATER");

  // console.log(playerData, "all player data");

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

  const startGameHandler = () => {
    // Emit card data to all players
    socket.emit("start game", { users, roomId, cardData: playerData });
  };

  const redOrBlackHandler = () => {
    const currentPlayerCard: SingleCard = playerData[currentPlayerIndex][0];

    // console.log(currentPlayerCard, "currentPlayerCard");
    setSelectedCard(currentPlayerCard);

    const updatedCard: SingleCard = {
      ...currentPlayerCard,
      selectedColor: "red",
    };
    // console.log(updatedCard, "updatedCard");

    const updatedPlayerData: PlayerData = playerData.map(
      (player: Player, index) =>
        index === currentPlayerIndex
          ? player.map((card) =>
              card === currentPlayerCard ? updatedCard : card
            )
          : player
    );

    // console.log(updatedPlayerData, "updated");

    socket.emit("updateCardData", {
      updatedPlayerData,
    });

    setCurrentPlayerIndex((prevIndex) => (prevIndex + 1) % playerData.length);
    setIsCurrentPlayer(playerData[currentPlayerIndex]);
    console.log(playerData[currentPlayerIndex], "Currentplayer");
  };

  const overUnderHandler = () => {
    // Show the first card of the current player
    const currentPlayerCard: SingleCard = playerData[currentPlayerIndex][1];
    setSelectedCard(currentPlayerCard);

    // console.log(currentPlayerCard, "currentPlayerCard");

    // Add a new key-value pair to the card object
    const updatedCard: SingleCard = {
      ...currentPlayerCard,
      selectedColor: "red",
    }; // Change 'red' to the selected color
    // console.log(updatedCard, "updatedCard");

    // Create a new player list with the updated card
    const updatedPlayerData: PlayerData = playerData.map(
      (player: Player, index: number) =>
        index === currentPlayerIndex
          ? player.map((card) =>
              card === currentPlayerCard ? updatedCard : card
            )
          : player
    );

    // console.log(updatedPlayerData, "updated");

    // Emit the updated player list to the server
    socket.emit("updateCardData", {
      updatedPlayerData,
    });

    // Move to the next player

    setCurrentPlayerIndex((prevIndex) => (prevIndex + 1) % playerData.length);
    setIsCurrentPlayer(playerData[currentPlayerIndex]);
  };

  const inOrOutHandler = () => {
    // Show the first card of the current player
    const currentPlayerCard: SingleCard = playerData[currentPlayerIndex][2];
    setSelectedCard(currentPlayerCard);

    // console.log(currentPlayerCard, "currentPlayerCard");

    // Add a new key-value pair to the card object
    const updatedCard: SingleCard = {
      ...currentPlayerCard,
      selectedColor: "red",
    }; // Change 'red' to the selected color
    // console.log(updatedCard, "updatedCard");

    // Create a new player list with the updated card
    const updatedPlayerData: PlayerData = playerData.map(
      (player: Player, index) =>
        index === currentPlayerIndex
          ? player.map((card) =>
              card === currentPlayerCard ? updatedCard : card
            )
          : player
    );

    // console.log(updatedPlayerData, "updated");

    // Emit the updated player list to the server
    socket.emit("updateCardData", {
      updatedPlayerData,
    });

    // Move to the next player

    setCurrentPlayerIndex((prevIndex) => (prevIndex + 1) % playerData.length);
    setIsCurrentPlayer(playerData[currentPlayerIndex]);
  };
  const suitHandler = () => {
    // Show the first card of the current player
    const currentPlayerCard: SingleCard = playerData[currentPlayerIndex][3];
    setSelectedCard(currentPlayerCard);

    // console.log(currentPlayerCard, "currentPlayerCard");

    // Add a new key-value pair to the card object
    const updatedCard: SingleCard = {
      ...currentPlayerCard,
      selectedColor: "red",
    }; // Change 'red' to the selected color
    // console.log(updatedCard, "updatedCard");

    // Create a new player list with the updated card
    const updatedPlayerData: PlayerData = playerData.map(
      (player: Player, index) =>
        index === currentPlayerIndex
          ? player.map((card) =>
              card === currentPlayerCard ? updatedCard : card
            )
          : player
    );

    // console.log(updatedPlayerData, "updated");

    // Emit the updated player list to the server
    socket.emit("updateCardData", {
      updatedPlayerData,
    });

    // Move to the next player
    setCurrentPlayerIndex((prevIndex) => (prevIndex + 1) % playerData.length);
    setIsCurrentPlayer(playerData[currentPlayerIndex]);
  };

  useEffect(() => {
    socket.on("receive_msg", (data: IMsgDataTypes) => {
      // console.log(data, "recieve_msg");
      setChat((pre) => [...pre, data]);
    });

    // Listen for the 'allPlayersCards' event
    socket.on("allPlayersCards", (playersCards: []) => {
      console.log("Received allPlayersCards data:", playersCards);
      setPlayerData(playersCards);
      // setIsCurrentPlayer(playerData[0]);
      // Initialize isCurrentPlayer with the first playerData
    });

    socket.on("receive_updatedCardData", (updatedPlayersCards: []) => {
      // console.log("Received updatedPlayersCards data:", updatedPlayersCards);
      setPlayerData(updatedPlayersCards);
    });

    setIsCurrentPlayer(playerData[currentPlayerIndex]);

    // if (isCurrentPlayer) {
    // console.log(isCurrentPlayer, "Currentplayer");
    // }
  }, [socket, currentPlayerIndex, isCurrentPlayer]);

  useEffect(() => {
    console.log(isCurrentPlayer, "Currentplayer");
  }, [isCurrentPlayer]);

  // Type for a Signle Card that the Card Game API give me
  type SingleCard = {
    player: string;
    image: string;
    code: string;
    images: [];
    suit: string;
    value: string;
    selectedColor?: string;
  };

  // All the cards in the Player array
  type Player = SingleCard[];
  type PlayerData = {};

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
          {/* Conditionally render the "Start Game" button */}
          {users.length > 0 && (
            <button onClick={startGameHandler}>Start Game</button>
          )}
        </div>
      </div>
      <CardContainer>
        {playerData
          ? playerData.map((player: Player, playerIndex: number) => {
              // console.log(player, "seperate players four cards");

              return (
                <IndividualCardContainer>
                  <CardsContainer>
                    {player.map((singleCard: SingleCard, index: number) => {
                      // console.log(player, "playyyyin");
                      return (
                        <>
                          <IndividualCard key={`player-${index}`}>
                            <p>{singleCard.player}</p>
                            {singleCard.selectedColor ? (
                              <ImageOfCard src={singleCard.image} />
                            ) : (
                              <ImageOfCard src="green_card.png" />
                            )}
                          </IndividualCard>
                        </>
                      );
                    })}
                  </CardsContainer>
                  <ButtonsContainer>
                    {/* {isCurrentPlayer &&
                      isCurrentPlayer[0].player === username && ( */}
                    <div className="btn-container">
                      <button onClick={redOrBlackHandler}>Red</button>
                      <button onClick={redOrBlackHandler}>Black</button>
                    </div>
                    {/* )} */}
                    {/* {isCurrentPlayer ||
                      (playerData[1] && ( */}
                    <div className="btn-container">
                      <button onClick={overUnderHandler}>Lower</button>
                      <button onClick={overUnderHandler}>Higher</button>
                    </div>
                    {/* ))} */}
                    {/* {isCurrentPlayer ||
                      (playerData[0] && ( */}
                    <div className="btn-container">
                      <button onClick={inOrOutHandler}>In</button>
                      <button onClick={inOrOutHandler}>Out</button>
                    </div>
                    {/* ))}
                     {isCurrentPlayer ||
                       (playerData[3] && ( */}
                    <div className="btn-container">
                      <button onClick={suitHandler}>Club</button>
                      <button onClick={suitHandler}>Spade</button>
                      <button onClick={suitHandler}>Diamond</button>
                      <button onClick={suitHandler}>Heart</button>
                    </div>
                    {/* ))} */}
                  </ButtonsContainer>
                </IndividualCardContainer>
              );
            })
          : ""}
      </CardContainer>
      {isCurrentPlayer &&
        isCurrentPlayer.map((player) => {
          return <p>{player.player}</p>;
        })}
    </Container>
  );
};

export default ChatPage;
