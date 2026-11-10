export function isNavigationPathActive(
    currentPathname: string,
    targetPathname: string
): boolean {
    const target = targetPathname.replace(/\/+$/, "") || "/";
    const current = currentPathname.replace(/\/+$/, "") || "/";

    if (current === target) return true;

    const targetSegments = target.split("/").filter(Boolean);
    if (targetSegments.length <= 1) return false;

    return current.startsWith(`${target}/`);
}
