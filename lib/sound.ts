// Tiny synthesized SFX engine — everything is generated with WebAudio,
// no audio files to download. All sounds are short, soft, and muteable.

const MUTE_KEY = "irish-poker:muted";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let muted: boolean | null = null;

function isMuted(): boolean {
  if (muted === null) {
    muted =
      typeof window !== "undefined" &&
      localStorage.getItem(MUTE_KEY) === "1";
  }
  return muted;
}

function setMuted(m: boolean) {
  muted = m;
  if (typeof window !== "undefined") {
    localStorage.setItem(MUTE_KEY, m ? "1" : "0");
  }
}

// Browsers require a user gesture before audio can play. Call once from a
// pointerdown listener; afterwards every event-driven sound works.
function unlock() {
  ensure();
}

function ensure(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AC = window.AudioContext || (window as any).webkitAudioContext;
  if (!AC) return null;
  if (!ctx) {
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

interface ToneOpts {
  freq: number;
  type?: OscillatorType;
  dur?: number;
  vol?: number;
  delay?: number;
  glideTo?: number;
}

function tone({ freq, type = "sine", dur = 0.15, vol = 0.2, delay = 0, glideTo }: ToneOpts) {
  const c = ensure();
  if (!c || !master || isMuted()) return;
  const t0 = c.currentTime + delay;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, t0 + dur);
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(vol, t0 + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain).connect(master);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

function noiseBurst({ dur = 0.06, vol = 0.12, delay = 0, filter = 3200 }) {
  const c = ensure();
  if (!c || !master || isMuted()) return;
  const t0 = c.currentTime + delay;
  const len = Math.max(1, Math.floor(c.sampleRate * dur));
  const buf = c.createBuffer(1, len, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / len);
  }
  const src = c.createBufferSource();
  src.buffer = buf;
  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = filter;
  const gain = c.createGain();
  gain.gain.value = vol;
  src.connect(bp).connect(gain).connect(master!);
  src.start(t0);
}

export const sound = {
  isMuted,
  setMuted,
  unlock,

  // UI tap
  click() {
    tone({ freq: 720, type: "triangle", dur: 0.06, vol: 0.1 });
  },

  // Cards fly out of the deck
  deal() {
    for (let i = 0; i < 8; i++) {
      noiseBurst({ dur: 0.05, vol: 0.1, delay: i * 0.085, filter: 2600 + i * 150 });
    }
  },

  // A card flips over
  flip() {
    noiseBurst({ dur: 0.09, vol: 0.14, filter: 2200 });
    tone({ freq: 520, type: "triangle", dur: 0.07, vol: 0.07, delay: 0.04 });
  },

  // It's your go
  yourTurn() {
    tone({ freq: 659, type: "sine", dur: 0.16, vol: 0.18 });
    tone({ freq: 880, type: "sine", dur: 0.28, vol: 0.18, delay: 0.14 });
  },

  // Correct call — little ascending arpeggio
  lucky() {
    const notes = [523, 659, 784, 1046];
    notes.forEach((f, i) =>
      tone({ freq: f, type: "triangle", dur: 0.18, vol: 0.16, delay: i * 0.09 })
    );
  },

  // Wrong call — descending womp
  unlucky() {
    tone({ freq: 220, type: "sawtooth", dur: 0.4, vol: 0.12, glideTo: 130 });
    tone({ freq: 110, type: "sine", dur: 0.45, vol: 0.14, glideTo: 65, delay: 0.05 });
  },

  // Drinks handed out — glass clink
  clink() {
    tone({ freq: 1720, type: "sine", dur: 0.1, vol: 0.14 });
    tone({ freq: 2350, type: "sine", dur: 0.16, vol: 0.1, delay: 0.06 });
  },

  // Emote / player joined pop
  pop() {
    tone({ freq: 340, type: "sine", dur: 0.09, vol: 0.14, glideTo: 620 });
  },

  // Game over fanfare
  fanfare() {
    const notes = [392, 523, 659, 784, 1046];
    notes.forEach((f, i) =>
      tone({ freq: f, type: "triangle", dur: 0.3, vol: 0.15, delay: i * 0.12 })
    );
  },
};

export function haptic(pattern: number | number[]) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      /* not supported */
    }
  }
}
