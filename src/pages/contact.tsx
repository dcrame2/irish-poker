import { useState } from "react";
import Link from "next/link";
import styled from "styled-components";
import { theme } from "@/styles/theme";
import {
  DisplayTitle,
  TextInput,
  GoldButton,
} from "../../components/ui/shared";
import {
  PageShell,
  MarketingNav,
  MarketingFooter,
} from "../../components/Marketing/shared";
import { ProseMain, ProseArticle } from "../../components/Marketing/prose";
import Seo from "../../components/Marketing/Seo";

const CONTACT_EMAIL = "dcrame2@gmail.com";

const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 18px 0 10px;

  label {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 0.92rem;
    font-weight: 600;
    color: ${theme.cream};
    letter-spacing: 0.03em;
  }

  textarea {
    background: ${theme.glass};
    border: 1px solid ${theme.panelBorder};
    border-radius: 14px;
    color: ${theme.cream};
    font-family: ${theme.fontBody};
    font-size: 1rem;
    padding: 12px 14px;
    min-height: 140px;
    resize: vertical;

    &:focus {
      outline: none;
      border-color: ${theme.gold};
    }
  }

  button {
    align-self: flex-start;
    padding: 12px 30px;
  }
`;

const StatusNote = styled.p<{ $error?: boolean }>`
  font-weight: 600;
  color: ${({ $error }) => ($error ? theme.danger : theme.clover)} !important;
`;

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/form-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("sent");
      setMessage("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <Seo
        title="Contact Us | Irish Poker"
        description="Get in touch with the maker of Irish Poker: report a bug, suggest a feature, ask a rules question, or just tell us about your best round-four call."
        path="/contact"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "Contact Irish Poker",
            url: "https://irish-poker.com/contact",
          },
        ]}
      />

      <PageShell>
        <MarketingNav />
        <ProseMain>
          <ProseArticle>
            <DisplayTitle as="h1">Contact Us</DisplayTitle>

            <p>
              Irish Poker is built and run by one person, which means your
              message lands directly in the inbox of the guy who can actually
              fix the thing. No ticket numbers, no &ldquo;your call is important
              to us.&rdquo;
            </p>

            <h2>What to write in about</h2>
            <ul>
              <li>
                <strong>Bugs:</strong> a card that wouldn&rsquo;t flip, a party
                code that wouldn&rsquo;t join, a layout that looks wrong on your
                phone. Include your device and browser if you can.
              </li>
              <li>
                <strong>Feature ideas:</strong> a house rule you want built in,
                a variation your crew swears by, anything that would make game
                night better.
              </li>
              <li>
                <strong>Rules questions:</strong> if the{" "}
                <Link href="/how-to-play">how-to-play guide</Link> and the{" "}
                <Link href="/guides">guides</Link> didn&rsquo;t settle the
                argument, we&rsquo;ll be the tiebreaker.
              </li>
              <li>
                <strong>Privacy or legal:</strong> anything covered by the{" "}
                <Link href="/privacy">Privacy Policy</Link> or{" "}
                <Link href="/terms">Terms of Use</Link>.
              </li>
            </ul>

            <h2>Send a message</h2>
            <ContactForm onSubmit={send}>
              <label>
                Name (optional)
                <TextInput
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  maxLength={80}
                />
              </label>
              <label>
                Email (optional, so we can reply)
                <TextInput
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  maxLength={120}
                />
              </label>
              <label>
                Message
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What's on your mind?"
                  maxLength={2000}
                  required
                />
              </label>
              <GoldButton type="submit" disabled={status === "sending"}>
                {status === "sending" ? "Sending…" : "Send message"}
              </GoldButton>
              {status === "sent" && (
                <StatusNote>
                  Got it — thanks! If you left an email, we&rsquo;ll get back to
                  you soon.
                </StatusNote>
              )}
              {status === "error" && (
                <StatusNote $error>
                  Something went wrong sending that. Please email us directly at{" "}
                  {CONTACT_EMAIL}.
                </StatusNote>
              )}
            </ContactForm>

            <h2>Prefer plain email?</h2>
            <p>
              Write to{" "}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. We read
              everything and usually reply within a few days.
            </p>
          </ProseArticle>
        </ProseMain>
        <MarketingFooter />
      </PageShell>
    </>
  );
}
