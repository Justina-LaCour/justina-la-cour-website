declare module "*enhanced" {
    const value: import("@sveltejs/enhanced-img").Picture;
    export default value;
}

declare module "*inline" {
    const value: string;
    export default value;
}

declare module "*format=jpg&quality=80" {
    const value: string;
    export default value;
}
