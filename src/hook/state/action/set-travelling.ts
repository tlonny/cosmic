import type * as hook from "@src/hook"
import * as card from "@src/card"
import * as util from "@src/util"

export type Action = {
  type: "SET_TRAVELLING";
};

const MAX_HISTORY_STACK = 100

export function reduce(state: hook.state.State): hook.state.State {
    const current = state.current

    if (!state.travel.forward) {
        const next = state.historyStack[state.historyStack.length - 1]

        if (!next) {
            throw new Error("Invariant violation: cannot travel backward without history.")
        }

        return {
            ...state,
            current: next,
            historyStack: state.historyStack.slice(0, -1),
            futureStack: [current, ...state.futureStack],
            travel: {
                ...state.travel,
                phase: "TRAVELLING",
            },
        }
    }

    const nextHistoryStack = [...state.historyStack, current]
    const historyStackLimitStart = Math.max(0, nextHistoryStack.length - MAX_HISTORY_STACK)
    const historyStack = nextHistoryStack.slice(historyStackLimitStart)

    if (state.futureStack.length > 0) {
        const [next, ...futureStack] = state.futureStack

        return {
            ...state,
            current: next as hook.state.Current,
            historyStack,
            futureStack,
            travel: {
                ...state.travel,
                phase: "TRAVELLING",
            },
        }
    }

    let deck = state.deck

    if (deck.length === 0) {
        deck = util.random.shuffle(card.deck)

        if (deck[0]?.id === current.card.id) {
            const swapIndex = util.random.index(deck.length - 1)

            if (!swapIndex.isSuccess) {
                throw new Error("Invariant violation: cannot move current card from a single-card deck.")
            }

            const nextIndex = 1 + swapIndex.value
            const copy = [...deck]
            const currentCard = copy[0] as card.Card

            copy[0] = copy[nextIndex] as card.Card
            copy[nextIndex] = currentCard
            deck = copy
        }
    }

    const [nextCard, ...remaining] = deck

    if (!nextCard) {
        throw new Error("Invariant violation: cannot travel without a next card.")
    }

    const blurb = util.random.take(nextCard.blurb)

    if (!blurb.isSuccess) {
        throw new Error(`Invariant violation: card "${nextCard.id}" has no blurbs.`)
    }

    return {
        ...state,
        current: {
            card: nextCard,
            blurb: blurb.value,
        },
        deck: remaining,
        historyStack,
        travel: {
            ...state.travel,
            phase: "TRAVELLING",
        },
    }
}
