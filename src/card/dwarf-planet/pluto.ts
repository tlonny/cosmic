import imageUrl from "@asset/image/pluto.png"
import { Card } from "@src/card/type"

export const pluto: Card = {
    id: "pluto",
    title: "Pluto",
    classification: "DWARF_PLANET",
    imageUrl,
    blurb: [
        "A dwarf planet in the Kuiper Belt",
        "Reclassified in 2006",
        "Only about 1,400 miles wide",
        "Has five known moons",
        "Charon is its largest moon",
        "New Horizons flew past in 2015",
    ],
}
