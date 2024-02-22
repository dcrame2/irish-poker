import { MediaQueries } from "./Utilities";
import { css } from "styled-components";
import { keyframes } from "styled-components";
import { variables } from "./Variables";

const monsterrat = `Montserrat, sans-serif`;
const openSans = "Open Sans, sans-serif";
const jost = "Jost, sans-serif";
const irishGrover = "Irish Grover, system-ui";

export const h1styles = css`
  font-family: ${irishGrover};
  /* text-transform: uppercase; */
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
    text-align: center;
    margin-bottom: 12px;
  }
`;

export const h2styles = css`
  font-family: ${jost};
  font-size: 2rem;
  line-height: 5rem;
  color: #ffff;

  @media ${MediaQueries.tablet} {
    font-size: 1.5rem;
    line-height: 3rem;
  }

  @media ${MediaQueries.mobile} {
    font-size: 1.9rem;
    line-height: 2.5rem;
  }
`;

export const h3styles = css`
  font-family: ${jost};
  /* text-transform: uppercase; */
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

export const h4styles = css`
  font-family: ${jost};
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
  font-family: ${jost};
  font-size: 2.4rem;
  line-height: 3.2rem;
  font-weight: 300;
  /* color: #ffff; */

  @media ${MediaQueries.tablet} {
    font-size: 1.4rem;
    line-height: 1.8rem;
  }
  @media ${MediaQueries.mobile} {
    font-size: 2.3rem;
    line-height: 1.8rem;
  }
`;

export const pBase = css`
  font-family: ${jost};
  font-size: 1.5rem;
  line-height: 1.7rem;
  font-weight: 300;
  color: #ffff;

  @media ${MediaQueries.tablet} {
    font-size: 1.3rem;
    line-height: 1.4rem;
  }
  @media ${MediaQueries.mobile} {
    font-size: 1.1rem;
    line-height: 1.4rem;
  }
`;

export const pSmall = css`
  font-family: ${jost};
  font-size: 1.1rem;
  line-height: 1.3rem;
  font-weight: 300;
  color: #ffff;

  @media ${MediaQueries.tablet} {
    font-size: 1rem;
    line-height: 1.1rem;
  }
  @media ${MediaQueries.mobile} {
    font-size: 1rem;
    line-height: 1.1rem;
  }
`;

export const pXSmall = css`
  font-family: ${jost};
  font-size: 1rem;
  line-height: 1.2rem;
  font-weight: 300;
  color: #ffff;
`;

export const buttonType = css`
  font-family: ${jost};
  font-size: 1rem;
  /* border-radius: 12px; */
  padding: 10px 12px;
  font-weight: 300;
  color: white;
  background-color: ${variables.darkGreen};
  border: none;
  width: max-content;
  min-width: 100px;
  ${pBase}
  cursor: pointer;
  transition: background-color 0.3s ease-in;
  /* box-shadow: 1px 2px 0px 0px ${variables.clover}; */
  border-bottom: 4px solid ${variables.middleGreen};
  border-top: 1px solid ${variables.color1};
  border-right: 1px solid ${variables.color1};
  border-left: 1px solid ${variables.color1};

  &:hover {
    transition: background-color 0.3s ease-in;

    border-bottom: 4px solid ${variables.middleGreen};
    background-color: ${variables.darkGreen};
    /* background-color: transparent; */
    transition: background-color 0.3s ease-in;
  }
  @media ${MediaQueries.mobile} {
    padding: 5px 6px;
    /* width: 100%; */
  }
`;

export const inputType = css`
  padding: 15px;
  background-color: unset;

  border: 1px solid ${variables.white};
  width: 100%;
  ${pSmall}
`;

export const boxShadows = css`
  -webkit-box-shadow: 2px 4px 0px 2px ${variables.darkGreen};
  -moz-box-shadow: 2px 4px 0px 2px ${variables.darkGreen};
  box-shadow: 2px 4px 0px 2px ${variables.darkGreen};
`;

export const boxShadowsRed = css`
  -webkit-box-shadow: 2px 4px 0px 2px ${variables.color5};
  -moz-box-shadow: 2px 4px 0px 2px ${variables.color5};
  box-shadow: 2px 4px 0px 2px ${variables.color5};
`;
