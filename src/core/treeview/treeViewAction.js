export default class TreeViewAction {	

	constructor(label, imageName, atom, treeView, action) {
		var self=this;
		self.label=label;
		self.imageName=imageName;
		self.atom = atom;
		self.treeView=treeView;		
		self.action=()=>{
			action();
			self.treeView.refresh(atom);
		}
	}

}
