import React from "react";
import Form from "./Form/Index";
import styled from "styled-components";
import { pBase, pSmall, pLarge2 } from "@/styles/Type";

const Header = styled.p`
  margin-bottom: 8px;
  ${pLarge2}
`;

const FeedbackParagraph = styled.p`
  ${pSmall}
  margin-bottom: 8px;
`;

function Feedback() {
  return (
    <>
      <Header>Feedback</Header>
      <FeedbackParagraph>
        Did you experience a bug? Do you have a feature idea? Do you want to
        tell us how great this app is? Fill out this form to help us make Irish
        Poker more enjoyable for you and everyone else.
      </FeedbackParagraph>
      <Form />
    </>
  );
}

export default Feedback;
