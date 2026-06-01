"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSearchParams } from "next/navigation";
import { getPetByName } from "@/lib/pets";

export function DashTitlePet() {
  const searchParams = useSearchParams();
  const pet = getPetByName(searchParams.get("pet"));

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
