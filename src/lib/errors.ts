export type PublicErrorTranslationKey =
    | "errorPage.contentUnavailable"
    | "errorPage.configuration"
    | "errorPage.notFound"
    | "errorPage.unexpected";

export function resolvePublicErrorTranslationKey(
    status: number,
    translationKey?: string
): PublicErrorTranslationKey {
    if (
        translationKey === "errorPage.contentUnavailable" ||
        translationKey === "errorPage.configuration" ||
        translationKey === "errorPage.notFound" ||
        translationKey === "errorPage.unexpected"
    ) {
        return translationKey;
    }

    return status === 404
        ? "errorPage.notFound"
        : "errorPage.unexpected";
}
