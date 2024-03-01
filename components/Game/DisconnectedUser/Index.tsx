import React from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { variables } from "@/styles/Variables";
import { MediaQueries } from "@/styles/Utilities";

const DiconnectedUserContainer = styled(motion.div)`
  border-top: 3px solid ${variables.middleGreen};
  background-color: ${variables.color2};
  padding: 16px;
  position: fixed;
  width: 50%;
  z-index: 12;
  bottom: 0;
  overflow-y: auto;
  border-radius: 24px 24px 0 0;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  text-align: center;
  height: fit-content;
  @media ${MediaQueries.tablet} {
    width: 100%;
  }
  @media ${MediaQueries.mobile} {
    width: 100%;
  }
`;

function DisconnectedUser({ disconnectedUser }: any) {
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
  return (
    <AnimatePresence mode="wait">
      {disconnectedUser && (
        <DiconnectedUserContainer {...motionProps}>
          {disconnectedUser} has been disconnected from the lobby. You will need
          to restart the game. We apologize for this inconvience and are working
          on disconnect logic.
        </DiconnectedUserContainer>
      )}
    </AnimatePresence>
  );
}

export default DisconnectedUser;
