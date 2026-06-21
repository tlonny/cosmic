import type * as hook from "@src/hook"
import * as card from "@src/card"
import * as util from "@src/util"

export type Action = {
  type: "SET_TRAVELLING";
};

const MAX_HISTORY_STACK = 100

export function reduce(state: hook.state.State): hook.state.State {
    if (!state.current) {
        throw new Error("Invariant violation: cannot travel without a current card.")
    }

    const current = state.current
    let historyStack = state.historyStack
    let futureStack = state.futureStack
    let deck = state.deck
    let next: hook.state.Current | null = null

    if (state.travel.forward) {
        historyStack = pushHistory(historyStack, current)

        if (futureStack.length > 0) {
            [next, ...futureStack] = futureStack
        }
    }

    if (!state.travel.forward) {
        futureStack = [current, ...futureStack]
        next = historyStack[historyStack.length - 1] ?? null

        if (!next) {
            throw new Error("Invariant violation: cannot travel backward without history.")
        }

        historyStack = historyStack.slice(0, -1)
    }

    if (!next && deck.length === 0) {
        deck = util.random.shuffle(card.deck)

        if (deck[0]?.id === current.card.id) {
            const swapIndex = util.random.index(deck.length - 1)

            if (!swapIndex.isSuccess) {
                throw new Error("Invariant violation: cannot move current card from a single-card deck.")
            }

            const nextIndex = 1 + swapIndex.value
            const copy = [...deck]
            const current = copy[0] as card.Card

            copy[0] = copy[nextIndex] as card.Card
            copy[nextIndex] = current
            deck = copy
        }
    }

    if (!next) {
        const [nextCard, ...remaining] = deck

        if (!nextCard) {
            throw new Error("Invariant violation: cannot travel without a next card.")
        }

        const blurb = util.random.take(nextCard.blurb)

        if (!blurb.isSuccess) {
            throw new Error(`Invariant violation: card "${nextCard.id}" has no blurbs.`)
        }

        next = {
            card: nextCard,
            blurb: blurb.value,
        }

        deck = remaining
    }

    return {
        ...state,
        current: next,
        deck,
        historyStack,
        futureStack,
        travel: {
            ...state.travel,
            phase: "TRAVELLING",
        },
    }
}

function pushHistory(historyStack: hook.state.Current[], current: hook.state.Current) {
    const nextHistoryStack = [...historyStack, current]

    if (nextHistoryStack.length <= MAX_HISTORY_STACK) {
        return nextHistoryStack
    }

    return nextHistoryStack.slice(nextHistoryStack.length - MAX_HISTORY_STACK)
}
