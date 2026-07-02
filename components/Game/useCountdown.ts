import { useEffect, useState, MutableRefObject } from "react";

// Seconds remaining until a server-supplied deadline (ms epoch), corrected
// by the measured server/client clock offset. Returns null when no deadline.
export function useCountdown(
  deadline: number | null | undefined,
  clockOffsetRef: MutableRefObject<number>
): number | null {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (!deadline) {
      setRemaining(null);
      return;
    }
    const tick = () => {
      const now = Date.now() + clockOffsetRef.current;
      setRemaining(Math.max(0, Math.ceil((deadline - now) / 1000)));
    };
    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [deadline, clockOffsetRef]);

  return remaining;
}
