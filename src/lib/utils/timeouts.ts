export const MAX_TIMEOUT_MS = 2 ** 31 - 1;

export function isValidTimeoutMs(value: unknown): value is number {
    return (
        typeof value === "number" &&
        Number.isInteger(value) &&
        value > 0 &&
        value <= MAX_TIMEOUT_MS
    );
}
