import Link from "next/link";
import styled from "styled-components";
import { motion } from "framer-motion";
import { theme, mq } from "@/styles/theme";
import {
  PageShell,
  MarketingNav,
  MarketingFooter,
  Section,
  Kicker,
  SectionTitle,
  Lead,
  Center,
  CtaBand,
  fadeUp,
} from "../Marketing/shared";
import Seo, { SITE_ORIGIN } from "../Marketing/Seo";
import AdBanner from "../Ads/AdBanner";
import { AD_SLOTS } from "@lib/ads";
import { GUIDES, type GuideMeta } from "@lib/guides";

/* ---------------------------------------------------------------------------
   Shared layout for /guides articles: SEO tags (Article + breadcrumb
   JSON-LD), the article prose styles, one ad slot, and "keep reading" links
   to the other guides. Each guide page just supplies its registry entry and
   body content.
--------------------------------------------------------------------------- */

const PageTitle = styled.h1`
  font-family: ${theme.fontDisplay};
  font-weight: 400;
  font-size: clamp(2.2rem, 6vw, 3.6rem);
  line-height: 1.08;
  color: ${theme.cream};
  text-shadow: 0 2px 0 rgba(0, 0, 0, 0.4), 0 0 40px rgba(233, 184, 76, 0.25);
  margin-bottom: 14px;
`;

const Byline = styled.p`
  color: rgba(244, 239, 225, 0.55);
  font-size: 0.92rem;
  letter-spacing: 0.05em;
  margin-bottom: 16px;
`;

export const Article = styled.div`
  max-width: 780px;
  margin: 0 auto;

  h2 {
    font-family: ${theme.fontDisplay};
    font-weight: 400;
    font-size: clamp(1.7rem, 4vw, 2.3rem);
    color: ${theme.cream};
    text-shadow: 0 2px 0 rgba(0, 0, 0, 0.4);
    margin: 40px 0 12px;
  }

  h3 {
    font-family: ${theme.fontDisplay};
    font-weight: 400;
    font-size: 1.45rem;
    color: ${theme.gold};
    margin: 30px 0 10px;
  }

  p {
    font-size: 1.03rem;
    line-height: 1.7;
    color: ${theme.creamDim};
    margin: 12px 0;
  }

  p strong,
  li strong {
    color: ${theme.cream};
  }

  a {
    color: ${theme.gold};
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  ul,
  ol {
    margin: 12px 0 12px 24px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  li {
    font-size: 1.01rem;
    line-height: 1.65;
    color: ${theme.creamDim};
  }

  em {
    color: ${theme.cream};
  }
`;

/* green tip / callout box, matches how-to-play's TipRow */
export const Callout = styled.p`
  background: rgba(79, 200, 120, 0.08);
  border: 1px solid rgba(79, 200, 120, 0.28);
  border-radius: 12px;
  padding: 12px 16px !important;
  font-size: 0.97rem !important;

  strong {
    color: ${theme.clover} !important;
  }
`;

/* gold example / story box, matches how-to-play's Example */
export const Example = styled.div`
  border-left: 3px solid ${theme.goldSoft};
  background: rgba(0, 0, 0, 0.25);
  border-radius: 0 14px 14px 0;
  padding: 14px 18px;
  margin: 14px 0;

  p {
    margin: 4px 0;
    font-size: 0.97rem;
  }

  em {
    color: ${theme.gold};
    font-style: normal;
    font-weight: 600;
  }
`;

/* wide tables scroll inside their own container instead of the page */
export const TableScroller = styled.div`
  overflow-x: auto;
  margin: 16px 0;

  table {
    border-collapse: collapse;
    width: 100%;
    min-width: 540px;
  }

  th {
    font-family: ${theme.fontDisplay};
    font-weight: 400;
    font-size: 1.05rem;
    color: ${theme.gold};
    text-align: left;
    padding: 10px 14px;
    border-bottom: 1px solid ${theme.goldSoft};
  }

  td {
    padding: 10px 14px;
    color: ${theme.creamDim};
    font-size: 0.98rem;
    line-height: 1.55;
    border-bottom: 1px solid rgba(233, 184, 76, 0.12);
    vertical-align: top;
  }

  td strong {
    color: ${theme.cream};
  }

  @media ${mq.mobile} {
    th,
    td {
      padding: 9px 10px;
    }
  }
`;

