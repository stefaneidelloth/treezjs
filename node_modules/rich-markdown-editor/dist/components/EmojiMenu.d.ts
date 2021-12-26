import React from "react";
import { Props } from "./CommandMenu";
declare type Emoji = {
    name: string;
    title: string;
    emoji: string;
    description: string;
    attrs: {
        markup: string;
        "data-name": string;
    };
};
declare class EmojiMenu extends React.Component<Omit<Props<Emoji>, "renderMenuItem" | "items" | "onLinkToolbarOpen" | "embeds" | "onClearSearch">> {
    get items(): Emoji[];
    clearSearch: () => void;
    render(): JSX.Element;
}
export default EmojiMenu;
//# sourceMappingURL=EmojiMenu.d.ts.map