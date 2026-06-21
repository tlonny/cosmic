import type * as hook from "@src/hook"

export type Action = {
  type: "SET_TRAVELLING";
};

export function reduce(state: hook.state.State): hook.state.State {
    return {
        ...state,
        travel: {
            ...state.travel,
            phase: "TRAVELLING",
        },
    }
}
