import {
  faFrog,
  faHorse,
  faKiwiBird,
  faOtter,
  faCrow,
  faDove,
  faDragon,
  faPaw,
  faDog,
  faCat,
  faHippo,
  faFish,
  type IconDefinition,
} from "@fortawesome/free-solid-svg-icons";

export interface Pet {
  name: string;
  icon: IconDefinition;
}

const pets: Pet[] = [
  { name: "frog", icon: faFrog },
  { name: "horse", icon: faHorse },
  { name: "kiwi", icon: faKiwiBird },
  { name: "otter", icon: faOtter },
  { name: "crow", icon: faCrow },
  { name: "dove", icon: faDove },
  { name: "dragon", icon: faDragon },
  { name: "paw", icon: faPaw },
  { name: "dog", icon: faDog },
  { name: "cat", icon: faCat },
  { name: "hippo", icon: faHippo },
  { name: "fish", icon: faFish },
];

export function getPetForDate(date: Date): Pet {
  const month = date.getMonth(); // 0-based
  return pets[month];
}

export function getCurrentPet(): Pet {
  return getPetForDate(new Date());
}
