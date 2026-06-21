import { useEffect } from "react"
import * as card from "@src/card"
import type * as hook from "@src/hook"

function preloadImage(src: string) {
    return new Promise<void>((resolve) => {
        const image = new Image()

        image.onload = () => resolve()
        image.onerror = () => resolve()
        image.src = src
    })
}

export function usePreload(dispatch: hook.state.Dispatch) {
    useEffect(() => {
        let isActive = true

        preloadImage(card.introBanner.imageUrl)
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
