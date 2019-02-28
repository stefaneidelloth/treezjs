import Atom from '../atom/atom.js';
import ComponentAtomCodeAdaption from './componentAtomCodeAdaption.js';
import ActionSeparator from '../actionSeparator.js';
import TreeViewerAction from '../treeview/treeViewerAction.js';

export default class ComponentAtom extends Atom {

	constructor(name) {
		super(name);		
		this.isRunnable = false;
		this.__treeView = undefined;
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

		head.append('<link rel="import" id="treez-check-box" href="./src/components/checkBox/treez-check-box.html"/>');
		head.append('<link rel="import" id="treez-color" href="./src/components/color/treez-color.html"/>');
		head.append('<link rel="import" id="treez-color-map" href="./src/components/colorMap/treez-color-map.html"/>');
		head.append('<link rel="import" id="treez-combo-box" href="./src/components/comboBox/treez-combo-box.html"/>');
		
		head.append('<link rel="import" id="treez-error-bar-style" href="./src/components/errorBarStyle/treez-error-bar-style.html"/>');

	    head.append('<link rel="import" id="treez-file-or-directory-path" href="./src/components/file/treez-file-or-directory-path.html"/>');
	    head.append('<link rel="import" id="treez-file-path" href="./src/components/file/treez-file-path.html"/>');
	    head.append('<link rel="import" id="treez-fill-style" href="./src/components/fillStyle/treez-fill-style.html"/>');
	    head.append('<link rel="import" id="treez-font" href="./src/components/font/treez-font.html"/>');
	    
	    head.append('<link rel="import" id="treez-image-combo-box" href="./src/components/imageComboBox/treez-image-combo-box.html"/>');		
		
		head.append('<link rel="import" id="treez-line-style" href="./src/components/lineStyle/treez-line-style.html"/>');
		
		head.append('<link rel="import" id="treez-model-path" href="./src/components/modelPath/treez-model-path.html"/>');
       
        head.append('<link rel="import" id="treez-section" href="./src/components/section/treez-section.html"/>');        
        head.append('<link rel="import" id="treez-size" href="./src/components/size/treez-size.html"/>');        
        head.append('<link rel="import" id="treez-string-list" href="./src/components/list/treez-string-list.html"/>');
        head.append('<link rel="import" id="treez-symbol-style" href="./src/components/symbolStyle/treez-symbol-style.html"/>');
      
        head.append('<link rel="import" id="treez-tab-folder" href="./src/components/tabs/treez-tab-folder.html"/>');
        head.append('<link rel="import" id="treez-text-area" href="./src/components/text/area/treez-text-area.html"/>');
        head.append('<link rel="import" id="treez-text-field" href="./src/components/text/field/treez-text-field.html"/>');
        head.append('<link rel="import" id="treez-text-label" href="./src/components/text/label/treez-text-label.html"/>'); 
      
    }

	copy(atomToCopy){
	    const newAtom = new ComponentAtom(atomToCopy.name);
		if (atomToCopy.model) {
		    newAtom.template = atomToCopy.template;
		}
		newAtom.isRunnable = atomToCopy.isRunnable;
		return newAtom;
	}

	createControlAdaption(parent, treeView) {

		const self = this;
		self.__treeView = treeView;
		parent.selectAll('treez-tab-folder').remove();	
		parent.selectAll('div').remove();

		const element = parent.append('div');
		

		const tabFolderElement = document.createElement('treez-tab-folder');
		const tabFolder = treeView.dTreez.select(tabFolderElement);
		self.createComponentControl(tabFolder, treeView.dTreez);				
		parent.appendChild(tabFolderElement);					
	
        self.afterCreateControlAdaptionHook();
 		
	}	

	/*
	 * Should be overridden by inheriting classes
	 */
	createComponentControl(tabFolder, dTreez){
        tabFolder.append('treez-tab')
        	.append('div')
            .html(this.name);
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

	createContextMenuActions(parentSelection, treeView) {

        let actions = [];

        if (this.isRunnable) {
			actions.push(new TreeViewerAction(
								"Run", 
								"run.png",
								treeView,
								() => this.execute(treeView)
							)
			);
		}
		
		actions.push(new ActionSeparator());
		
		actions = this.extendContextMenuActions(actions, parentSelection, treeView);
		
		actions.push(new ActionSeparator());

        const superActions = super.createContextMenuActions(parentSelection, treeView);
        actions.concat(superActions);

		return actions;
	}

	extendContextMenuActions(actions, parentSelection, treeView) {
		return actions;
	}

}