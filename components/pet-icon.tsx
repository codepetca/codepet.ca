"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { type Pet } from "@/lib/pets";

interface PetIconProps {
  pet: Pet;
  onPet?: () => void;
  disabled?: boolean;
}

export function PetIcon({ pet, onPet, disabled }: PetIconProps) {
  const [showHeart, setShowHeart] = useState(false);
  const [heartId, setHeartId] = useState(0);

  function handleClick() {
    setHeartId((id) => id + 1);
    setShowHeart(true);
    onPet?.();
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className="relative cursor-pointer disabled:cursor-wait disabled:opacity-70"
      aria-label={`Pet the ${pet.name}`}
    >
      <FontAwesomeIcon icon={pet.icon} size="6x" />
      {showHeart && (
        <span
          key={heartId}
          className="absolute -top-14 right-0 animate-heart-float"
          onAnimationEnd={() => setShowHeart(false)}
        >
          <FontAwesomeIcon icon={faHeart} size="3x" className="text-red-500" />
        </span>
      )}
    </button>
  );
}
