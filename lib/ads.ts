// AdSense configuration. The client id must match the loader script in
// src/pages/_document.tsx and the line in public/ads.txt.
export const AD_CLIENT = "ca-pub-3875566048492186";

// Paste each ad unit's data-ad-slot number from the AdSense dashboard
// (Ads → By ad unit → Display). A slot left empty renders nothing in
// production, so this is safe to deploy before the units exist.
export const AD_SLOTS = {
  landing: "5411954790",
  lobby: "4813188994",
  gameOver: "3721387615",
  gameAnchor: "2162939533",
};
