import { MediaQueries } from "./Utilities";
import { css } from "styled-components";
import { keyframes } from "styled-components";
import { variables } from "./Variables";

const monsterrat = `Montserrat, sans-serif`;
const openSans = "Open Sans, sans-serif";

export const h1styles = css`
  font-family: ${openSans};
  text-transform: uppercase;
  font-size: 8rem;
  line-height: 9.4rem;
  color: #ffff;

  @media ${MediaQueries.tablet} {
    font-size: 4rem;
    line-height: 4.8rem;
  }

  @media ${MediaQueries.mobile} {
    font-size: 3rem;
    line-height: 3.2rem;
  }
`;

export const h2styles = css`
  font-family: ${monsterrat};
  font-size: 2rem;
  line-height: 5rem;
  color: #ffff;

  @media ${MediaQueries.tablet} {
    font-size: 1.5rem;
    line-height: 3rem;
  }

  @media ${MediaQueries.mobile} {
    font-size: 1.9rem;
    line-height: 2%.5rem;
  }
`;

export const h3styles = css`
  font-family: ${openSans};
  font-size: 5.2rem;
  line-height: 6.3rem;
  font-weight: 300;
  color: #ffff;

  @media ${MediaQueries.tablet} {
    font-size: 3.7rem;
    line-height: 3.8rem;
  }

  @media ${MediaQueries.mobile} {
    font-size: 3.2rem;
    line-height: 3.3rem;
  }
`;

export const h4styles = css`
  font-family: ${openSans};
  font-size: 2rem;
  line-height: 3.4rem;
  font-weight: 300;
  color: #ffff;

  @media ${MediaQueries.tablet} {
    font-size: 1.8rem;
    line-height: 3rem;
  }

  @media ${MediaQueries.mobile} {
    font-size: 1.6rem;
    line-height: 2.8rem;
  }
`;

export const pLarge = css`
  font-family: ${openSans};
  font-size: 2.4rem;
  line-height: 3.2rem;
  font-weight: 300;
  /* color: #ffff; */

  @media ${MediaQueries.tablet} {
    font-size: 1.4rem;
    line-height: 1.8rem;
  }
`;

export const pBase = css`
  font-family: ${openSans};
  font-size: 1.5rem;
  line-height: 1.7rem;
  font-weight: 300;
  color: #ffff;

  @media ${MediaQueries.tablet} {
    font-size: 1.3rem;
    line-height: 1.4rem;
  }
`;

export const pSmall = css`
  font-family: ${openSans};
  font-size: 1.1rem;
  line-height: 1.3rem;
  font-weight: 300;
  color: #ffff;
`;

export const pXSmall = css`
  font-family: ${openSans};
  font-size: 1rem;
  line-height: 1.2rem;
  font-weight: 300;
  color: #ffff;
`;

export const buttonType = css`
  font-family: ${openSans};
  font-size: 1rem;
  /* line-height: 2.4rem; */
  padding: 10px 12px;
  font-weight: 300;
  text-transform: uppercase;
  color: white;
  background-color: ${variables.color1};
  border: none;
  width: max-content;
  min-width: 100px;
  cursor: pointer;
  transition: background-color 0.3s ease-in;
  border: 2px solid ${variables.color1};
  &:hover {
    transition: background-color 0.3s ease-in;
    border: 2px solid ${variables.color1};
    background-color: transparent;
    transition: background-color 0.3s ease-in;
  }
`;

export const inputType = css`
  font-size: 1rem;
  text-transform: uppercase;
  padding: 12px 10px;
  border: none;
  border: 2px solid ${variables.color1};
`;
