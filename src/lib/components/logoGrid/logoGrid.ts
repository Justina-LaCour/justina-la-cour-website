export interface LogoGridItem {
    name: string;
    imageUrl: string;
    width?: number;
    height?: number;
    href?: string;
}

export interface LogoGridProps {
    items: readonly LogoGridItem[];
    showLabels?: boolean;
    class?: string;
    itemClass?: string;
}
