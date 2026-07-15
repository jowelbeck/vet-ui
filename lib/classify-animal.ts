// Derives Pets/Poultry/Livestock from the actual animal name typed in,
// rather than trusting whichever filter tab happened to be selected -
// shared by both the Patients page and the case-analysis auto-create
// logic so classification can never drift apart between the two again.
export function classifyAnimal(animal: string): "pets" | "poultry" | "livestock" {
  const a = (animal || "").trim().toLowerCase();
  const poultryWords = ["chicken", "chickens", "poultry", "hen", "rooster", "chick", "chicks", "fowl", "duck", "ducks", "turkey", "turkeys", "goose", "geese", "layers", "layer", "broiler", "broilers", "pullet", "pullets", "cockerel", "cockerels"];
  const livestockWords = ["cattle", "cow", "cows", "bovine", "calf", "calves", "bull", "heifer", "ox", "goat", "goats", "sheep", "lamb", "ewe", "ram", "pig", "pigs", "swine", "piglet", "hog", "sow", "boar", "horse", "horses", "equine"];
  if (poultryWords.includes(a)) return "poultry";
  if (livestockWords.includes(a)) return "livestock";
  return "pets";
}
