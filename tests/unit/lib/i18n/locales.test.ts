import { site } from "$lib/config/config";
import { describe, expect, it } from "vitest";
import {
    formFailureTranslationKeys,
    formIssueTranslationKeys
} from "$lib/forms";
import type { LocaleModule } from "$lib/i18n/locales";

const localeModules = import.meta.glob<LocaleModule>(
    "$lib/translations/*.ts",
    { eager: true }
);

describe("translation modules", () => {
    it("loads every configured locale by convention", async () => {
        for (const locale of site.locales.supported) {
            const module = Object.entries(localeModules).find(
                ([path]) => path.endsWith(`/${locale}.ts`)
            )?.[1];

            expect(module?.default).toHaveProperty("nav.home");
        }
    });

    it("defines the same translation keys in every configured locale", () => {
        const englishKeys = translationLeafKeys(messagesFor("en"));

        for (const locale of site.locales.supported) {
            expect(translationLeafKeys(messagesFor(locale))).toEqual(
                englishKeys
            );
        }
    });

    it("defines every registered form issue in every locale", () => {
        for (const locale of site.locales.supported) {
            const messages = messagesFor(locale);

            for (const key of Object.values(formIssueTranslationKeys)) {
                expect(messages).toHaveProperty(key);
                expect(valueAtPath(messages, key)).toEqual(expect.any(String));
            }
        }
    });

    it("defines every public form failure in every locale", () => {
        for (const locale of site.locales.supported) {
            const messages = messagesFor(locale);

            for (const key of Object.values(formFailureTranslationKeys)) {
                expect(messages).toHaveProperty(key);
                expect(valueAtPath(messages, key)).toEqual(expect.any(String));
            }
        }
    });
});

function messagesFor(locale: string): unknown {
    return Object.entries(localeModules).find(
        ([path]) => path.endsWith(`/${locale}.ts`)
    )?.[1].default;
}

function translationLeafKeys(value: unknown, prefix = ""): string[] {
    if (typeof value === "string") {
        return [prefix];
    }

    if (typeof value !== "object" || value === null) {
        return [];
    }

    return Object.entries(value)
        .flatMap(([key, child]) =>
            translationLeafKeys(child, prefix ? `${prefix}.${key}` : key)
        )
        .sort();
}

function valueAtPath(value: unknown, path: string): unknown {
    return path.split(".").reduce<unknown>((current, key) => {
        if (typeof current !== "object" || current === null) {
            return undefined;
        }

        return (current as Record<string, unknown>)[key];
    }, value);
}
