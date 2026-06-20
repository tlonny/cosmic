import { create } from "zustand"
import { Card } from "@src/card"
import {
    canDrawNext,
    drawFrom,
    isIntro,
    selectBlurb,
    shuffle,
} from "@src/store/helper"

export type DragState = {
  pointerId: number;
  startY: number;
  offsetY: number;
};

export type TravelPhase = "IDLE" | "DEPARTING" | "TRAVELING" | "SPAWNING" | "ARRIVING";

const SWIPE_THRESHOLD = 55
export const DEPART_DURATION_MS = 280
export const TRAVEL_DURATION_MS = 280
export const ARRIVAL_DURATION_MS = 520
const SPAWN_FRAME_DELAY_MS = 32

type SpaceFeedState = {
  deck: Card[];
  discard: Card[];
  current: Card | null;
  introLoaded: boolean;
  loadingCount: number;
  failedCards: string[];
  drag: DragState | null;
  travelPhase: TravelPhase;
  selectedBlurb: string | null;
  resetDeck: (loadingCount: number) => void;
  introReady: (card: Card) => void;
  cardReady: (card: Card) => void;
  cardFailed: (id: string) => void;
  drawNext: () => void;
  beginDrag: (pointerId: number, clientY: number) => void;
  updateDrag: (clientY: number) => void;
  endDrag: () => void;
  cancelDrag: () => void;
  resetTravel: () => void;
};

let timers: ReturnType<typeof setTimeout>[] = []

export const useSpaceFeed = create<SpaceFeedState>((set, get) => ({
    deck: [],
    discard: [],
    current: null,
    introLoaded: false,
    loadingCount: 0,
    failedCards: [],
    drag: null,
    travelPhase: "IDLE",
    selectedBlurb: null,

    resetDeck: (loadingCount) => {
        set({
            deck: [],
            discard: [],
            current: null,
            introLoaded: false,
            loadingCount,
            failedCards: [],
            selectedBlurb: null,
        })
    },

    introReady: (card) => {
        set({
            current: card,
            introLoaded: true,
            selectedBlurb: selectBlurb(card),
        })
    },

    cardReady: (card) => {
        const state = get()
        const loadingCount = Math.max(0, state.loadingCount - 1)

        if (state.current === null && state.introLoaded) {
            set({
                current: card,
                loadingCount,
                selectedBlurb: selectBlurb(card),
            })
            return
        }

        set({
            deck: shuffle([...state.deck, card]),
            loadingCount,
        })
    },

    cardFailed: (id) => {
        const state = get()

        set({
            failedCards: [...state.failedCards, id],
            loadingCount: Math.max(0, state.loadingCount - 1),
        })
    },

    drawNext: () => {
        const state = get()
        const drawn = drawFrom(state.deck, state.discard, state.current)

        if (!drawn.next) {
            if (state.current && isIntro(state.current)) {
                set({
                    current: null,
                    deck: drawn.deck,
                    discard: drawn.discard,
                    selectedBlurb: null,
                })
            }

            return
        }

        set({
            current: drawn.next,
            deck: drawn.deck,
            discard: state.current && !isIntro(state.current) && state.deck.length > 0
                ? [...drawn.discard, state.current]
                : drawn.discard,
            selectedBlurb: selectBlurb(drawn.next),
        })
    },

    beginDrag: (pointerId, clientY) => {
        set({
            drag: {
                pointerId,
                startY: clientY,
                offsetY: 0,
            },
        })
    },

    updateDrag: (clientY) => {
        const drag = get().drag as DragState

        set({
            drag: {
                ...drag,
                offsetY: clientY - drag.startY,
            },
        })
    },

    endDrag: () => {
        const { drag, resetTravel } = get()
        const activeDrag = drag as DragState

        if (!canDrawNext(get().deck, get().discard) || activeDrag.offsetY >= -SWIPE_THRESHOLD) {
            set({ drag: null })
            return
        }

        resetTravel()
        set({
            drag: null,
            travelPhase: "DEPARTING",
        })

        scheduleTimer(() => {
            set({ travelPhase: "TRAVELING" })
        }, DEPART_DURATION_MS)

        scheduleTimer(() => {
            get().drawNext()
            set({ travelPhase: "SPAWNING" })
        }, DEPART_DURATION_MS + TRAVEL_DURATION_MS)

        scheduleTimer(() => {
            set({ travelPhase: "ARRIVING" })
        }, DEPART_DURATION_MS + TRAVEL_DURATION_MS + SPAWN_FRAME_DELAY_MS)

        scheduleTimer(() => {
            set({ travelPhase: "IDLE" })
        }, DEPART_DURATION_MS + TRAVEL_DURATION_MS + SPAWN_FRAME_DELAY_MS + ARRIVAL_DURATION_MS)
    },

    cancelDrag: () => set({ drag: null }),

    resetTravel: () => {
        for (const timer of timers) {
            clearTimeout(timer)
        }

        timers = []
        set({
            drag: null,
            travelPhase: "IDLE",
        })
    },
}))

function scheduleTimer(callback: () => void, delayMs: number) {
    timers.push(setTimeout(callback, delayMs))
}
