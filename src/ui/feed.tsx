import { CSSProperties, PointerEvent, useMemo } from "react"
import backgroundImageUrl from "@asset/image/background.png"
import {
    formatClassification,
    getDragOffset,
    getDragScale,
    isIdle,
} from "@src/ui/helper"
import * as hook from "@src/hook"

const STAR_TILE_SIZE = 512
const TOTAL_FLIGHT_DURATION_MS = hook.DEPART_DURATION_MS + hook.MIN_TRAVELLING_DURATION_MS + hook.ARRIVAL_DURATION_MS

type FeedProps = {
    state: hook.state.State;
    dispatch: hook.state.Dispatch;
};

export function Feed({ state, dispatch }: FeedProps) {
    const {
        current,
        departureOffsetY,
        drag,
        travel,
    } = state
    const travelPhase = travel.phase
    const canInteract = isIdle(travelPhase)
    const activeCard = current?.card ?? null
    const selectedBlurb = current?.blurb ?? null
    const offsetY = getDragOffset(travelPhase, drag)
    const stageStyle = useMemo(
        () => ({
            "--card-arrival-origin-y": travel.forward ? "110vh" : "-120vh",
            "--card-animation-duration": `${getCardAnimationDuration(travelPhase)}ms`,
            "--card-departure-target-y": travel.forward ? "-120vh" : "110vh",
            "--card-departure-offset-y": `${departureOffsetY}px`,
            "--card-departure-scale": getDragScale(departureOffsetY),
            "--card-drag-offset-y": `${offsetY}px`,
            "--card-drag-scale": getDragScale(offsetY),
        }),
        [departureOffsetY, offsetY, travel.forward, travelPhase],
    )
    const starStyle = useMemo(
        () => ({
            "--star-flight-duration": `${TOTAL_FLIGHT_DURATION_MS}ms`,
            "--star-flight-offset": `${travel.forward ? -STAR_TILE_SIZE : STAR_TILE_SIZE}px`,
            "--star-tile-size": `${STAR_TILE_SIZE}px`,
            backgroundImage: `url("${backgroundImageUrl}")`,
        }),
        [travel.forward],
    )

    function handlePointerDown(event: PointerEvent<HTMLButtonElement>) {
        if (!canInteract || drag !== null) {
            return
        }

        event.currentTarget.setPointerCapture(event.pointerId)
        dispatch({
            type: "START_DRAG",
            pointerId: event.pointerId,
            clientY: event.clientY,
        })
    }

    function handlePointerMove(event: PointerEvent<HTMLButtonElement>) {
        if (!isActivePointer(event.pointerId, drag)) {
            return
        }

        dispatch({ type: "UPDATE_DRAG", clientY: event.clientY })
    }

    function handlePointerUp(event: PointerEvent<HTMLButtonElement>) {
        if (!isActivePointer(event.pointerId, drag)) {
            return
        }

        dispatch({ type: "END_DRAG" })
    }

    return (
        <section
            className="space-feed"
        >
            <div
                className="star-layer"
                data-travel-phase={travelPhase}
                style={starStyle as CSSProperties}
            />

            {!activeCard ? null : (
                <div
                    className="card-stage"
                    data-dragging={drag !== null}
                    data-travel-forward={travel.forward}
                    data-travel-phase={travelPhase}
                    style={stageStyle as CSSProperties}
                >
                    <span className="body-heading">
                        <strong>{activeCard.title}</strong>
                        <small>{formatClassification(activeCard.classification)}</small>
                    </span>

                    <button
                        className="card-button"
                        type="button"
                        aria-label={`Swipe ${activeCard.title}`}
                        disabled={!canInteract}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerCancel={() => dispatch({ type: "CANCEL_DRAG" })}
                    >
                        <img className="body-image" src={activeCard.imageUrl} alt={activeCard.title} draggable={false} />
                    </button>

                    {selectedBlurb && (
                        <span className="body-blurb">
                            <em>{selectedBlurb}</em>
                        </span>
                    )}
                </div>
            )}
        </section>
    )
}

function isActivePointer(pointerId: number, drag: { pointerId: number } | null) {
    return drag !== null && drag.pointerId === pointerId
}

function getCardAnimationDuration(travelPhase: hook.state.TravelPhase) {
    if (travelPhase === "DEPARTING") {
        return hook.DEPART_DURATION_MS
    }

    if (travelPhase === "ARRIVING") {
        return hook.ARRIVAL_DURATION_MS
    }

    return 0
}
