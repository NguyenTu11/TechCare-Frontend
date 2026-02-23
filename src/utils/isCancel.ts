import axios from "axios"

export function isCanceledError(err: unknown): boolean {
    if (axios.isCancel(err)) return true
    if (err instanceof DOMException && err.name === "AbortError") return true
    return false
}
