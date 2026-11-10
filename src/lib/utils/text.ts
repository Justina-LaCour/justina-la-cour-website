export function textExcerpt(value: string, maxLength = 180): string {
    const normalized = value.replace(/\s+/g, " ").trim();

    if (normalized.length <= maxLength) return normalized;

    const candidate = normalized.slice(0, Math.max(0, maxLength - 1));
    const lastSpace = candidate.lastIndexOf(" ");
    const excerpt = lastSpace > maxLength / 2
        ? candidate.slice(0, lastSpace)
        : candidate;

    return `${excerpt.trimEnd()}…`;
}

export function readableCodeLabel(value: string): string {
    const normalized = value.trim().replace(/[-_]+/g, " ");
    return normalized
        ? normalized.charAt(0).toUpperCase() + normalized.slice(1)
        : "";
}
