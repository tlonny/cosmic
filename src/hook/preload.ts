import { useEffect } from "react"
import backgroundImageUrl from "@asset/image/background.png"
import * as card from "@src/card"
import type * as hook from "@src/hook"
import * as util from "@src/util"

export function usePreload(dispatch: hook.state.Dispatch) {
    useEffect(() => {
        let isActive = true

        Promise.all([
            util.preloadImage(card.introBanner.imageUrl),
            util.preloadImage(backgroundImageUrl),
        ])
            .then(() => {
                if (isActive) {
                    dispatch({ type: "SET_LOADED" })
                }
            })

        return () => {
            isActive = false
        }
    }, [dispatch])
}
