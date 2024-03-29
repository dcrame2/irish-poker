import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { MediaQueries } from "@/styles/Utilities";

const ImageOfCard = styled(motion.img)`
  width: 50px;
  @media ${MediaQueries.mobile} {
    width: 40px;
  }
  @media ${MediaQueries.mobile} {
    width: 35px;
  }
`;

function SingleCard({ imageLink }: any) {
  return (
    <ImageOfCard
      initial={{
        // opacity: 0,
        // rotateX: 360,
        rotateY: 180,
        // scale: 0,
      }}
      animate={{
        // rotateX: 0,
        // opacity: 1,
        rotateY: 0,
        // scale: 1,
      }}
      exit={{
        opacity: 0,
        // rotateX: 360,
        rotateY: 180,
        // scale: 0,
      }}
      transition={{
        duration: `0.5`,
        ease: "easeInOut",
      }}
      src={imageLink}
    />
  );
}

export default SingleCard;
