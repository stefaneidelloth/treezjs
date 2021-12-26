import { Plugin } from "prosemirror-state";
import Extension from "rich-markdown-editor/dist/lib/Extension";
export default class PasteHandler extends Extension {
    get name(): string;
    get plugins(): Plugin<any, any>[];
}
