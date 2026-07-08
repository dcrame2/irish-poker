import React from "react";
import styled from "styled-components";
import { theme } from "@/styles/theme";

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Heading = styled.h3`
  font-family: ${theme.fontDisplay};
  font-weight: 400;
  font-size: 1.5rem;
  color: ${theme.gold};
`;

const P = styled.p`
  font-size: 0.98rem;
  line-height: 1.5;
  color: ${theme.creamDim};

  strong {
    color: ${theme.cream};
  }
`;

const RoundList = styled.ol`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-left: 0;
  list-style: none;
  counter-reset: round;
`;

const Round = styled.li`
  font-size: 0.98rem;
  line-height: 1.45;
  color: ${theme.creamDim};
  padding-left: 40px;
  position: relative;
  counter-increment: round;

  strong {
    color: ${theme.cream};
  }

  &::before {
    content: counter(round);
    position: absolute;
    left: 0;
    top: 2px;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: rgba(233, 184, 76, 0.18);
    border: 1px solid ${theme.goldSoft};
    color: ${theme.gold};
    font-weight: 700;
    display: grid;
    place-items: center;
    font-size: 0.85rem;
  }
`;

export default function RulesContent() {
  return (
    <Wrap>
      <Heading>How to Play</Heading>
      <P>
        Everyone gets <strong>4 face-down cards</strong>. The game runs 4
        rounds. In each round, every player takes a turn guessing something
        about their next card before it flips.
      </P>
      <RoundList>
        <Round>
          <strong>Red or Black</strong>: call the color of your first card.
        </Round>
        <Round>
          <strong>Higher or Lower</strong>: will your second card beat your
          first? (A tie loses!)
        </Round>
        <Round>
          <strong>Inside or Outside</strong>: does your third card land
          between your first two, or outside them? (Landing on one loses!)
        </Round>
        <Round>
          <strong>Name the Suit</strong>: the big one. Call the exact suit of
          your last card.
        </Round>
      </RoundList>
      <P>
        <strong>Guess wrong?</strong> You drink. 🍺 <strong>Guess right?</strong>{" "}
        You pick who drinks. Most drinks at the end takes the crown of shame.
      </P>
      <P>
        Play in the same room or across the world. If someone loses
        connection, the game keeps going and their seat is saved until they
        return.
      </P>
    </Wrap>
  );
}
