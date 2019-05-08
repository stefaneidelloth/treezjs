import TreeViewAction from './TreeViewAction.js';
import Utils from '../utils/utils.js';

export default class AddChildAtomTreeViewAction extends TreeViewAction {

    static createLabel(namePrefix) {
        return 'Add ' + Utils.firstToUpperCase(namePrefix);
    }

    constructor(atomConstructor, namePrefix, image, grandParentSelection, parentAtom, treeView, postCreationHook) {
    	super(AddChildAtomTreeViewAction.createLabel(namePrefix), image, parentAtom, treeView, null);
    	this.overlayImage = 'add_decoration.png';
        var self = this;
    	this.action = ()=>{
    		//create child
            var child = parentAtom.createChildWithNamePrefix(atomConstructor, namePrefix);
            
            if(postCreationHook){
            	postCreationHook(child);
            }
            
           //recreate tree node adaption of parent atom to show child
           var grandParentElement = grandParentSelection.node();
           var parentElement = grandParentElement.children.namedItem(parentAtom.treePath);
          
           var details = parentAtom.createTreeNodeAdaption(grandParentSelection, treeView);           

           var detailsElement = details.node();

		   grandParentElement.insertBefore(detailsElement, parentElement);
           parentElement.remove();  

           details.attr('open', true);   
                     
		}
    }



}
