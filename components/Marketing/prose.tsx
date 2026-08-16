import Link from "next/link";
import styled from "styled-components";
import { theme, mq } from "@/styles/theme";

/* ---------------------------------------------------------------------------
   Simple long-form prose layout shared by the "trust" pages (/privacy,
   /terms, /about, /contact). Originally lived in privacy.tsx.
--------------------------------------------------------------------------- */

export const ProseMain = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 20px 60px;
  position: relative;
  z-index: 1;
`;

export const ProseArticle = styled.article`
  width: min(720px, 100%);
  color: ${theme.cream};
  line-height: 1.6;

  h1 {
    font-size: clamp(2rem, 6vw, 3rem);
    text-align: center;
    margin-bottom: 8px;
  }

  h2 {
    font-family: ${theme.fontDisplay};
    font-weight: 400;
    color: ${theme.gold};
    font-size: 1.4rem;
    margin: 34px 0 10px;
  }

  p,
  li {
    color: ${theme.creamDim};
    font-size: 1.02rem;
  }

  p {
    margin: 10px 0;
  }

  ul,
  ol {
    margin: 10px 0 10px 22px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  a {
    color: ${theme.gold};
    text-underline-offset: 3px;
  }

  strong {
    color: ${theme.cream};
  }

  @media ${mq.mobile} {
    h2 {
      font-size: 1.25rem;
    }
  }
`;

export const Updated = styled.p`
  text-align: center;
  color: ${theme.creamDim};
  font-size: 0.9rem;
  letter-spacing: 0.06em;
  margin-bottom: 8px;
`;

export const BackLink = styled(Link)`
  display: inline-block;
  margin: 28px 0 8px;
  color: ${theme.gold};
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
