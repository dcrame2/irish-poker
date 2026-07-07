import React, { memo, useEffect, useRef } from "react";
import styled from "styled-components";
import { AD_CLIENT } from "@lib/ads";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/* Fixed-height frame reserved up front so ads never cause layout shift.
   An unfilled slot (ad blocker, no inventory) just reads as dark chrome. */
const Frame = styled.div<{ $height: number; $maxWidth?: number }>`
  width: ${({ $maxWidth }) =>
    $maxWidth ? `min(${$maxWidth}px, 100%)` : "100%"};
  height: ${({ $height }) => $height}px;
  min-height: ${({ $height }) => $height}px;
  overflow: hidden;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.25);
`;

const Unit = styled.ins`
  display: block;
  width: 100%;
  height: 100%;
`;

const Placeholder = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  border: 1px dashed rgba(255, 255, 255, 0.22);
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.35);
  font-size: 0.72rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
`;

// AdSense rewrites the DOM inside the <ins>, so React must never touch it
// again after the initial push — memo keeps re-renders away.
const AdUnit = memo(function AdUnit({ slot }: { slot: string }) {
  const pushed = useRef(false);
  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* ad blocker — the frame just stays empty */
    }
  }, []);
  return (
    <Unit
      className="adsbygoogle"
      data-ad-client={AD_CLIENT}
      data-ad-slot={slot}
      data-full-width-responsive="false"
    />
  );
});

interface Props {
  slot: string;
  height: number;
  maxWidth?: number;
  className?: string;
}

export default function AdBanner({ slot, height, maxWidth, className }: Props) {
  // AdSense never serves on localhost — show the reserved box instead so
  // layout can be checked in dev.
  if (process.env.NODE_ENV !== "production") {
    return (
      <Frame $height={height} $maxWidth={maxWidth} className={className}>
        <Placeholder>Ad</Placeholder>
      </Frame>
    );
  }
  if (!slot) return null;
  return (
    <Frame $height={height} $maxWidth={maxWidth} className={className}>
      <AdUnit slot={slot} />
    </Frame>
  );
}
