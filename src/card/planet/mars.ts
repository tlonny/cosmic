import imageUrl from "@asset/image/mars.png"
import { Card } from "@src/card/type"

export const mars: Card = {
    id: "mars",
    title: "Mars",
    classification: "ROCKY_PLANET",
    imageUrl,
    blurb: [
        "Fourth planet from the Sun",
        "Known as the Red Planet",
        "About half as wide as Earth",
        "A day lasts 24.6 hours",
        "A year lasts 687 Earth days",
        "Has two tiny moons",
    ],
}
