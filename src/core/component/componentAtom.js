import Atom from '../atom/atom.js';
import ComponentAtomCodeAdaption from './componentAtomCodeAdaption.js';
import ActionSeparator from '../actionSeparator.js';
import TreeViewAction from '../treeview/TreeViewAction.js';

export default class ComponentAtom extends Atom {

	constructor(name) {
		super(name);	
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
		head.append('<link rel="import" id="color" href="./src/components/color/color.html"/>');
		
		head.append('<link rel="import" id="treez-color-map" href="./src/components/colorMap/treez-color-map.html"/>');
		head.append('<link rel="import" id="color-map" href="./src/components/colorMap/color-map.html"/>');
		
		head.append('<link rel="import" id="treez-combo-box" href="./src/components/comboBox/treez-combo-box.html"/>');
		head.append('<link rel="import" id="treez-enum-combo-box" href="./src/components/comboBox/treez-enum-combo-box.html"/>');
		
		head.append('<link rel="import" id="treez-error-bar-style" href="./src/components/errorBarStyle/treez-error-bar-style.html"/>');
		head.append('<link rel="import" id="error-bar-style" href="./src/components/errorBarStyle/error-bar-style.html"/>');

	    head.append('<link rel="import" id="treez-file-or-directory-path" href="./src/components/file/treez-file-or-directory-path.html"/>');
	    head.append('<link rel="import" id="treez-file-path" href="./src/components/file/treez-file-path.html"/>');
	    
	    head.append('<link rel="import" id="treez-fill-style" href="./src/components/fillStyle/treez-fill-style.html"/>');
	    head.append('<link rel="import" id="fill-style" href="./src/components/fillStyle/fill-style.html"/>');
	    
	    head.append('<link rel="import" id="treez-font" href="./src/components/font/treez-font.html"/>');
	    
	    head.append('<link rel="import" id="treez-image-combo-box" href="./src/components/imageComboBox/treez-image-combo-box.html"/>');		
		
		head.append('<link rel="import" id="treez-line-style" href="./src/components/lineStyle/treez-line-style.html"/>');
		head.append('<link rel="import" id="line-style" href="./src/components/lineStyle/line-style.html"/>');
		
		head.append('<link rel="import" id="treez-model-path" href="./src/components/modelPath/treez-model-path.html"/>');
       
        head.append('<link rel="import" id="treez-section" href="./src/components/section/treez-section.html"/>');        
        head.append('<link rel="import" id="treez-size" href="./src/components/size/treez-size.html"/>');        
        head.append('<link rel="import" id="treez-string-list" href="./src/components/list/treez-string-list.html"/>');
        
        head.append('<link rel="import" id="treez-symbol-style" href="./src/components/symbolStyle/treez-symbol-style.html"/>');
        head.append('<link rel="import" id="symbol-style" href="./src/components/symbolStyle/symbol-style.html"/>');
      
        head.append('<link rel="import" id="treez-tab-folder" href="./src/components/tabs/treez-tab-folder.html"/>');
        head.append('<link rel="import" id="treez-text-area" href="./src/components/text/area/treez-text-area.html"/>');
        head.append('<link rel="import" id="treez-text-field" href="./src/components/text/field/treez-text-field.html"/>');
        head.append('<link rel="import" id="treez-text-label" href="./src/components/text/label/treez-text-label.html"/>'); 
      
    }
	
    createControlAdaption(parent, treeView) {

		const self = this;
		self.__treeView = treeView;
		parent.selectAll('treez-tab-folder').remove();	
		parent.selectAll('div').remove();
		
		const pathInfo = parent.append('div')
			.className('treez-properties-path-info')
			.text(this.getTreePath());	

		const tabFolderElement = document.createElement('treez-tab-folder');
		const tabFolder = treeView.dTreez.select(tabFolderElement);
		self.createComponentControl(tabFolder);				
		parent.appendChild(tabFolderElement);					
	
        self.afterCreateControlAdaptionHook();
 		
	}	

	/*
	 * Should be overridden by inheriting classes
	 */
	createComponentControl(tabFolder){
        tabFolder.append('treez-tab')
        	.label(this.constructor.name)
        	.append('div')
        	.style('margin','5px')
            .text(this.name);
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
			actions.push(new TreeViewAction(
								'Run', 
								'run.png',
								treeView,
								() => this.execute(treeView)
										  .catch(error => {
											  console.error('Could not execute  ' + this.constructor.name + ' "' + this.name + '"!', error);
											  monitor.done();
										  })
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