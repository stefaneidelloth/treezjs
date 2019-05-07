export default class TreeViewAction {	

	constructor(label, image, atom, treeView, action) {		
		this.label = label;
		this.image = image;
		this.overlayImage = undefined; 
		this.atom = atom;
		this.treeView = treeView;		
		this.action = () => {
			action();
			this.treeView.refresh(atom);
		}
	}

}
