import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { MediaQueries } from "@/styles/Utilities";

const ImageOfCard = styled(motion.img)`
  width: 50px;
  @media ${MediaQueries.mobile} {
    width: 45px;
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
      // initial={{
      //   x: -1000, // Start off-screen to the left
      //   rotateY: 180, // Initial flip
      // }}
      // animate={{
      //   x: 0, // Slide in from the left
      //   rotateY: 0, // Final flip
      // }}
      // exit={{
      //   x: -1000, // Slide off-screen to the left
      //   rotateY: 180, // Exit flip
      // }}
      // transition={{
      //   duration: 0.5,
      //   ease: "easeInOut",
      // }}
      src={imageLink}
    />
  );
}

export default SingleCard;
