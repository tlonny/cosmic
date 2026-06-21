import type * as card from "@src/card"
import type * as hook from "@src/hook"

export type Action = {
  type: "ADD_CARD";
  card: card.Card;
};

export function reduce(state: hook.state.State, action: Action): hook.state.State {
    return {
        ...state,
        source: [...state.source, action.card],
    }
}
