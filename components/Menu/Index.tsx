import React, { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { variables } from "@/styles/Variables";
import Close from "../../svg/close/Index";
import { h2styles, pBase, pSmall, pLarge2 } from "@/styles/Type";
import Feedback from "./Feedback/Index";
import { MediaQueries } from "@/styles/Utilities";

interface RulesContainerProps {
  show: boolean;
}

const MenuContainer = styled(motion.div)`
  position: absolute;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  z-index: 20;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background-color: ${variables.color2};
  padding: 12px;
`;

const MenuInnerContainer = styled.div`
  height: fit-content;
`;

const CloseContainer = styled(motion.div)`
  width: 20px;
  position: absolute;
  top: 22px;
  right: 15px;
  height: 20px;
  z-index: 21;
`;

const Header = styled.h2`
  ${h2styles}
  text-align: center;
`;

const RulesContainer = styled.div<RulesContainerProps>`
  background-color: ${variables.color1};
  margin: 16px 0 0px;
  padding: 12px 24px;
  border-radius: 12px;
  max-height: ${(props) => (props.show ? "800px" : "60px")};
  overflow: hidden;
  transition: max-height 0.5s ease-in-out;
  @media ${MediaQueries.mobile} {
    max-height: ${(props) => (props.show ? "800px" : "50px")};
  }
`;

const RulesInnerContainer = styled.button<RulesContainerProps>`
  ${pBase}
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: none;
  background-color: ${variables.color1};
  width: 100%;
  transition: transform ease-in 0.3s;

  &::after {
    content: "";
    width: 20px;
    height: 20px;
    background-size: contain;
    background-image: url("dropdown_arrow.png");
    transform: ${(props) => (props.show ? "rotate(180deg)" : "rotate(0deg)")};
    transition: transform ease-in 0.3s;
  }
`;

const AllRulesContainer = styled.div<RulesContainerProps>`
  opacity: ${(props) => (props.show ? "1" : "0")};
  transition: opacity ease-in 0.3s;
  /* border-top: 2px solid ${variables.white}; */
`;

const RulesText = styled.div`
  margin: 12px 0;
  ${pSmall}
  p {
  }
  ul,
  ol {
    margin-left: 30px;
    margin-top: 12px;
    margin-bottom: 12px;
  }
`;

const LabelName = styled.p`
  ${pLarge2}
`;

const FeedbackContainer = styled.div`
  background-color: ${variables.color1};
  margin: 16px 0 0px;
  padding: 24px 24px;
  border-radius: 12px;
  overflow: hidden;
  transition: max-height 0.5s ease-in;
`;

const FeedbackInnerContainer = styled.div`
  ${pBase}
  position: relative;
  display: flex;
  justify-content: space-between;

  border: none;
  background-color: ${variables.darkGreen};
  width: 100%;
  &::after {
    content: "";
    width: 20px;
    height: 20px;
    background-size: contain;
    background-image: url("dropdown_arrow.png");
  }
`;

function Menu({ showMenu, setShowMenu }: any) {
  const [showRules, setShowRules] = useState(false);

  const [showFeedback, setShowFeedback] = useState(false);

  const motionPropsLeft = {
    initial: {
      opacity: 0,
      x: -300,
    },
    animate: {
      x: 0,
      opacity: 1,
    },
    exit: {
      x: -300,
      opacity: 0,
    },
    transition: {
      duration: 0.4,
    },
  };

  const closeChatHandler = () => {
    setShowMenu(false);
  };

  const showRulesHandler = () => {
    setShowRules(!showRules);
  };

  const showFeedbackHandler = () => {
    setShowFeedback(true);
  };

  return (
    <AnimatePresence mode="wait">
      {showMenu && (
        <MenuContainer {...motionPropsLeft}>
          <MenuInnerContainer>
            <Header>Menu</Header>
            <CloseContainer
              whileHover={{ scale: 1.1 }}
              onClick={closeChatHandler}
            >
              <Close />
            </CloseContainer>
            <RulesContainer show={showRules} onClick={showRulesHandler}>
              <RulesInnerContainer show={showRules}>
                <LabelName>Rules</LabelName>
              </RulesInnerContainer>
              {/* {showRules && ( */}
              <AllRulesContainer show={showRules}>
                <RulesText>
                  <p>
                    Players proceed to guess on the characteristics of each card
                    in front of them with drinks either given or taken depending
                    on whether they're right or not. So starting to the left of
                    the dealer each player must guess about their unexposed
                    cards, one at a time, according to:
                  </p>
                  <ol>
                    <li>Color of card (red/black)</li>
                    <li>Card is higher or lower than first card</li>
                    <li>
                      Card is in-between or outside of first and second cards
                    </li>
                    <li>Suit of card (Diamond, Heart, Spade, Club)</li>
                  </ol>
                  <p>
                    When a player is either right or wrong they will either
                    "give" or "take" drinks. According to the rounds drinks are
                    valued:
                  </p>{" "}
                  <ul>
                    <li>2 gives/takes</li>
                    <li> 4 gives/takes</li>
                    <li> 6 gives/takes</li>
                    <li> 8 gives/takes</li>
                  </ul>{" "}
                  <p>
                    So the first player to the left of the dealer guesses the
                    color of the card; if he/she gets it right, they "give" 2
                    drinks. They can be given in any amount to any other player
                    at the table (either all to one player or spread around).
                    Then the next player guesses color, gives/ takes etc. Once
                    the first round has gone past every player they start the
                    second round where the drinks are escalated as shown above.
                  </p>
                </RulesText>
              </AllRulesContainer>
              {/* )} */}
            </RulesContainer>
            <FeedbackContainer>
              <Feedback />
            </FeedbackContainer>
          </MenuInnerContainer>
        </MenuContainer>
      )}
    </AnimatePresence>
  );
}

export default Menu;
