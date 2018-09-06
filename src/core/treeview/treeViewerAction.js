export default class TreeViewerAction {	

	constructor(label, imageName, treeViewerRefreshable, action) {
		var self=this;
		self.label=label;
		self.imageName=imageName;
		self.treeViewerRefreshable=treeViewerRefreshable;		
		self.action=()=>{
			action();
			self.treeViewerRefreshable.refresh();
			}
	}

}
