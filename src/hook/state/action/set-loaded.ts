import * as card from "@src/card"
import type * as hook from "@src/hook"
import * as util from "@src/util"

export type Action = {
  type: "SET_LOADED";
};

export function reduce(state: hook.state.State): hook.state.State {
    if (state.introLoaded) {
        return state
    }

    const selectedBlurb = util.random.take(card.introBanner.blurb)

    if (!selectedBlurb.isSuccess) {
        throw new Error("Invariant violation: intro banner has no blurbs.")
    }

    return {
        ...state,
        current: {
            card: card.introBanner,
            blurb: selectedBlurb.value,
        },
        introLoaded: true,
    }
}