const AdSlot = styled.div`
  display: flex;
  justify-content: center;
  max-width: 780px;
  margin: 34px auto 0;
`;

const MoreGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(250px, 100%), 1fr));
  gap: 16px;
  max-width: 780px;
  margin: 20px auto 0;
`;

const MoreCard = styled(Link)`
  display: block;
  background: ${theme.panel};
  border: 1px solid ${theme.panelBorder};
  border-radius: 18px;
  padding: 20px;
  transition: transform 0.15s ease, border-color 0.15s ease;

  &:hover {
    transform: translateY(-3px);
    border-color: ${theme.goldSoft};
  }

  h3 {
    font-family: ${theme.fontDisplay};
    font-weight: 400;
    font-size: 1.15rem;
    color: ${theme.gold};
    margin-bottom: 6px;
  }

  p {
    font-size: 0.9rem;
    line-height: 1.55;
    color: ${theme.creamDim};
  }
`;

const MoreTitle = styled.h2`
  font-family: ${theme.fontDisplay};
  font-weight: 400;
  font-size: 1.6rem;
  color: ${theme.cream};
  max-width: 780px;
  margin: 0 auto;
`;

interface Props {
  guide: GuideMeta;
  /** Optional intro paragraph shown under the title, above the body */
  lead: string;
  children: React.ReactNode;
}

export default function ArticleLayout({ guide, lead, children }: Props) {
  const url = `${SITE_ORIGIN}/guides/${guide.slug}`;
  const related = GUIDES.filter((g) => g.slug !== guide.slug).slice(0, 3);

  return (
    <>
      <Seo
        title={`${guide.title} | Irish Poker`}
        description={guide.description}
        path={`/guides/${guide.slug}`}
        ogType="article"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: guide.title,
            description: guide.description,
            url,
            datePublished: guide.datePublished,
            dateModified: guide.dateModified,
            author: { "@type": "Person", name: "Dylan Cramer" },
            publisher: {
              "@type": "Organization",
              name: "Irish Poker",
              url: SITE_ORIGIN,
            },
            mainEntityOfPage: url,
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: `${SITE_ORIGIN}/`,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Guides",
                item: `${SITE_ORIGIN}/guides`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: guide.title,
                item: url,
              },
            ],
          },
        ]}
      />

      <PageShell>
        <MarketingNav />

        <Section as="header">
          <Center>
            <motion.div {...fadeUp}>
              <Kicker>
                <Link
                  href="/guides"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  Guides
                </Link>{" "}
                {guide.emoji}
              </Kicker>
              <PageTitle>{guide.title}</PageTitle>
              <Byline>
                By Dylan Cramer · Updated{" "}
                {new Date(`${guide.dateModified}T12:00:00Z`).toLocaleDateString(
                  "en-US",
                  { year: "numeric", month: "long", day: "numeric" }
                )}{" "}
                · {guide.readMinutes} min read
              </Byline>
              <Lead>{lead}</Lead>
            </motion.div>
          </Center>
        </Section>

        <Section style={{ paddingTop: 0 }}>
          <Article>{children}</Article>
          <AdSlot>
            <AdBanner slot={AD_SLOTS.landing} height={90} maxWidth={728} />
          </AdSlot>
        </Section>

        <Section style={{ paddingTop: 0 }}>
          <MoreTitle>Keep reading</MoreTitle>
          <MoreGrid>
            {related.map((g) => (
              <MoreCard key={g.slug} href={`/guides/${g.slug}`}>
                <h3>
                  {g.emoji} {g.shortTitle}
                </h3>
                <p>{g.description}</p>
              </MoreCard>
            ))}
          </MoreGrid>
        </Section>

        <Section style={{ paddingTop: 0 }}>
          <CtaBand
            title="Reading about it only gets you so far."
            text="Start a free Irish Poker party, share the 4-letter code, and put the theory to work."
          />
        </Section>

        <MarketingFooter />
      </PageShell>
    </>
  );
}
