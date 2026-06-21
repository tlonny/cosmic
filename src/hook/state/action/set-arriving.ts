import type * as hook from "@src/hook"

export type Action = {
  type: "SET_ARRIVING";
};

export function reduce(state: hook.state.State): hook.state.State {
    return {
        ...state,
        travel: {
            ...state.travel,
            phase: "ARRIVING",
        },
    }
}
