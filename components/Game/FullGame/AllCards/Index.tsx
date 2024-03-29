import styled from "styled-components";
import { MediaQueries } from "@/styles/Utilities";
import SingleCard from "./SingleCard/Index";

const IndividualCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  @media ${MediaQueries.mobile} {
    gap: 12px;
  }
`;

const CardsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4px;
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
  return (
    <CardsContainer>
      {player?.map((singleCard: SingleCard, index: number) => {
        return (
          <IndividualCardContainer key={`player-${index}`}>
            {singleCard.selectedOption ? (
              <SingleCard
                key={`${singleCard.selectedOption}-${singleCard.image}`}
                singleCard={singleCard}
                imageLink={singleCard.image}
              />
            ) : (
              <SingleCard
                key={`default-${singleCard.code}`}
                singleCard={singleCard}
                imageLink="green_card1.jpeg"
              />
            )}
          </IndividualCardContainer>
        );
      })}
    </CardsContainer>
  );
}

export default AllCards;
