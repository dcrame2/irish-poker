import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const ImageOfCard = styled(motion.img)`
  width: 70px;
`;

function SingleCard({ imageLink }: any) {
  return (
    <ImageOfCard
      initial={{
        opacity: 0,
        rotateX: 360,
        rotateY: 720,
        scale: 0,
      }}
      animate={{
        rotateX: 0,
        opacity: 1,
        rotateY: 0,
        scale: 1,
      }}
      exit={{
        opacity: 0,
        rotateX: 360,
        rotateY: 720,
        scale: 0,
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
