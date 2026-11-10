import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = fileURLToPath(new URL("../../", import.meta.url));

function readProjectFile(path: string): string {
    return readFileSync(resolve(projectRoot, path), "utf8");
}

describe("Node runtime configuration", () => {
    it("declares only Node versions supported by the Vercel adapter", () => {
        const packageJson = JSON.parse(readProjectFile("package.json")) as {
            engines?: { node?: string };
        };

        expect(packageJson.engines?.node).toBe("26.x");
        expect(readProjectFile(".nvmrc").trim()).toBe("26");
        expect(readProjectFile(".npmrc")).toContain("engine-strict=true");
    });

    it("lets the Vercel adapter inherit the deployment runtime", () => {
        const svelteConfig = readProjectFile("kit.config.ts");

        expect(svelteConfig).toMatch(/adapter:\s*adapter\(\)/);
        expect(svelteConfig).not.toMatch(/runtime\s*:/);
    });

    it("enables Vercel's CommonJS-to-ESM bridge for sanitize-html", () => {
        expect(readProjectFile(".env.example")).toContain(
            "NODE_OPTIONS=--experimental-require-module"
        );
    });
});
