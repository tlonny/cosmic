import { cards } from "@src/card"
import * as hook from "@src/hook"
import * as store from "@src/store"
import { SpaceFeed } from "@src/ui/space-feed"

export function App() {
    hook.usePreloadCards(cards)
    const introLoaded = store.useSpaceFeed((state) => state.introLoaded)

    if (!introLoaded) {
        return (
            <main className="app-shell">
                <section className="app-loading" aria-hidden="true" />
            </main>
        )
    }

    return (
        <main className="app-shell">
            <SpaceFeed />
        </main>
    )
}
