import sanitizeHtml from "sanitize-html";

const ALLOWED_TAGS = [
    "p",
    "br",
    "hr",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "s",
    "sub",
    "sup",
    "a",
    "ul",
    "ol",
    "li",
    "dl",
    "dt",
    "dd",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "blockquote",
    "pre",
    "code",
    "table",
    "caption",
    "thead",
    "tbody",
    "tfoot",
    "tr",
    "th",
    "td"
] as const;

const NON_TEXT_TAGS = [
    "script",
    "style",
    "textarea",
    "option",
    "xmp",
    "noscript",
    "template",
    "iframe",
    "object",
    "embed",
    "svg",
    "math"
];

export function sanitizeRichTextHtml(value: string): string {
    return sanitizeHtml(value, {
        allowedTags: [...ALLOWED_TAGS],
        allowedAttributes: {
            a: ["href", "title"]
        },
        allowedSchemes: ["http", "https", "mailto", "tel"],
        allowedSchemesAppliedToAttributes: ["href"],
        allowProtocolRelative: false,
        disallowedTagsMode: "discard",
        nonTextTags: NON_TEXT_TAGS,
        nestingLimit: 20,
        parseStyleAttributes: false
    });
}
