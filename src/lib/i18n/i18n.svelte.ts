// src/lib/i18n/i18n.svelte.ts
import { getContext, setContext } from "svelte";
import { TranslationLocaleRecord } from "./localeRecord";
import type { NestedRecordShape } from "./utils/nestedRecord";

const I18N_CONTEXT = Symbol("i18n");

export class I18n {
    private records = $state<Record<string, TranslationLocaleRecord>>({});
    private readonly defaultVariables: Record<string, unknown>;
    public locale = $state("");

    public constructor(options?: {
        locale?: string;
        initialMessages?: Record<string, NestedRecordShape<string>>;
        defaultVariables?: Record<string, unknown>;
    }) {
        this.locale = options?.locale ?? "";
        this.defaultVariables = options?.defaultVariables ?? {};

        for (const [locale, messages] of Object.entries(
            options?.initialMessages ?? {},
        )) {
            this.records[locale] = new TranslationLocaleRecord(messages);
        }
    }

    public registerLocale(
        locale: string,
        messages: NestedRecordShape<string>,
    ): void {
        this.records[locale] = new TranslationLocaleRecord(messages);
    }

    public t(
        key: string,
        vars: Record<string, unknown> = {},
    ): string {
        const record = this.records[this.locale];

        if (!record) {
            return key;
        }

        return record.translate(key, {
            ...this.defaultVariables,
            ...vars
        });
    }
}

export function provideI18n(i18n: I18n): I18n {
    setContext(I18N_CONTEXT, i18n);
    return i18n;
}

export function useI18n(): I18n {
    const i18n = getContext<I18n>(I18N_CONTEXT);

    if (!i18n) {
        throw new Error("useI18n() must be used under an i18n provider");
    }

    return i18n;
}
