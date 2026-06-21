import type * as hook from "@src/hook"

export type Action = {
  type: "END_DRAG";
};

const SWIPE_THRESHOLD = 55

export function reduce(state: hook.state.State): hook.state.State {
    if (!state.drag) {
        throw new Error("Invariant violation: cannot end a drag that has not started.")
    }

    const forward = state.drag.offsetY < 0

    if (!canDepart(state, forward) || Math.abs(state.drag.offsetY) < SWIPE_THRESHOLD) {
        return {
            ...state,
            drag: null,
            departureOffsetY: 0,
        }
    }

    return {
        ...state,
        drag: null,
        departureOffsetY: state.drag.offsetY,
        travel: {
            ...state.travel,
            phase: "DEPARTING",
            forward,
        },
    }
}

function canDepart(state: hook.state.State, forward: boolean) {
    if (!forward) {
        return state.historyStack.length > 0
    }

    return state.futureStack.length > 0 || state.deck.length > 0 || state.source.length > 0
}
