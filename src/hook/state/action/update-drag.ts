import type * as hook from "@src/hook"

export type Action = {
  type: "UPDATE_DRAG";
  clientY: number;
};

export function reduce(state: hook.state.State, action: Action): hook.state.State {
    if (!state.drag) {
        return state
    }

    return {
        ...state,
        drag: {
            ...state.drag,
            offsetY: action.clientY - state.drag.startY,
        },
    }
}
