"use client";

import { useState, useEffect, useCallback } from "react";
import { getCurrentPet } from "@/lib/pets";

interface TypewriterPhase {
  text: string;
  isBlue: boolean;
  erase: boolean;
}

function useTypewriter() {
  const pet = getCurrentPet();

  const phases: TypewriterPhase[] = [
    { text: "Play!", isBlue: false, erase: true },
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
        // Done typing this phase
        if (!currentPhase.erase) {
          setDone(true);
          return;
        }
        // Pause then start erasing
        setTimeout(() => setIsTyping(false), 1000);
      }
    } else {
      // Erasing
      if (displayText.length > 0) {
        setDisplayText(displayText.slice(0, -1));
      } else {
        // Done erasing, move to next phase
        setTimeout(() => {
          setPhaseIndex((i) => i + 1);
          setIsTyping(true);
        }, 500);
      }
    }
  }, [displayText, isTyping, currentPhase, done, phaseIndex]);

  useEffect(() => {
    if (done) return;
    const speed = isTyping ? 80 : 40;
    const timer = setTimeout(tick, speed);
    return () => clearTimeout(timer);
  }, [tick, done, isTyping]);

  return { displayText, isBlue, done };
}

export function Typewriter() {
  const { displayText, isBlue } = useTypewriter();

  return (
    <span
      className={`text-2xl ${isBlue ? "text-blue-600" : ""}`}
      aria-live="polite"
    >
      {displayText}
      <span className="animate-blink">|</span>
    </span>
  );
}
