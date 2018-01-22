import AttributeAtom from "./attributeAtom.js";
import EmptyControlAdaption from "./emptyControlAdaption.js";

/**
 * Used as root for the model tree of the adjustable atom
 */
export default class AttributeRoot extends AttributeAtom {

	constructor(name) {
		super(name);
	}
	
	copy() {
		var newAtom = new AttributeRoot(this.name);
		this.copyChildrenTo(newAtom);
		newAtom.expandedNodes = this.expandedNodes;			
	}

	createControlAdaption(parent, treeViewRefreshable) {		
		return new EmptyControlAdaption(parent, this, "");
	}

	createContextMenuActions(treeViewerRefreshable) {
		return [];
	}

	provideImageName() {
		return "root.png";		
	}

    addPage(treeViewer) {
		var name = Atom.createChildNameStartingWith(this, "myPage");
		this.createPage(name);
	}

	createPage(name) {
		var page = new Page(name);
		this.addChild(page);
		return page;
	}

    createPage(name, title) {
		var page = this.createPage(name);
		page.title = title;
		return page;
	}

}
