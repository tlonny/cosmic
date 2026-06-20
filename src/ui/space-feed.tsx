import { PointerEvent, useEffect, useMemo } from "react"
import backgroundImageUrl from "@asset/image/background.png"
import {
    formatClassification,
    getDragOffset,
    getStarAnimation,
    getStarKeyframes,
    getStageTransform,
    getStageTransition,
    isIdle,
    isTraveling,
} from "@src/ui/helper"
import * as store from "@src/store"

export function SpaceFeed() {
    const card = store.useSpaceFeed((state) => state.current)
    const loadingCount = store.useSpaceFeed((state) => state.loadingCount)
    const deckCount = store.useSpaceFeed((state) => state.deck.length)
    const discardCount = store.useSpaceFeed((state) => state.discard.length)
    const failedCount = store.useSpaceFeed((state) => state.failedCards.length)
    const drag = store.useSpaceFeed((state) => state.drag)
    const travelPhase = store.useSpaceFeed((state) => state.travelPhase)
    const beginDrag = store.useSpaceFeed((state) => state.beginDrag)
    const updateDrag = store.useSpaceFeed((state) => state.updateDrag)
    const endDrag = store.useSpaceFeed((state) => state.endDrag)
    const cancelDrag = store.useSpaceFeed((state) => state.cancelDrag)
    const resetTravel = store.useSpaceFeed((state) => state.resetTravel)
    const selectedBlurb = store.useSpaceFeed((state) => state.selectedBlurb)

    const canInteract = isIdle(travelPhase)
    const activeCard = isTraveling(travelPhase) ? null : card
    const offsetY = getDragOffset(travelPhase, drag)
    const stageStyle = useMemo(
        () => ({
            transform: getStageTransform(travelPhase, offsetY),
            transition: getStageTransition(travelPhase, drag),
        }),
        [drag, offsetY, travelPhase],
    )
    const starStyle = useMemo(
        () => ({
            animation: getStarAnimation(travelPhase),
            backgroundImage: `url("${backgroundImageUrl}")`,
        }),
        [travelPhase],
    )

    useEffect(() => resetTravel, [resetTravel])

    function handlePointerDown(event: PointerEvent<HTMLButtonElement>) {
        if (!canInteract) {
            return
        }

        event.currentTarget.setPointerCapture(event.pointerId)
        beginDrag(event.pointerId, event.clientY)
    }

    function handlePointerMove(event: PointerEvent<HTMLButtonElement>) {
        if (!isActivePointer(event.pointerId, drag)) {
            return
        }

        updateDrag(event.clientY)
    }

    function handlePointerUp(event: PointerEvent<HTMLButtonElement>) {
        if (!isActivePointer(event.pointerId, drag)) {
            return
        }

        endDrag()
    }

    return (
        <section
            className="space-feed"
        >
            <style>{getStarKeyframes()}</style>
            <div className="star-layer" style={starStyle} />

            <div className="feed-status" aria-live="polite">
                <span>{loadingCount > 0 ? `${loadingCount} loading` : "deck ready"}</span>
                <span>{deckCount} deck</span>
                <span>{discardCount} seen</span>
                {failedCount > 0 && <span>{failedCount} skipped</span>}
            </div>

            {isTraveling(travelPhase) || !activeCard ? null : (
                <div className="card-stage" style={stageStyle}>
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
                        onPointerCancel={cancelDrag}
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
