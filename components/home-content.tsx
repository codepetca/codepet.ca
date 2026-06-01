"use client";

import {
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useRouter } from "next/navigation";
import { PetIcon } from "@/components/pet-icon";
import { Typewriter } from "@/components/typewriter";
import { getCurrentPet } from "@/lib/pets";

const CELEBRATION_CLICK_COUNT = 3;
const TRANSITION_DURATION_MS = 360;

function subscribe() {
  return () => {};
}

export function HomeContent() {
  const router = useRouter();
  const pet = useSyncExternalStore(subscribe, getCurrentPet, () => null);
  const petClicks = useRef(0);
  const petName = useRef<string | null>(null);
  const [showTransition, setShowTransition] = useState(false);

  function handlePetClick() {
    if (showTransition) return;

    if (petName.current !== pet?.name) {
      petName.current = pet?.name ?? null;
      petClicks.current = 0;
    }

    petClicks.current += 1;
    if (petClicks.current < CELEBRATION_CLICK_COUNT) return;

    petClicks.current = 0;
    setShowTransition(true);

    const nextRoute = pet?.name ? `/dash?pet=${encodeURIComponent(pet.name)}` : "/dash";

    window.setTimeout(() => {
      router.push(nextRoute);
    }, TRANSITION_DURATION_MS);
  }

  return (
    <div className="relative z-0 flex flex-col items-center gap-2">
      {pet && showTransition ? (
        <div
          className="pointer-events-none fixed inset-0 z-50 animate-page-fade-out"
          style={{ background: "var(--background)" }}
          aria-hidden="true"
        />
      ) : null}
      {pet ? (
        <div className="relative z-10 flex flex-col items-center gap-2">
          <PetIcon pet={pet} onPet={handlePetClick} disabled={showTransition} />
          <Typewriter pet={pet} />
        </div>
      ) : null}
    </div>
  );
}
