import type * as hook from "@src/hook"

export type Action = {
  type: "SET_LOADED";
};

export function reduce(state: hook.state.State): hook.state.State {
    if (state.introLoaded) {
        return state
    }

    return {
        ...state,
        introLoaded: true,
    }
}
