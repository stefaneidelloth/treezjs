export function copyToClipboard(value) {
    try {
        navigator.clipboard.writeText(value);
        return;
    }
    catch (e) {
        console.error("Your browser does not support navigator.clipboard.writeText");
    }
    const el = document.createElement("textarea");
    el.value = value;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
}
//# sourceMappingURL=clipboard.js.map