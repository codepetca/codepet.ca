"use client";

import { useSyncExternalStore } from "react";
import { PetIcon } from "@/components/pet-icon";
import { Typewriter } from "@/components/typewriter";
import { getCurrentPet } from "@/lib/pets";

function subscribe() {
  return () => {};
}

export function HomeContent() {
  const pet = useSyncExternalStore(subscribe, getCurrentPet, () => null);

  return (
    <div className="flex flex-col items-center gap-2">
      {pet ? (
        <>
          <PetIcon pet={pet} />
          <Typewriter pet={pet} />
        </>
      ) : null}
    </div>
  );
}
