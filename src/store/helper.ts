import { Card } from "@src/card"

export function shuffle<T>(items: T[]) {
    const copy = [...items]

    for (let index = copy.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]]
    }

    return copy
}

export function selectBlurb(card: Card) {
    return card.blurb[Math.floor(Math.random() * card.blurb.length)] ?? null
}

export function isIntro(card: Card) {
    return card.classification === "INTRO"
}

export function canDrawNext(deck: Card[], discard: Card[]) {
    return deck.length > 0 || discard.length > 0
}

export function drawFrom(
    deck: Card[],
    discard: Card[],
    current: Card | null,
) {
    const justSeen = current && !isIntro(current) ? current : null
    const drawDeck = deck.length > 0 ? deck : shuffle(discard)
    const [next, ...remaining] = drawDeck

    if (deck.length > 0) {
        return {
            next: next ?? null,
            deck: remaining,
            discard,
        }
    }

    return {
        next: next ?? null,
        deck: justSeen ? shuffle([...remaining, justSeen]) : remaining,
        discard: [],
    }
}
