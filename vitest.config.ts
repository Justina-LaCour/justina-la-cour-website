import { fileURLToPath } from "node:url";
import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config.ts";

export default mergeConfig(viteConfig, defineConfig({
    resolve: {
        alias: {
            $src: fileURLToPath(new URL("./src", import.meta.url)),
            $tests: fileURLToPath(new URL("./tests", import.meta.url))
        }
    },
    test: {
        include: ["tests/**/*.test.ts"],
        setupFiles: ["./tests/support/setup.ts"]
    }
}));
