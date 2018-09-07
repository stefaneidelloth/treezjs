import Atom from '../atom/atom.js';
import ComponentAtomCodeAdaption from './componentAtomCodeAdaption.js';
import ActionSeparator from '../actionSeparator.js';
import TreeViewerAction from '../treeview/treeViewerAction.js';

export default class ComponentAtom extends Atom {

	constructor(name) {
		super(name);		
		this.isRunnable = false;
        ComponentAtom.initializeComponentsIfRequired()
	}

	static initializeComponentsIfRequired(){
	    if(!ComponentAtom.componentsAreInitialized){
	        ComponentAtom.initializeComponents();
        }
        ComponentAtom.componentsAreInitialized = true;
    }

    static initializeComponents(){
	    const head = $('head');

		head.append('<link rel="import" id="treez-checkbox" href="./src/components/checkbox/treez-checkbox.html"/>');

	    head.append('<link rel="import" id="treez-file-or-directory-path" href="./src/components/file/treez-file-or-directory-path.html"/>');
        head.append('<link rel="import" id="treez-file-path" href="./src/components/file/treez-file-path.html"/>');

		head.append('<link rel="import" id="treez-label" href="./src/components/text/treez-label.html"/>');
       
        head.append('<link rel="import" id="treez-section" href="./src/components/section/treez-section.html"/>');
      
        head.append('<link rel="import" id="treez-tab-folder" href="./src/components/tabs/treez-tab-folder.html"/>');
        head.append('<link rel="import" id="treez-text-area" href="./src/components/text/treez-text-area.html"/>');
       
        

      
    }

	copy(atomToCopy){
	    const newAtom = new ComponentAtom(atomToCopy.name);
		if (atomToCopy.model) {
		    newAtom.template = atomToCopy.template;
		}
		newAtom.isRunnable = atomToCopy.isRunnable;
		return newAtom;
	}

	createControlAdaption(parent, d3, treeViewRefreshable) {

		const self = this;
		self.treeViewRefreshable = treeViewRefreshable;
		parent.selectAll('treez-tab-folder').remove();	

		const element = parent.append('div');
		

		const tabFolderElement = document.createElement('treez-tab-folder');
		const tabFolder = d3.select(tabFolderElement);
		self.createComponentControl(tabFolder, d3);				
		parent.node().appendChild(tabFolderElement);					
	
        self.afterCreateControlAdaptionHook();
 		
	}	

	/*
	 * Should be overridden by inheriting classes
	 */
	createComponentControl(tabFolder, d3){
        tabFolder.append('treez-tab')
        	.append('div')
            .html('{{name}}');
	}

	/**
	 * Method that might perform some additional actions after creating the control adaption. Can be overridden by
	 * inheriting classes. This default implementation does nothing.
	 */
	afterCreateControlAdaptionHook() {
		//nothing to do here
	}

	createCodeAdaption() {
		return new ComponentAtomCodeAdaption(this);
	}

	createContextMenuActions(treeViewerRefreshable) {

        let actions = [];

        if (this.isRunnable) {
			actions.push(new TreeViewerAction(
								"Run", 
								"run.png",
								treeViewerRefreshable,
								() => this.execute(treeViewerRefreshable)
							)
			);
		}
		
		actions.push(new ActionSeparator());
		
		actions = this.extendContextMenuActions(actions, treeViewerRefreshable);
		
		actions.push(new ActionSeparator());

        const superActions = super.createContextMenuActions(treeViewerRefreshable);
        actions.concat(superActions);

		return actions;
	}

	extendContextMenuActions(actions, treeViewerRefreshable) {
		return actions;
	}

}