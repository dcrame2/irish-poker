import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styled from "styled-components";
import { variables } from "@/styles/Variables";
import {
  buttonType,
  boxShadows,
  boxShadowsRed,
  pLarge,
  pSmall,
  pBase,
} from "@/styles/Type";
import { MediaQueries } from "@/styles/Utilities";

const CorrectMessaging = styled(motion.div)`
  border-top: 3px solid ${variables.middleGreen};
  background-color: ${variables.color2};
  padding: 16px;
  position: fixed;
  left: 50%;
  /* top: 35%; */
  /* transform: translate(-50%, -50%); */
  z-index: 11;
  width: 60vw;
  /* max-width: 400px;
  min-height: 300px; */
  overflow-y: auto;
  border-radius: 24px 24px 0 0;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  text-align: center;
  @media ${MediaQueries.mobile} {
    /* padding: 48px 0; */
    left: unset;
    /* top: 50%; */
    width: 100%;
    bottom: 0;
    height: fit-content;
  }

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
  border-top: 3px solid ${variables.color4};
  background-color: ${variables.color2};
  padding: 16px;
  position: fixed;
  left: 50%;
  /* top: 35%; */
  /* transform: translate(-50%, -50%); */
  z-index: 11;
  width: 60vw;
  /* max-width: 400px;
  max-height: 300px; */
  overflow-y: auto;
  border-radius: 24px 24px 0 0;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  @media ${MediaQueries.mobile} {
    /* padding: 48px 0; */
    left: unset;
    /* top: 50%; */
    width: 100%;
    bottom: 0;
    height: fit-content;
  }

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
  color: ${variables.middleGreen};
  ${pLarge}
  text-align: center;
  /* padding-bottom: 20px; */
  /* border-bottom: 2px ${variables.white} solid; */
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
  margin: 25px 0 8px;
  background-color: ${variables.darkGreen};
  border-radius: 12px;
  padding: 24px 12px;
  /* ${boxShadows} */
  /* margin: 0 12px; */
  span {
    text-transform: uppercase;
    ${pBase}/* &.player {
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
    } */
  }
`;

const IncorrectTextContainer = styled.div`
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 8px 0 0;
  flex-wrap: wrap;
`;

const WhoDrinksContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: row;
  text-align: center;
  margin: 8px 0;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
`;

const OtherCorrectContainer = styled.div`
  text-align: center;
  background-color: ${variables.darkGreen};
  border-radius: 12px;
  padding: 24px 12px;
  display: flex;
  align-items: center;
  /* ${boxShadows} */
  justify-content: center;
`;

const CorrectContainer = styled.div``;

const PlayerContainer = styled.div`
  margin-top: 8px;
  display: flex;
  justify-content: center;
  padding: 4px 8px;
  align-items: center;
  gap: 8px;
  background-color: ${variables.white};
  border-radius: 16px;
  min-width: fit-content;
`;

const CloverIcon = styled.img`
  width: 20px;
  height: 20px;
`;

const Player = styled.div`
  ${pSmall}
  color: ${variables.darkGreen};
`;

const SelectingUsersToDrinkContainer = styled.div`
  text-align: center;
  flex-direction: column;
  background-color: ${variables.color1};
  border-radius: 12px;
  padding: 24px 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  ${boxShadows}
`;

const UserMessageFalse = styled.div`
  padding: 12px 24px;
  ${pBase}
  background-color: ${variables.color4};
  border-radius: 12px;
  margin: 16px 0 48px;
  ${boxShadowsRed}
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
  countdown,
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
      delay: 0.5,
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
                <HeaderForCorrectMessage>LUCKY</HeaderForCorrectMessage>
              ) : (
                <HeaderForCorrectMessage>WHO DRINKS</HeaderForCorrectMessage>
              )}
              {!confirmedUsersToDrink && (
                <CorrectContainer>
                  <TextContainer>
                    <Description
                      dangerouslySetInnerHTML={{
                        __html: currentUsersMessageTrue,
                      }}
                    />
                  </TextContainer>
                  {otherUsersMessageTrue !== "" && (
                    <OtherCorrectContainer>
                      <Description>{otherUsersMessageTrue}</Description>
                    </OtherCorrectContainer>
                  )}
                </CorrectContainer>
              )}
              {buttonsTrue && (
                <SelectingUsersToDrinkContainer>
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

                  {buttonsTrue && users.length !== 1 && usersToDrink && (
                    <Button onClick={confirmWhoDrinksHandler}>
                      Confirm Players to Drinks
                    </Button>
                  )}
                </SelectingUsersToDrinkContainer>
              )}
              {usersToDrink && activeModal && users.length !== 1 && (
                <>
                  <WhoDrinksContainer>
                    {usersToDrink.map((user: string, index: number) => {
                      return (
                        <PlayerContainer key={user} className="item">
                          <CloverIcon src="clover.svg" alt="clover" />
                          <Player>{user} </Player>
                        </PlayerContainer>
                      );
                    })}
                  </WhoDrinksContainer>
                  {/* {confirmedUsersToDrink && ( */}
                  <Description>{`Modal will close in ${countdown} seconds`}</Description>
                  {/* )} */}
                </>
              )}
            </CorrectMessaging>
          ) : (
            <IncorrectMessaging key={`${socket.id}-1`} {...motionProps}>
              <HeaderForIncorrectMessage>UNLUCKY</HeaderForIncorrectMessage>
              <IncorrectTextContainer>
                <UserMessageFalse
                  dangerouslySetInnerHTML={{ __html: currentUsersMessageFalse }}
                ></UserMessageFalse>
                {activeModal && (
                  <Description>{`Modal will close in ${countdown} seconds`}</Description>
                )}
              </IncorrectTextContainer>
            </IncorrectMessaging>
          )}
        </>
      )}
    </AnimatePresence>
  );
}

export default GameNotifications;
