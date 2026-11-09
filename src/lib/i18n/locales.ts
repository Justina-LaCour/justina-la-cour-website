import { site, type SupportedLanguage } from "$lib/config/config";
import type { NestedRecordShape } from "./utils/nestedRecord";

export interface LocaleModule {
    default: NestedRecordShape<string>;
}

export function isSupportedLanguage(
    locale: string
): locale is SupportedLanguage {
    return site.locales.supported.includes(locale as SupportedLanguage);
}
