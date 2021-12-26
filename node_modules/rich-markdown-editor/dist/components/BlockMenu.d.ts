import React from "react";
import { Props } from "./CommandMenu";
declare type BlockMenuProps = Omit<Props, "renderMenuItem" | "items" | "onClearSearch"> & Required<Pick<Props, "onLinkToolbarOpen" | "embeds">>;
declare class BlockMenu extends React.Component<BlockMenuProps> {
    get items(): import("../types").MenuItem[];
    clearSearch: () => void;
    render(): JSX.Element;
}
export default BlockMenu;
//# sourceMappingURL=BlockMenu.d.ts.map