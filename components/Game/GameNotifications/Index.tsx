import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";
import { variables } from "@/styles/Variables";
import { buttonType, h2styles, pLarge, pSmall } from "@/styles/Type";
import { MediaQueries } from "@/styles/Utilities";

const CorrectMessaging = styled(motion.div)`
  border: 3px solid ${variables.color1};
  background-color: ${variables.color2};
  padding: 16px;
  position: fixed;
  left: 50%;
  top: 35%;
  transform: translate(-50%, -50%);
  z-index: 11;
  width: 60vw;
  max-width: 400px;
  min-height: 300px;
  overflow-y: auto;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  text-align: center;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    background: #000;
    opacity: 0.5;
    z-index: -1;
  }
`;
const IncorrectMessaging = styled(motion.div)`
  border: 3px solid ${variables.color4};
  background-color: ${variables.color2};
  padding: 16px;
  position: fixed;
  left: 50%;
  top: 35%;
  transform: translate(-50%, -50%);
  z-index: 11;
  width: 60vw;
  max-width: 400px;
  max-height: 300px;
  overflow-y: auto;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    background: #000;
    opacity: 0.5;
    z-index: -1;
  }
`;

const HeaderForCorrectMessage = styled.p`
  color: ${variables.color1};
  ${pLarge}
  text-align: center;
  padding-bottom: 20px;
  border-bottom: 2px ${variables.white} solid;
`;

const HeaderForIncorrectMessage = styled.p`
  ${pLarge}
  color: ${variables.color4};
  text-align: center;
`;

const Button = styled.button`
  ${buttonType}
`;

const Description = styled.p`
  ${pSmall}
`;

const TextContainer = styled.div`
  text-align: center;
  margin: 25px 0;
  span {
    text-transform: uppercase;
    ${pSmall}
    &.player {
      color: purple;
    }
    &.option {
      color: blue;
    }
    &.value {
      color: yellow;
    }
    &.suit {
      color: orange;
    }
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 20px 0;
  flex-wrap: wrap;
`;

const WhoDrinksContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const OtherCorrectContainer = styled.div`
  padding: 20px;
  text-align: center;
  border: 2px solid ${variables.white};
`;

function GameNotifications({
  booleanMessage,
  activeModal,
  socket,
  currentUsersMessageTrue,
  otherUsersMessageTrue,
  users,
  buttonsTrue,
  whoDrinksHandler,
  confirmWhoDrinksHandler,
  usersToDrink,
  currentUsersMessageFalse,
  confirmedUsersToDrink,
  username,
}: any) {
  const motionProps = {
    initial: {
      opacity: 0,
      y: 200,
    },
    animate: {
      opacity: 1,
      y: 0,
    },
    exit: {
      opacity: 0,
      y: 200,
    },
    transition: {
      duration: 0.4,
    },
  };

  const otherPlayers = users?.filter(
    (user: any) => user?.username !== username
  );
  return (
    <AnimatePresence mode="wait">
      {booleanMessage !== null && activeModal && (
        <>
          {booleanMessage ? (
            <CorrectMessaging key={`${socket.id}`} {...motionProps}>
              {!confirmedUsersToDrink ? (
                <HeaderForCorrectMessage>CORRECT</HeaderForCorrectMessage>
              ) : (
                <HeaderForCorrectMessage>WHO DRINKS</HeaderForCorrectMessage>
              )}
              <TextContainer>
                <Description
                  dangerouslySetInnerHTML={{ __html: currentUsersMessageTrue }}
                />

                {otherUsersMessageTrue !== "" && (
                  <OtherCorrectContainer>
                    <Description>{otherUsersMessageTrue}</Description>
                  </OtherCorrectContainer>
                )}
              </TextContainer>
              {buttonsTrue && users.length !== 1 && (
                <>
                  <Description>Select who should drink:</Description>
                  <ButtonContainer>
                    {otherPlayers?.map((player: any) => (
                      <Button
                        onClick={() => whoDrinksHandler(player?.username)}
                        key={player?.id}
                      >
                        {player?.username}
                      </Button>
                    ))}
                  </ButtonContainer>
                </>
              )}

              {buttonsTrue && users.length !== 1 && (
                <Button onClick={confirmWhoDrinksHandler}>
                  Confirm Players to Drinks
                </Button>
              )}
              {usersToDrink && activeModal && users.length !== 1 && (
                <WhoDrinksContainer>
                  <Description>Players to drink:</Description>
                  {usersToDrink.map((user: string, index: number) => {
                    return <Description key={user}>{user}</Description>;
                  })}
                </WhoDrinksContainer>
              )}
            </CorrectMessaging>
          ) : (
            <IncorrectMessaging key={`${socket.id}-1`} {...motionProps}>
              <HeaderForIncorrectMessage>INCORRECT</HeaderForIncorrectMessage>
              <TextContainer>
                <Description
                  dangerouslySetInnerHTML={{ __html: currentUsersMessageFalse }}
                ></Description>
              </TextContainer>
            </IncorrectMessaging>
          )}
        </>
      )}
    </AnimatePresence>
  );
}

export default GameNotifications;
