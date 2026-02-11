"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { getCurrentPet } from "@/lib/pets";

export function PetIcon() {
  const [showHeart, setShowHeart] = useState(false);
  const pet = getCurrentPet();

  function handleClick() {
    if (showHeart) return;
    setShowHeart(true);
  }

  return (
    <button
      onClick={handleClick}
      className="relative cursor-pointer"
      aria-label={`Pet the ${pet.name}`}
    >
      <FontAwesomeIcon icon={pet.icon} size="6x" />
      {showHeart && (
        <span
          className="absolute -top-14 right-0 animate-heart-float"
          onAnimationEnd={() => setShowHeart(false)}
        >
          <FontAwesomeIcon icon={faHeart} size="3x" className="text-red-500" />
        </span>
      )}
    </button>
  );
}
