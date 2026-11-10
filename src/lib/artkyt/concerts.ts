import type {
    APIConcertPreview,
    FormattedPerformance,
    PerformanceBookingInfo
} from "./types";

export type PerformanceDateDirection = "asc" | "desc";

export function formatPerformancePrice(
    locale: string,
    performance: PerformanceBookingInfo
): string | null {
    const { pricingType, priceMin, priceMax, recommendedPrice } = performance;
    const amount = pricingType === "paid"
        ? priceMin
        : pricingType === "donation" ? recommendedPrice : undefined;
    const currency = performance.currency?.trim().toUpperCase();

    if (
        typeof amount !== "number" ||
        !Number.isFinite(amount) ||
        amount < 0 ||
        !currency ||
        !Intl.supportedValuesOf("currency").includes(currency)
    ) {
        return null;
    }

    if (
        pricingType === "paid" &&
        priceMax !== undefined &&
        (!Number.isFinite(priceMax) || priceMax < amount)
    ) {
        return null;
    }

    const formatter = new Intl.NumberFormat(locale, {
        style: "currency",
        currency
    });

    if (pricingType === "paid" && priceMax !== undefined && priceMax > amount) {
        return `${formatter.format(amount)} – ${formatter.format(priceMax)}`;
    }

    return formatter.format(amount);
}

export function parsePerformanceDate(date?: string, time?: string): Date | null {
    if (!date) return null;

    const [year, month, day] = date.slice(0, 10).split("-").map(Number);
    const [hours = 0, minutes = 0, seconds = 0] = time?.split(":").map(Number) ?? [];

    if (
        !Number.isInteger(year) ||
        !Number.isInteger(month) ||
        !Number.isInteger(day) ||
        !Number.isInteger(hours) ||
        !Number.isInteger(minutes) ||
        !Number.isInteger(seconds)
    ) {
        return null;
    }

    const parsedDate = new Date(year, month - 1, day, hours, minutes, seconds);

    if (
        parsedDate.getFullYear() !== year ||
        parsedDate.getMonth() !== month - 1 ||
        parsedDate.getDate() !== day ||
        parsedDate.getHours() !== hours ||
        parsedDate.getMinutes() !== minutes ||
        parsedDate.getSeconds() !== seconds
    ) {
        return null;
    }

    return parsedDate;
}

export function performanceStart(concert: APIConcertPreview): Date | null {
    const performance = concert.performances[0];

    if (!performance) return null;

    return parsePerformanceDate(performance.startDate, performance.startTime);
}

export function hasRenderablePerformance(
    concert: APIConcertPreview
): boolean {
    return performanceStart(concert) !== null;
}

export function performanceMonthKey(
    concert: APIConcertPreview
): string | null {
    const performance = concert.performances[0];

    if (
        !performance ||
        !parsePerformanceDate(performance.startDate, performance.startTime)
    ) {
        return null;
    }

    const [year, month] = performance.startDate.slice(0, 10).split("-");
    return `${year}-${month}`;
}

export function comparePerformanceDates(
    a: APIConcertPreview,
    b: APIConcertPreview,
    direction: PerformanceDateDirection
): number {
    const aStart = performanceStart(a);
    const bStart = performanceStart(b);

    if (!aStart) return bStart ? 1 : 0;
    if (!bStart) return -1;

    const comparison = aStart.getTime() - bStart.getTime();
    return direction === "asc" ? comparison : -comparison;
}

export function formatPerformanceDateRange(
    locale: string,
    performance: FormattedPerformance
): string | null {
    const start = parsePerformanceDate(performance.startDate, performance.startTime);

    if (!start) return null;

    const hasTime = !!performance.startTime || !!performance.endTime;
    const dateFormatter = new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
        ...(hasTime ? { timeStyle: "short" } : {})
    });

    if (!performance.endDate) {
        return dateFormatter.format(start);
    }

    const end = parsePerformanceDate(performance.endDate, performance.endTime);

    if (!end) {
        return dateFormatter.format(start);
    }

    if (dateFormatter.formatRange) {
        return dateFormatter.formatRange(start, end);
    }

    return `${dateFormatter.format(start)} - ${dateFormatter.format(end)}`;
}

export function formatPerformanceDateTimeAttribute(
    performance: FormattedPerformance
): string | null {
    if (!parsePerformanceDate(performance.startDate, performance.startTime)) {
        return null;
    }

    const startDate = performance.startDate.slice(0, 10);
    return performance.startTime
        ? `${startDate}T${performance.startTime}`
        : startDate;
}
