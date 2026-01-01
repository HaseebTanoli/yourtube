"use client";

import { useEffect, useRef, useState } from "react";

export default function AnimatedNumber({
  value,
  duration = 600,
}: {
  value: number;
  duration?: number;
}) {
  const [display, setDisplay] = useState(value);
  const previous = useRef(value);

  useEffect(() => {
    const start = previous.current;
    const diff = value - start;
    const startTime = performance.now();

    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      setDisplay(Math.floor(start + diff * progress));

      if (progress < 1) requestAnimationFrame(animate);
      else previous.current = value;
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span className="tabular-nums">{display.toLocaleString()}</span>;
}
