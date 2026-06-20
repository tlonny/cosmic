export type CardClassification =
  | "INTRO"
  | "ROCKY_PLANET"
  | "GAS_GIANT"
  | "ICE_GIANT"
  | "DWARF_PLANET"
  | "MOON"
  | "YELLOW_DWARF_STAR";

export type Card = {
  id: string;
  title: string;
  classification: CardClassification;
  imageUrl: string;
  blurb: string[];
};
