import * as hook from "@src/hook"
import { Feed } from "@src/ui/feed"

export function App() {
    const [state, dispatch] = hook.useState()

    hook.usePreload(dispatch)
    hook.useAdvance(state.travel, state.current, dispatch)

    if (!state.introLoaded) {
        return (
            <main className="app-shell">
                <section className="app-loading" aria-hidden="true" />
            </main>
        )
    }

    return (
        <main className="app-shell">
            <Feed state={state} dispatch={dispatch} />
        </main>
    )
}
