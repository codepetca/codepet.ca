"use client";

import { useSyncExternalStore } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSearchParams } from "next/navigation";
import { getCurrentPet, getPetByName } from "@/lib/pets";

function subscribe() {
  return () => {};
}

function useFeaturedPet() {
  const searchParams = useSearchParams();
  const currentPet = useSyncExternalStore(subscribe, getCurrentPet, () => null);
  return getPetByName(searchParams.get("pet")) ?? currentPet;
}

export function DashTitlePet() {
  const pet = useFeaturedPet();

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

export function DashTagline() {
  const pet = useFeaturedPet();
  if (!pet) return null;

  const article = /^[aeiou]/i.test(pet.name) ? "an" : "a";
  return <>Play. Code. Pet {article} {pet.name}.</>;
}
