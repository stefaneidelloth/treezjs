import TreeViewAction from "./TreeViewAction.js";
import Utils from "../utils/utils.js";

export default class AddChildAtomTreeViewAction extends TreeViewAction {

    static createLabel(namePrefix) {
        return "Add " + Utils.firstToUpperCase(namePrefix);
    }

    constructor(atomConstructor, namePrefix, imageName, parentSelection, parentAtom, treeView) {
    	super(AddChildAtomTreeViewAction.createLabel(namePrefix), imageName, treeView, null);
        var self = this;
    	this.action = ()=>{
    		//create child
            parentAtom.createChildWithNamePrefix(atomConstructor, namePrefix);
            
            parentSelection.selectAll(".treez-details").remove();
    		parentSelection.selectAll(".treez-leaf-node").remove();

            //update tree node adaption of parent atom to show child
            var details = parentAtom.createTreeNodeAdaption(parentSelection, treeView);
            details.attr("open",true);           
		}
    }



}
