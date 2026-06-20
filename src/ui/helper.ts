import {
    ARRIVAL_DURATION_MS,
    DEPART_DURATION_MS,
    DragState,
    TRAVEL_DURATION_MS,
    TravelPhase,
} from "@src/store"
import { CardClassification } from "@src/card"

const STAR_TILE_SIZE = 512
const TOTAL_FLIGHT_DURATION_MS = DEPART_DURATION_MS + TRAVEL_DURATION_MS + ARRIVAL_DURATION_MS

export function isIdle(travelPhase: TravelPhase) {
    return travelPhase === "IDLE"
}

export function isTraveling(travelPhase: TravelPhase) {
    return travelPhase === "TRAVELING"
}

export function getDragOffset(travelPhase: TravelPhase, drag: DragState | null) {
    return isIdle(travelPhase) ? drag?.offsetY ?? 0 : 0
}

export function getStarKeyframes() {
    return `
@keyframes star-flight {
  0% {
    transform: translate3d(0, 0, 0);
  }

  100% {
    transform: translate3d(0, ${STAR_TILE_SIZE}px, 0);
  }
}
`
}

export function getStageTransform(travelPhase: TravelPhase, offsetY: number) {
    if (travelPhase === "DEPARTING") {
        return "translate3d(0, -120vh, 0) scale(0.86)"
    }

    if (travelPhase === "SPAWNING") {
        return "translate3d(0, 110vh, 0) scale(0.9)"
    }

    return `translate3d(0, ${offsetY}px, 0) scale(${1 - Math.min(Math.abs(offsetY), 180) / 1800})`
}

export function getStageTransition(travelPhase: TravelPhase, drag: DragState | null) {
    if (travelPhase === "DEPARTING") {
        return `transform ${DEPART_DURATION_MS}ms cubic-bezier(.5, 0, 1, .65)`
    }

    if (travelPhase === "TRAVELING") {
        return `transform ${TRAVEL_DURATION_MS}ms linear`
    }

    if (travelPhase === "SPAWNING") {
        return "none"
    }

    if (travelPhase === "ARRIVING") {
        return `transform ${ARRIVAL_DURATION_MS}ms cubic-bezier(.16, 1.2, .32, 1)`
    }

    return drag ? "none" : "transform 520ms cubic-bezier(.16, 1.2, .32, 1)"
}

export function getStarAnimation(travelPhase: TravelPhase) {
    if (isIdle(travelPhase)) {
        return "none"
    }

    return `star-flight ${TOTAL_FLIGHT_DURATION_MS}ms cubic-bezier(.42, 0, .2, 1) both`
}

export function formatClassification(classification: CardClassification) {
    if (classification === "INTRO") {
        return "Intro"
    }

    if (classification === "ROCKY_PLANET") {
        return "Rocky planet"
    }

    if (classification === "GAS_GIANT") {
        return "Gas giant"
    }

    if (classification === "ICE_GIANT") {
        return "Ice giant"
    }

    if (classification === "DWARF_PLANET") {
        return "Dwarf planet"
    }

    if (classification === "MOON") {
        return "Moon"
    }

    if (classification === "YELLOW_DWARF_STAR") {
        return "Yellow dwarf star"
    }

    classification satisfies never
    throw new Error("Unhandled celestial classification.")
}
