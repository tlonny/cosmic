import { copyFile, mkdir, rm } from "node:fs/promises"
import { Document, node } from "@lonnycorp/htmlforge"

const outdir = "dist"

await rm(outdir, { recursive: true, force: true })
await mkdir(outdir, { recursive: true })
await mkdir(`${outdir}/asset`, { recursive: true })
await copyFile("asset/style.css", `${outdir}/asset/style.css`)
await copyFile("asset/image/favicon.png", `${outdir}/asset/favicon.png`)

const result = await Bun.build({
    entrypoints: ["src/main.tsx"],
    outdir: `${outdir}/asset`,
    minify: true,
    publicPath: "/asset/",
    sourcemap: "external",
    target: "browser",
})

if (!result.success) {
    for (const log of result.logs) {
        process.stderr.write(`${String(log)}\n`)
    }
    process.exit(1)
}

const builtScript = result.outputs.find((output) => output.path.endsWith(".js"))

if (!builtScript) {
    throw new Error("Bun did not emit a JavaScript bundle.")
}

const scriptPath = `/asset/${builtScript.path.split("/").at(-1)}`
const doc = new Document()

doc.attribute("lang", "en")
doc.head
    .child(
        new node.Element("meta")
            .attribute("charset", "UTF-8"),
    )
    .child(
        new node.Element("meta")
            .attribute("name", "viewport")
            .attribute("content", "width=device-width, initial-scale=1.0"),
    )
    .child(
        new node.Element("title")
            .child(new node.Text("Cosmic Roulette")),
    )
    .child(
        new node.Element("link")
            .attribute("rel", "icon")
            .attribute("type", "image/png")
            .attribute("href", "/asset/favicon.png"),
    )
    .child(
        new node.Element("link")
            .attribute("rel", "stylesheet")
            .attribute("href", "/asset/style.css"),
    )

doc.body
    .child(
        new node.Element("div")
            .attribute("id", "root"),
    )
    .child(
        new node.Element("script")
            .attribute("type", "module")
            .attribute("src", scriptPath),
    )

await Bun.write(
    `${outdir}/index.html`,
    doc.toString(),
)

process.stdout.write(`Built ${outdir}\n`)
