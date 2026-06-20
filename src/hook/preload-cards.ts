import { useEffect, useMemo } from "react"
import backgroundImageUrl from "@asset/image/background.png"
import { Card } from "@src/card"
import { isIntro } from "@src/store/helper"
import * as store from "@src/store"

function preloadImage(src: string) {
    return new Promise<void>((resolve, reject) => {
        const image = new Image()

        image.onload = () => resolve()
        image.onerror = () => reject(new Error(`Could not load image: ${src}`))
        image.src = src
    })
}

async function preloadCard(card: Card) {
    await preloadImage(card.imageUrl)
    return card
}

async function preloadIntroCard(card: Card) {
    await Promise.all([
        preloadImage(card.imageUrl),
        preloadImage(backgroundImageUrl),
    ])

    return card
}

export function usePreloadCards(cards: Card[]) {
    const introCard = useMemo(
        () => cards.find(isIntro),
        [cards],
    )
    const deckCards = useMemo(
        () => cards.filter((card) => !isIntro(card)),
        [cards],
    )
    const resetDeck = store.useSpaceFeed((state) => state.resetDeck)
    const introReady = store.useSpaceFeed((state) => state.introReady)
    const cardReady = store.useSpaceFeed((state) => state.cardReady)
    const cardFailed = store.useSpaceFeed((state) => state.cardFailed)

    useEffect(() => {
        let cancelled = false

        resetDeck(deckCards.length)

        if (introCard) {
            preloadIntroCard(introCard)
                .then((readyCard) => {
                    if (!cancelled) {
                        introReady(readyCard)
                    }
                })
                .catch(() => {
                    // Keep the app gated if the intro image cannot load.
                })
        }

        for (const card of deckCards) {
            preloadCard(card)
                .then((readyCard) => {
                    if (!cancelled) {
                        cardReady(readyCard)
                    }
                })
                .catch(() => {
                    if (!cancelled) {
                        cardFailed(card.id)
                    }
                })
        }

        return () => {
            cancelled = true
        }
    }, [cardFailed, cardReady, deckCards, introCard, introReady, resetDeck])
}
