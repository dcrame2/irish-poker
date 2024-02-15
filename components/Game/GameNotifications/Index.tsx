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
  width: 100%;
  z-index: 11;
  bottom: 0;
  overflow-y: auto;
  border-radius: 24px 24px 0 0;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  text-align: center;
  height: fit-content;
`;
const IncorrectMessaging = styled(motion.div)`
  border-top: 3px solid ${variables.color4};
  background-color: ${variables.color2};
  padding: 16px;
  position: fixed;
  bottom: 0;
  z-index: 11;
  width: 100%;
  height: fit-content;
  border-radius: 24px 24px 0 0;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
`;

const HeaderForCorrectMessage = styled.p`
  color: ${variables.middleGreen};
  ${pLarge}
  text-align: center;
`;

const HeaderForIncorrectMessage = styled.p`
  ${pLarge}
  color: ${variables.color4};
  text-align: center;
`;

interface ButtonProps {
  usersToDrink?: [];
}
const Button = styled.button<ButtonProps>`
  ${buttonType}
  opacity: ${(props) => (!props?.usersToDrink ? 1 : 0.4)};
  margin-bottom: 8px;
`;

const ConfirmButton = styled.button<ButtonProps>`
  ${buttonType}
  opacity: ${(props) => (props?.usersToDrink ? 1 : 0.4)};
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
                  {users.length === 1 && (
                    <Description>{`Modal will close in ${countdown} seconds`}</Description>
                  )}
                  {otherUsersMessageTrue !== "" && (
                    <OtherCorrectContainer>
                      <Description>{otherUsersMessageTrue}</Description>
                    </OtherCorrectContainer>
                  )}
                </CorrectContainer>
              )}
              {buttonsTrue && users.length !== 1 && (
                <SelectingUsersToDrinkContainer>
                  {buttonsTrue && users.length !== 1 && (
                    <>
                      <Description>Select who should drink:</Description>
                      <ButtonContainer>
                        {otherPlayers?.map((player: any) => (
                          <Button
                            usersToDrink={usersToDrink}
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
                    <ConfirmButton
                      usersToDrink={usersToDrink}
                      onClick={confirmWhoDrinksHandler}
                    >
                      Confirm Players to Drinks
                    </ConfirmButton>
                  )}
                </SelectingUsersToDrinkContainer>
              )}
              {usersToDrink &&
                activeModal &&
                users.length !== 1 &&
                confirmedUsersToDrink && (
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
                    <Description>{`Modal will close in ${countdown} seconds`}</Description>
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
