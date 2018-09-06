import TreeViewerAction from "./treeViewerAction.js";
import Utils from "../utils/utils.js";

export default class AddChildAtomTreeViewerAction extends TreeViewerAction {

    static createLabel(namePrefix) {
        return "Add " + Utils.firstToUpperCase(namePrefix);
    }

    constructor(atomConstructor, namePrefix, imageName, parentAtom, treeViewerRefreshable) {
    	super(AddChildAtomTreeViewerAction.createLabel(namePrefix), imageName, treeViewerRefreshable, null);
        var self = this;
    	this.action = ()=>{
            parentAtom.createChildAtom(atomConstructor, namePrefix);
            parentAtom.createTreeNodeAdaption().expand(treeViewerRefreshable);
            self.treeViewerRefreshable.refresh();
		}
    }



}
