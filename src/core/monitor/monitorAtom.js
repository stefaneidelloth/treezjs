import ComponentAtom from './../../core/atom/atom.js';

export default class MonitorAtom extends Atom {

	constructor(name) {
		super(name);
		this.isRunnable = false;
	}	

	createControlAdaption(parent, treeView) {

		const self = this;
		self.treeView = treeView;		
		parent.selectAll('div').remove();

		const element = parent.append('div');	

		
        self.afterCreateControlAdaptionHook();
 		
	}	

}
