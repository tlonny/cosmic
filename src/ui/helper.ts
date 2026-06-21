import * as hook from "@src/hook"
import type * as card from "@src/card"

export function isIdle(travelPhase: hook.state.TravelPhase) {
    return travelPhase === "IDLE"
}

export function getDragOffset(travelPhase: hook.state.TravelPhase, drag: hook.state.DragState | null) {
    return isIdle(travelPhase) ? drag?.offsetY ?? 0 : 0
}

export function getDragScale(offsetY: number) {
    return 1 - Math.min(Math.abs(offsetY), 180) / 1800
}

export function formatClassification(classification: card.CardClassification) {
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
    throw new Error("Invariant violation: unhandled celestial classification.")
}
