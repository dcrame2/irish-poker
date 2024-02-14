import React from "react";
import styled from "styled-components";

const PushableBtn = styled.button`
  display: block;
  padding: 12px 42px;
  border-radius: 12px;
  font-size: 1.25rem;
  background: hsl(345deg 100% 47%);
  color: white;
  transform: translateY(-6px);
  &:active {
    &.front {
      transform: translateY(-2px);
    }
  }
`;

const FrontBtn = styled.span``;

function Button({
  children,
  onClick,
}: {
  children: string;
  onClick: () => void;
}) {
  return (
    <PushableBtn className="pushable">
      <FrontBtn className="front">{children}</FrontBtn>
    </PushableBtn>
  );
}

export default Button;
