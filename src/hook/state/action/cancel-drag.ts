import type * as hook from "@src/hook"

export type Action = {
  type: "CANCEL_DRAG";
};

export function reduce(state: hook.state.State): hook.state.State {
    return {
        ...state,
        drag: null,
        departureOffsetY: 0,
    }
}
