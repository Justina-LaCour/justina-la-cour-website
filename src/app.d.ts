import type { PublicErrorTranslationKey } from "$lib/errors";

declare global {
    namespace App {
        interface Error {
            translationKey?: PublicErrorTranslationKey;
        }
    }
}

export {};
