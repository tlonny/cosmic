import type * as card from "@src/card"
import type * as hook from "@src/hook"
import * as util from "@src/util"

export type Action = {
  type: "ADD_CARD";
  card: card.Card;
};

export function reduce(state: hook.state.State, action: Action): hook.state.State {
    return {
        ...state,
        deck: util.random.shuffle([...state.deck, action.card]),
        source: [...state.source, action.card],
    }
}
