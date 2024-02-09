import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { MediaQueries } from "@/styles/Utilities";
import { variables } from "@/styles/Variables";
import { buttonType, h2styles, h3styles, pLarge, pSmall } from "@/styles/Type";
import SingleCard from "./SingleCard/Index";

const IndividualCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const CardsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
`;

type SingleCard = {
  player: string;
  image: string;
  code: string;
  images: [];
  suit: string;
  value: string;
  selectedOption?: string;
  socketId: string;
  cardNext?: boolean;
};

function AllCards({ player }: any) {
  const ref = useRef(null);
  return (
    <CardsContainer ref={ref}>
      {player?.map((singleCard: SingleCard, index: number) => {
        return (
          <IndividualCardContainer key={`player-${index}`}>
            {singleCard.selectedOption ? (
              // <SingleCard
              //   key={`${singleCard.selectedOption}-${singleCard.image}`}
              //   singleCard={singleCard}
              //   imageLink={singleCard.image}
              // />
              <p>{singleCard.code}</p>
            ) : (
              <SingleCard
                key={`default-${singleCard.code}`}
                singleCard={singleCard}
                imageLink="white_card.png"
              />
            )}
          </IndividualCardContainer>
        );
      })}
    </CardsContainer>
  );
}

export default AllCards;