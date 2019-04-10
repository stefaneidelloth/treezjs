import Atom from './../atom/atom.js';
import ComponentAtomCodeAdaption from './componentAtomCodeAdaption.js';
import ActionSeparator from './../actionSeparator.js';
import TreeViewAction from './../treeview/TreeViewAction.js';
import Monitor from './../monitor/monitor.js';
import Treez from './../../treez.js';

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
    	
    	Treez.importHtml('/src/components/checkBox/treez-check-box.html');
    	
    	Treez.importHtml('/src/components/color/treez-color.html');
    	Treez.importHtml('/src/components/color/color.html');
		
    	Treez.importHtml('/src/components/colorMap/treez-color-map.html');
    	Treez.importHtml('/src/components/colorMap/color-map.html');
		
    	Treez.importHtml('/src/components/comboBox/treez-combo-box.html');
    	Treez.importHtml('/src/components/comboBox/treez-enum-combo-box.html');
		
    	Treez.importHtml('/src/components/errorBarStyle/treez-error-bar-style.html');
    	Treez.importHtml('/src/components/errorBarStyle/error-bar-style.html');

    	Treez.importHtml('/src/components/file/treez-file-or-directory-path.html');
    	Treez.importHtml('/src/components/file/treez-file-path.html');
	    
    	Treez.importHtml('/src/components/fillStyle/treez-fill-style.html');
    	Treez.importHtml('/src/components/fillStyle/fill-style.html');
	    
    	Treez.importHtml('/src/components/font/treez-font.html');
	    
    	Treez.importHtml('/src/components/imageComboBox/treez-image-combo-box.html');	
		
    	Treez.importHtml('/src/components/lineStyle/treez-line-style.html');
    	Treez.importHtml('/src/components/lineStyle/line-style.html');
		
    	Treez.importHtml('/src/components/modelPath/treez-model-path.html');
       
    	Treez.importHtml('/src/components/section/treez-section.html');
    	Treez.importHtml('/src/components/size/treez-size.html');  
    	Treez.importHtml('/src/components/list/treez-string-list.html');
        
    	Treez.importHtml('/src/components/symbolStyle/treez-symbol-style.html');
    	Treez.importHtml('/src/components/symbolStyle/symbol-style.html');;
      
    	Treez.importHtml('/src/components/tabs/treez-tab-folder.html');
    	Treez.importHtml('/src/components/text/area/treez-text-area.html');
    	Treez.importHtml('/src/components/text/field/treez-text-field.html');
    	Treez.importHtml('/src/components/text/label/treez-text-label.html');
      
    }
	
    createControlAdaption(parent, treeView) {

		const self = this;
		self.__treeView = treeView;
		parent.selectAll('treez-tab-folder').remove();	
		parent.selectAll('div').remove();
		
		const pathInfo = parent.append('div')
			.className('treez-properties-path-info')
			.text(this.treePath);	

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
										  })
							)
			);
		}
		
		actions.push(new ActionSeparator());
		
		actions = this.extendContextMenuActions(actions, parentSelection, treeView);
		
		actions.push(new ActionSeparator());

        const superActions = super.createContextMenuActions(parentSelection, treeView);
        actions = actions.concat(superActions);

		return actions;
	}

	extendContextMenuActions(actions, parentSelection, treeView) {
		return actions;
	}

	async execute(treeView, monitor) {
		this.__treeView = treeView;
		
		var hasMainMonitor = false;		
		if(!monitor){
			var monitorTitle = this.constructor.name + ' "' + this.name + '"';
			monitor = new Monitor(monitorTitle, treeView);
			monitor.showInMonitorView();
			hasMainMonitor = true;
		}

		monitor.totalWork = this.numberOfRunnableChildren;		
		for(const child of this.children){			
			if (child.isRunnable) {
				var subMonitor = monitor.createChild(child.name, treeView, child.name, 1);
				await child.execute(treeView, subMonitor);				
			}
		}

		if(hasMainMonitor){
			monitor.done();	
		}		
		
	}

}