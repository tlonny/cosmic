export type Result<T> =
  | { isSuccess: true; value: T }
  | { isSuccess: false };

export function index(length: number): Result<number> {
    if (length <= 0) {
        return { isSuccess: false }
    }

    return {
        isSuccess: true,
        value: Math.floor(Math.random() * length),
    }
}

export function take<T>(items: T[]): Result<T> {
    const selectedIndex = index(items.length)

    if (!selectedIndex.isSuccess) {
        return { isSuccess: false }
    }

    return {
        isSuccess: true,
        value: items[selectedIndex.value] as T,
    }
}

export function shuffle<T>(items: T[]) {
    const copy = [...items]

    for (let cursor = copy.length - 1; cursor > 0; cursor -= 1) {
        const swapIndex = index(cursor + 1)

        if (!swapIndex.isSuccess) {
            throw new Error("Invariant violation: cannot shuffle using an empty random index.")
        }

        const value = copy[cursor] as T
        copy[cursor] = copy[swapIndex.value] as T
        copy[swapIndex.value] = value
    }

    return copy
}
