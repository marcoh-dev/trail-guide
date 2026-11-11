import sanitizeHtml from "sanitize-html";

export function cleanHtml(value: string | undefined | null): string | null {
	if (!value) return null;

	return sanitizeHtml(value, {
		allowedTags: ["p", "h2", "h3", "h4", "strong", "em", "ul", "ol", "li", "a", "img", "br"],
		allowedAttributes: {
			a: ["href", "target", "rel"],
			img: ["src", "alt", "width", "height"],
		},
		allowedSchemes: ["https"],
		transformTags: {
			a: sanitizeHtml.simpleTransform("a", {
				rel: "noopener noreferrer",
			}),
		},
	});
}
