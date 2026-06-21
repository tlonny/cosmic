import type * as hook from "@src/hook"

export type Action = {
  type: "START_DRAG";
  pointerId: number;
  clientY: number;
};

export function reduce(state: hook.state.State, action: Action): hook.state.State {
    if (state.drag) {
        return state
    }

    return {
        ...state,
        drag: {
            pointerId: action.pointerId,
            startY: action.clientY,
            offsetY: 0,
        },
        departureOffsetY: 0,
    }
}
