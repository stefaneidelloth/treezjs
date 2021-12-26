import { html } from "lit";
import { ifDefined } from "lit/directives/if-defined";
export function renderIcon(icon, opts = {}) {
    if (typeof icon === "string") {
        // font-based icon (e.g. bootstrap icon)
        const size = Math.max(opts.height || 0, opts.width || 0);
        const style = size ? `font-size: ${size}px` : undefined;
        return html `<span class="${icon}" style="${ifDefined(style)}" title=${ifDefined(opts.title)}></span>`;
    }
    return icon(opts);
}
//# sourceMappingURL=icon.js.map