"use client";

import { useState, useEffect, useCallback } from "react";
import { type Pet } from "@/lib/pets";

interface TypewriterPhase {
  text: string;
  isBlue: boolean;
  erase: boolean;
}

function useTypewriter(pet: Pet) {
  const phases: TypewriterPhase[] = [
    { text: "Play", isBlue: false, erase: true },
    { text: "Code", isBlue: false, erase: true },
    { text: `Pet the ${pet.name}`, isBlue: true, erase: false },
  ];

  const [phaseIndex, setPhaseIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [isBlue, setIsBlue] = useState(false);
  const [done, setDone] = useState(false);

  const currentPhase = phases[phaseIndex];

  const tick = useCallback(() => {
    if (done) return;

    if (isTyping) {
      if (displayText.length < currentPhase.text.length) {
        setDisplayText(currentPhase.text.slice(0, displayText.length + 1));
        setIsBlue(currentPhase.isBlue);
      } else {
        if (!currentPhase.erase) {
          setDone(true);
          return;
        }
        setTimeout(() => setIsTyping(false), 1000);
      }
    } else {
      if (displayText.length > 0) {
        setDisplayText(displayText.slice(0, -1));
      } else {
        setTimeout(() => {
          setPhaseIndex((i) => i + 1);
          setIsTyping(true);
        }, 500);
      }
    }
  }, [displayText, isTyping, currentPhase, done]);

  useEffect(() => {
    if (done) return;
    const speed = isTyping ? 80 : 40;
    const timer = setTimeout(tick, speed);
    return () => clearTimeout(timer);
  }, [tick, done, isTyping]);

  return { displayText, isBlue, done };
}

interface TypewriterProps {
  pet: Pet;
}

export function Typewriter({ pet }: TypewriterProps) {
  const { displayText, isBlue, done } = useTypewriter(pet);

  return (
    <span
      className={`text-2xl ${isBlue ? "text-blue-600 dark:text-blue-400" : ""}`}
      aria-live="polite"
    >
      {displayText}
      {!done ? <span className="animate-blink">|</span> : null}
    </span>
  );
}
