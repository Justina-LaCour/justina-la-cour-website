export type NestedRecordValue<TLeaf> = TLeaf | NestedRecordShape<TLeaf>;

export type NestedRecordShape<TLeaf> = {
    [key: string]: NestedRecordValue<TLeaf>;
};

export class NestedRecord<TLeaf> {
    private readonly data: NestedRecordShape<TLeaf>;

    public constructor(data: NestedRecordShape<TLeaf>) {
        this.data = data;
    }

    public get(path: string): NestedRecordValue<TLeaf> | undefined {
        const parts = path.split(".");
        let current: NestedRecordValue<TLeaf> | undefined = this.data;

        for (const part of parts) {
            if (!this.isNestedRecordShape(current) || !(part in current)) {
                return undefined;
            }

            current = current[part];
        }

        return current;
    }

    private isNestedRecordShape(
        value: NestedRecordValue<TLeaf> | undefined,
    ): value is NestedRecordShape<TLeaf> {
        return typeof value === "object" && value !== null;
    }
}
