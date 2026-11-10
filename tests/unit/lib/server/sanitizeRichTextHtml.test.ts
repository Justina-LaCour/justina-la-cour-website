import { describe, expect, it } from "vitest";

import { sanitizeRichTextHtml } from "$lib/server/sanitizeRichTextHtml";

describe("sanitizeRichTextHtml", () => {
    it("preserves expected rich-text formatting", () => {
        const value = `
            <h2>Programme</h2>
            <p><strong>Bold</strong>, <em>emphasis</em> and <a href="https://example.com" title="Details">a link</a>.</p>
            <blockquote><code>Quoted code</code></blockquote>
            <ol><li>First</li><li>Second</li></ol>
            <table><caption>Dates</caption><tbody><tr><th scope="col">Day</th><td colspan="2">Friday</td></tr></tbody></table>
        `;

        const result = sanitizeRichTextHtml(value);

        expect(result).toContain("<h2>Programme</h2>");
        expect(result).toContain("<strong>Bold</strong>");
        expect(result).toContain("<em>emphasis</em>");
        expect(result).toContain(
            '<a href="https://example.com" title="Details">a link</a>'
        );
        expect(result).toContain("<blockquote><code>Quoted code</code></blockquote>");
        expect(result).toContain("<ol><li>First</li><li>Second</li></ol>");
        expect(result).toContain("<table>");
        expect(result).not.toContain("scope=");
        expect(result).not.toContain("colspan=");
    });

    it("keeps safe absolute, relative and fragment links", () => {
        const result = sanitizeRichTextHtml(`
            <a href="http://example.com">HTTP</a>
            <a href="https://example.com">HTTPS</a>
            <a href="mailto:artist@example.com">Email</a>
            <a href="tel:+41000000000">Phone</a>
            <a href="/concerts">Relative</a>
            <a href="#programme">Fragment</a>
        `);

        expect(result).toContain('href="http://example.com"');
        expect(result).toContain('href="https://example.com"');
        expect(result).toContain('href="mailto:artist@example.com"');
        expect(result).toContain('href="tel:+41000000000"');
        expect(result).toContain('href="/concerts"');
        expect(result).toContain('href="#programme"');
    });

    it("removes scripts, handlers, presentation attributes and unsafe links", () => {
        const result = sanitizeRichTextHtml(`
            <script>alert(1)</script>
            <p id="intro" class="lead" style="color:red" onclick="alert(1)">Safe text</p>
            <a href="javascript:alert(1)" target="_blank" rel="opener">Unsafe</a>
            <a href="data:text/html;base64,WA==">Data</a>
            <a href="//example.com">Protocol-relative</a>
        `);

        expect(result).not.toContain("script");
        expect(result).not.toContain("alert(1)");
        expect(result).toContain("<p>Safe text</p>");
        expect(result).not.toContain("onclick");
        expect(result).not.toContain("style=");
        expect(result).not.toContain("class=");
        expect(result).not.toContain("id=");
        expect(result).not.toContain("javascript:");
        expect(result).not.toContain("data:");
        expect(result).not.toContain("//example.com");
        expect(result).not.toContain("target=");
        expect(result).not.toContain("rel=");
    });

    it("drops embedded content and raw-text attack patterns", () => {
        const result = sanitizeRichTextHtml(`
            <img src="x" onerror="alert(1)">
            <iframe src="https://example.com">frame</iframe>
            <object data="https://example.com">object</object>
            <form action="https://example.com"><input name="email"><button>Send</button></form>
            <svg><foreignObject><img src="x" onerror="alert(2)"></foreignObject></svg>
            <math><mtext><img src="x" onerror="alert(3)"></mtext></math>
            <svg><foreignObject><math></svg><img src="x" onerror="alert(4)">
            <math><mtext></svg><img src="x" onerror="alert(5)"></math>
            <xmp><img src=x onerror=alert(6)></xmp>
            <textarea><img src=x onerror=alert(7)></textarea>
        `);

        expect(result).not.toMatch(
            /<(?:img|iframe|object|embed|form|input|button|svg|math|xmp|textarea)\b/i
        );
        expect(result).not.toContain("onerror");
        expect(result).not.toContain("alert(");
        expect(result).not.toContain("<img");
    });
});
