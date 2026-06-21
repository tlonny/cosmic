import { useEffect } from "react"
import type * as hook from "@src/hook"
import * as util from "@src/util"

export const DEPART_DURATION_MS = 280
export const MIN_TRAVELLING_DURATION_MS = 280
export const ARRIVAL_DURATION_MS = 520

export function useAdvance(travel: hook.state.Travel, current: hook.state.Current, dispatch: hook.state.Dispatch) {
    useEffect(() => {
        if (travel.phase === "DEPARTING") {
            const timer = setTimeout(() => {
                dispatch({ type: "SET_TRAVELLING" })
            }, DEPART_DURATION_MS)

            return () => clearTimeout(timer)
        }

        if (travel.phase === "TRAVELLING") {
            let isActive = true

            Promise.all([
                util.sleep(MIN_TRAVELLING_DURATION_MS),
                util.preloadImage(current.card.imageUrl),
            ]).then(() => {
                if (isActive) {
                    dispatch({ type: "SET_ARRIVING" })
                }
            })

            return () => {
                isActive = false
            }
        }

        if (travel.phase === "ARRIVING") {
            const timer = setTimeout(() => {
                dispatch({ type: "SET_IDLE" })
            }, ARRIVAL_DURATION_MS)

            return () => clearTimeout(timer)
        }
    }, [current.card.imageUrl, dispatch, travel.phase])
}
