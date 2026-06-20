import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import * as ui from "@src/ui"

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ui.App />
    </StrictMode>,
)
