"use client";

import { useSyncExternalStore } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSearchParams } from "next/navigation";
import { getCurrentPet, getPetByName } from "@/lib/pets";

function subscribe() {
  return () => {};
}

export function DashTitlePet() {
  const searchParams = useSearchParams();
  const currentPet = useSyncExternalStore(subscribe, getCurrentPet, () => null);
  const pet = getPetByName(searchParams.get("pet")) ?? currentPet;

  if (!pet) return null;

  return (
    <span
      className="dash-hero-pet dash-hero-pet-enter"
      aria-label={`Featured pet: ${pet.name}`}
    >
      <FontAwesomeIcon icon={pet.icon} size="1x" />
    </span>
  );
}
