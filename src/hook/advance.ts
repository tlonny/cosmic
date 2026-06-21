import { useEffect } from "react"
import type * as hook from "@src/hook"

export const DEPART_DURATION_MS = 280
export const TRAVEL_DURATION_MS = 280
export const ARRIVAL_DURATION_MS = 520

export function useAdvance(travel: hook.state.Travel, dispatch: hook.state.Dispatch) {
    useEffect(() => {
        const nextAction = getTravelAction(travel.phase)

        if (!nextAction) {
            return
        }

        const timer = setTimeout(() => dispatch(nextAction.action), nextAction.delayMs)

        return () => clearTimeout(timer)
    }, [dispatch, travel.phase])
}

function getTravelAction(travelPhase: hook.state.TravelPhase): { action: hook.state.Action; delayMs: number } | null {
    if (travelPhase === "DEPARTING") {
        return {
            action: { type: "SET_TRAVELLING" },
            delayMs: DEPART_DURATION_MS,
        }
    }

    if (travelPhase === "TRAVELLING") {
        return {
            action: { type: "SET_ARRIVING" },
            delayMs: TRAVEL_DURATION_MS,
        }
    }

    if (travelPhase === "ARRIVING") {
        return {
            action: { type: "SET_IDLE" },
            delayMs: ARRIVAL_DURATION_MS,
        }
    }

    return null
}
