import { test } from "node:test";
import assert from "node:assert/strict";
import { revalidateSite, runRevalidation } from "../../scripts/revalidate.mjs";

const env = { PUBLIC_SITE_URL: "https://justina.example", ARTKYT_WEBHOOK_SECRET: "test-secret" };
const paths = ["", "/bio", "/news", "/concerts", "/media", "/contact"]
    .flatMap((path) => ["/en" + path, "/fr" + path]);

async function run(fetcher, overrides = {}) {
    const output = [];
    const code = await runRevalidation({ ...env, ...overrides }, {
        fetcher, log: (line) => output.push(line), error: (line) => output.push(line)
    });
    assert.ok(!output.join("\n").includes(env.ARTKYT_WEBHOOK_SECRET));
    return { code, output: output.join("\n") };
}

test("requests every server-configured page with authentication and bounded timeout", async () => {
    const result = await run(async (url, options) => {
        assert.equal(String(url), "https://justina.example/api/revalidate");
        assert.equal(options.method, "POST");
        assert.equal(options.headers.Authorization, "Bearer test-secret");
        assert.equal(options.headers["Content-Type"], "application/json");
        assert.deepEqual(JSON.parse(options.body), { pages: "all" });
        assert.equal(options.redirect, "error");
        assert.ok(options.signal instanceof AbortSignal);
        return Response.json({ revalidated: paths, failed: [] });
    });
    assert.equal(result.code, 0);
    for (const path of paths) assert.ok(result.output.includes(`Revalidated ${path}`));
    assert.match(result.output, /12 revalidated; 0 failed/);
});

for (const siteUrl of ["", "http://justina.example", "https://user:password@justina.example", "https://justina.example/path", "https://justina.example?x=1", "https://justina.example#fragment"]) {
    test(`rejects invalid origin ${siteUrl} before making a request`, async () => {
        const result = await run(() => assert.fail("Unexpected request"), { PUBLIC_SITE_URL: siteUrl });
        assert.equal(result.code, 1);
        assert.match(result.output, /PUBLIC_SITE_URL/);
    });
}

test("rejects a missing secret before making a request", async () => {
    const result = await run(() => assert.fail("Unexpected request"), { ARTKYT_WEBHOOK_SECRET: " " });
    assert.equal(result.code, 1);
    assert.match(result.output, /ARTKYT_WEBHOOK_SECRET/);
});

test("reports partial failure and exits unsuccessfully even for HTTP 200", async () => {
    for (const status of [200, 502]) {
        const result = await run(async () => Response.json({
            revalidated: ["/en"],
            failed: [{ path: "/fr", status: 503 }, { path: "/en/bio", status: null }]
        }, { status }));
        assert.equal(result.code, 1);
        assert.match(result.output, /Failed \/fr \(HTTP 503\)/);
        assert.match(result.output, /Failed \/en\/bio \(network error\)/);
    }
});

test("rejects HTTP authentication failure without echoing the response body", async () => {
    const result = await run(async () => Response.json({ error: env.ARTKYT_WEBHOOK_SECRET }, { status: 401 }));
    assert.equal(result.code, 1);
    assert.match(result.output, /HTTP 401/);
});

test("rejects non-success HTTP status even with a success-shaped body", async () => {
    const result = await run(async () => Response.json({ revalidated: paths, failed: [] }, { status: 500 }));
    assert.equal(result.code, 1);
    assert.match(result.output, /HTTP 500/);
});

test("rejects malformed JSON, invalid result shapes and an empty route map", async () => {
    for (const response of [
        new Response("not json"),
        Response.json({ revalidated: paths }),
        Response.json({ revalidated: [4], failed: [] }),
        Response.json({ revalidated: [], failed: [{ path: "/en", status: "500" }] }),
        Response.json({ revalidated: [], failed: [] })
    ]) {
        assert.equal((await run(async () => response)).code, 1);
    }
});

test("network errors and timeouts never expose credentials", async () => {
    for (const cause of [new Error(`network failure ${env.ARTKYT_WEBHOOK_SECRET}`), new DOMException("Timed out", "TimeoutError")]) {
        const result = await run(async () => { throw cause; });
        assert.equal(result.code, 1);
        assert.match(result.output, /failed or timed out/);
    }
});

test("normalizes a trailing slash without changing the request origin", async () => {
    await revalidateSite({ siteUrl: " https://justina.example/ ", secret: " test-secret " }, async (url) => {
        assert.equal(String(url), "https://justina.example/api/revalidate");
        return Response.json({ revalidated: paths, failed: [] });
    });
});
