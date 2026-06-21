import { useEffect } from "react"
import backgroundImageUrl from "@asset/image/background.png"
import * as card from "@src/card"
import type * as hook from "@src/hook"

function preloadImage(src: string) {
    return new Promise<void>((resolve, reject) => {
        const image = new Image()

        image.onload = () => resolve()
        image.onerror = () => reject(new Error(`Could not load image: ${src}`))
        image.src = src
    })
}

export function usePreload(dispatch: hook.state.Dispatch) {
    useEffect(() => {
        let isActive = true

        Promise.all([
            preloadImage(card.introBanner.imageUrl),
            preloadImage(backgroundImageUrl),
        ])
            .then(() => {
                if (isActive) {
                    dispatch({ type: "SET_LOADED" })
                }
            })

        for (const deckCard of card.deck) {
            preloadImage(deckCard.imageUrl)
                .then(() => {
                    if (isActive) {
                        dispatch({ type: "ADD_CARD", card: deckCard })
                    }
                })
                .catch(() => {})
        }

        return () => {
            isActive = false
        }
    }, [dispatch])
}
