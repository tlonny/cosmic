import imageUrl from "@asset/image/earth.png"
import { Card } from "@src/card/type"

export const earth: Card = {
    id: "earth",
    title: "Earth",
    classification: "ROCKY_PLANET",
    imageUrl,
    blurb: [
        "Third planet from the Sun",
        "Fifth largest planet in the solar system",
        "Only known world with life",
        "A day lasts 23.9 hours",
        "A year lasts 365.25 days",
        "Liquid water covers most of it",
    ],
}
