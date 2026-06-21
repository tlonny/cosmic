import type * as hook from "@src/hook"

export type Action = {
  type: "SET_IDLE";
};

export function reduce(state: hook.state.State): hook.state.State {
    return {
        ...state,
        departureOffsetY: 0,
        travel: {
            ...state.travel,
            phase: "IDLE",
        },
    }
}
