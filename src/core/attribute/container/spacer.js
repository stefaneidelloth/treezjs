import AttributeContainerAtom from './attributeContainerAtom.js';

export default class Spacer extends AttributeContainerAtom {
	
	constructor(String name) {
		super(name);
		this.width=100;
		this.height=100;
	}	

	copy() {
		var newAtom = new Spacer(this.name);
		newAtom.width = this.width;
		newAtomheight = this.height;
		return newAtom;
	}

	provideImageName() {
		return "Spacer.png";
	}

	createAtomControl(parent, treeViewerRefreshable) {
		throw new IllegalStateException("Not yet implemented");
	}	

}
