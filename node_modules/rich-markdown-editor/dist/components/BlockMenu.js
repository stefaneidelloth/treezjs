"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const prosemirror_utils_1 = require("prosemirror-utils");
const CommandMenu_1 = __importDefault(require("./CommandMenu"));
const BlockMenuItem_1 = __importDefault(require("./BlockMenuItem"));
const block_1 = __importDefault(require("../menus/block"));
class BlockMenu extends react_1.default.Component {
    constructor() {
        super(...arguments);
        this.clearSearch = () => {
            const { state, dispatch } = this.props.view;
            const parent = prosemirror_utils_1.findParentNode(node => !!node)(state.selection);
            if (parent) {
                dispatch(state.tr.insertText("", parent.pos, state.selection.to));
            }
        };
    }
    get items() {
        return block_1.default(this.props.dictionary);
    }
    render() {
        return (react_1.default.createElement(CommandMenu_1.default, Object.assign({}, this.props, { filterable: true, onClearSearch: this.clearSearch, renderMenuItem: (item, _index, options) => {
                return (react_1.default.createElement(BlockMenuItem_1.default, { onClick: options.onClick, selected: options.selected, icon: item.icon, title: item.title, shortcut: item.shortcut }));
            }, items: this.items })));
    }
}
exports.default = BlockMenu;
//# sourceMappingURL=BlockMenu.js.map