import {
    Dispatch as ReactDispatch,
    useReducer as useReactReducer,
} from "react"
import * as card from "@src/card"
import * as addCard from "@src/hook/state/action/add-card"
import * as cancelDrag from "@src/hook/state/action/cancel-drag"
import * as endDrag from "@src/hook/state/action/end-drag"
import * as setArriving from "@src/hook/state/action/set-arriving"
import * as setIdle from "@src/hook/state/action/set-idle"
import * as setLoaded from "@src/hook/state/action/set-loaded"
import * as setTravelling from "@src/hook/state/action/set-travelling"
import * as startDrag from "@src/hook/state/action/start-drag"
import * as updateDrag from "@src/hook/state/action/update-drag"

export type DragState = {
  pointerId: number;
  startY: number;
  offsetY: number;
};

export type TravelPhase = "IDLE" | "DEPARTING" | "TRAVELLING" | "ARRIVING";

export type Travel = {
  phase: TravelPhase;
  forward: boolean;
};

export type Current = {
  card: card.Card;
  blurb: string;
};

export type State = {
  deck: card.Card[];
  source: card.Card[];
  historyStack: Current[];
  futureStack: Current[];
  current: Current | null;
  introLoaded: boolean;
  drag: DragState | null;
  departureOffsetY: number;
  travel: Travel;
};

export type Action =
  | setLoaded.Action
  | addCard.Action
  | startDrag.Action
  | updateDrag.Action
  | endDrag.Action
  | cancelDrag.Action
  | setTravelling.Action
  | setArriving.Action
  | setIdle.Action;

export type Dispatch = ReactDispatch<Action>

const initialState: State = {
    deck: [],
    source: [],
    historyStack: [],
    futureStack: [],
    current: null,
    introLoaded: false,
    drag: null,
    departureOffsetY: 0,
    travel: {
        phase: "IDLE",
        forward: true,
    },
}

export function useState() {
    return useReactReducer(reduce, initialState)
}

function reduce(state: State, action: Action): State {
    if (action.type === "SET_LOADED") {
        return setLoaded.reduce(state)
    }

    if (action.type === "ADD_CARD") {
        return addCard.reduce(state, action)
    }

    if (action.type === "START_DRAG") {
        return startDrag.reduce(state, action)
    }

    if (action.type === "UPDATE_DRAG") {
        return updateDrag.reduce(state, action)
    }

    if (action.type === "END_DRAG") {
        return endDrag.reduce(state)
    }

    if (action.type === "CANCEL_DRAG") {
        return cancelDrag.reduce(state)
    }

    if (action.type === "SET_ARRIVING") {
        return setArriving.reduce(state)
    }

    if (action.type === "SET_TRAVELLING") {
        return setTravelling.reduce(state)
    }

    if (action.type === "SET_IDLE") {
        return setIdle.reduce(state)
    }

    action satisfies never
    throw new Error("Invariant violation: unhandled state action.")
}
