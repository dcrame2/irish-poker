import React from "react";
import Form from "./Form/Index";
import styled from "styled-components";

const Header = styled.p`
  margin-bottom: 8px;
`;

function Feedback() {
  return (
    <>
      <Header>Feedback</Header>
      <Form />
    </>
  );
}

export default Feedback;
