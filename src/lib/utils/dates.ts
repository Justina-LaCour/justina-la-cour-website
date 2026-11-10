export function formatOptionalLocalizedDate(
    value: string | Date | undefined | null,
    locale: string,
    options: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "long",
        year: "numeric"
    }
): string | null {
    if (value === undefined || value === null) return null;

    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return null;

    return new Intl.DateTimeFormat(locale, options).format(date);
}
