export default class TreeViewAction {	

	constructor(label, imageName, treeView, action) {
		var self=this;
		self.label=label;
		self.imageName=imageName;
		self.treeView=treeView;		
		self.action=()=>{
			action();
			self.treeView.refresh();
			}
	}

}
