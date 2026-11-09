import { NestedRecord } from "./utils/nestedRecord";

export class TranslationLocaleRecord extends NestedRecord<string> {
    public translate(
        key: string,
        vars: Record<string, unknown> = {},
    ): string {
        const raw = this.get(key);

        if (typeof raw !== "string") {
            return key;
        }

        return raw.replace(/\{(\w+)\}/g, (_match, varName: string) => {
            const value = vars[varName];

            if (value === undefined || value === null) {
                return `{${varName}}`;
            }

            return String(value);
        });
    }
}
