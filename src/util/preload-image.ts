const imagePreloadCache = new Map<string, Promise<void>>()

export function preloadImage(src: string) {
    const cachedPreload = imagePreloadCache.get(src)

    if (cachedPreload) {
        return cachedPreload
    }

    const preload = new Promise<void>((resolve) => {
        const image = new Image()

        image.onload = () => {
            image.decode()
                .then(() => resolve())
                .catch(() => resolve())
        }
        image.onerror = () => resolve()
        image.src = src
    })

    imagePreloadCache.set(src, preload)

    return preload
}
