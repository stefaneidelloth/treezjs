export default class TreeViewAction {	

	constructor(label, image, atom, treeView, action) {		

		if(action===undefined){
			throw new Error('Action is missing!');
		}
		this.label = label;
		this.image = image;
		this.overlayImage = undefined; 
		this.atom = atom;
		this.treeView = treeView;	
		this.wrappedAction = action;	
		this.action = () => {
			this.wrappedAction();
			this.treeView.refresh(atom);
		}
	}

}
