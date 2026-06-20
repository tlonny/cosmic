import { introBanner } from "@src/card/intro-banner"
import * as dwarfPlanet from "@src/card/dwarf-planet"
import * as moon from "@src/card/moon"
import * as planet from "@src/card/planet"
import * as star from "@src/card/star"
import { Card } from "@src/card/type"

export * from "@src/card/type"

export const cards: Card[] = [
    introBanner,
    star.sun,
    moon.moon,
    planet.mercury,
    planet.venus,
    planet.earth,
    planet.mars,
    planet.jupiter,
    moon.io,
    moon.europa,
    moon.ganymede,
    planet.saturn,
    moon.titan,
    moon.enceladus,
    moon.iapetus,
    planet.uranus,
    planet.neptune,
    dwarfPlanet.pluto,
    moon.charon,
]
