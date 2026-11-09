export function normalizeOpenGraphLocale(locale: string): string {
    return locale.replaceAll("-", "_");
}
