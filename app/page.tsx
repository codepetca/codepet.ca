import { PetIcon } from "@/components/pet-icon";
import { Typewriter } from "@/components/typewriter";

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-2">
      <PetIcon />
      <Typewriter />
    </div>
  );
}
