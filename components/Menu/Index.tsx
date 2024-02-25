import React, { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { variables } from "@/styles/Variables";
import Close from "../../svg/close/Index";
import { h2styles, pBase, pSmall } from "@/styles/Type";
import Feedback from "./Feedback/Index";

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

const CloseContainer = styled.div`
  width: 20px;
  position: absolute;
  top: 15px;
  right: 15px;
  height: 20px;
  z-index: 21;
`;

const Header = styled.h2`
  ${h2styles}
  text-align: center;
`;

const RulesContainer = styled.div<RulesContainerProps>`
  background-color: ${variables.darkGreen};
  margin: 16px 0 0px;
  padding: 12px 24px;
  border-radius: 12px;
  max-height: ${(props) => (props.show ? "800px" : "50px")};
  overflow: hidden;
  transition: max-height 0.5s ease-in;
`;

const RulesInnerContainer = styled.button`
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

const AllRulesContainer = styled.div<RulesContainerProps>`
  /* display: ${(props) => (props.show ? "block" : "none")}; */
`;

const RulesText = styled.p`
  ${pSmall}
`;

const LabelName = styled.p`
  ${pBase}
`;

const FeedbackContainer = styled.div`
  background-color: ${variables.darkGreen};
  margin: 16px 0 0px;
  padding: 12px 24px;
  border-radius: 12px;
  /* min-height: 50px; */

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
            <CloseContainer onClick={closeChatHandler}>
              <Close />
            </CloseContainer>
            <RulesContainer show={showRules} onClick={showRulesHandler}>
              <RulesInnerContainer>
                <LabelName>Rules</LabelName>
              </RulesInnerContainer>
              {showRules && (
                <AllRulesContainer show={showRules}>
                  <RulesText>
                    Players proceed to guess on the characteristics of each card
                    in front of them with drinks either given or taken depending
                    on whether they're right or not. So starting to the left of
                    the dealer each player must guess about their unexposed
                    cards, one at a time, according to: Color of card
                    (red/black) Card is higher or lower than first card Card is
                    in-between or outside of first and second cards Suit of card
                    When a player is either right or wrong they will either
                    "give" or "take" drinks. According to the rounds drinks are
                    valued: 2 gives/takes 4 gives/takes 6 gives/takes 8
                    gives/takes So the first player to the left of the dealer
                    guesses the color of the card; if he/she gets it right, they
                    "give" 2 drinks. They can be given in any amount to any
                    other player at the table (either all to one player or
                    spread around). Then the next player guesses color, gives/
                    takes etc. Once the first round has gone past every player
                    they start the second round where the drinks are escalated
                    as shown above.
                  </RulesText>
                </AllRulesContainer>
              )}
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
