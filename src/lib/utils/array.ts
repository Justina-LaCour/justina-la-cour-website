export interface GroupItem<T> {
    groupKey: string;
    items: T[];
}

export function groupBy<T>(items: T[], keyFn: (item: T) => string): GroupItem<T>[] {
    const groups = new Map<string, T[]>();

    for (const item of items) {
        const groupKey = keyFn(item);
        const group = groups.get(groupKey);

        if (group) {
            group.push(item);
        } else {
            groups.set(groupKey, [item]);
        }
    }

    return Array.from(groups, ([groupKey, items]) => ({ groupKey, items }));
}


export function unique<T>(items: readonly T[]): T[] {
    return [...new Set(items)];
}
