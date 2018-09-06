import Atom from '../atom/atom.js';
import VueAtomCodeAdaption from './vueAtomCodeAdaption.js';
import ActionSeparator from '../actionSeparator.js';
import TreeViewerAction from '../treeview/treeViewerAction.js';

export default class VueAtom extends Atom {

	constructor(name) {
		super(name);		
		this.isRunnable = false;
        VueAtom.initializeComponentsIfRequired()
	}

	static initializeComponentsIfRequired(){
	    if(!VueAtom.componentsAreInitialized){
	        VueAtom.initializeComponents();
        }
        VueAtom.componentsAreInitialized = true;
    }

    static initializeComponents(){
	    const head = $('head');
        head.append('<link rel="import" id="treez-tab-folder" href="./src/components/tabs/treez-tab-folder.html"/>');
        head.append('<link rel="import" id="treez-text-area" href="./src/components/text/treez-text-area.html"/>');
        head.append('<link rel="import" id="treez-section" href="./src/components/section/treez-section.html"/>');
        head.append('<link rel="import" id="treez-file-path" href="./src/components/file/treez-file-path.html"/>');
        head.append('<link rel="import" id="treez-file-or-directory-path" href="./src/components/file/treez-file-or-directory-path.html"/>');

		Vue.directive('value-binding', { 
		  bind: function (el, binding, vnode) {
			var viewModel = vnode.context;
			var propertyName = binding.expression;
			
            el.value = viewModel[propertyName];

			el.addEventListener('input', (event)=>{ 
			  var oldValue = viewModel[propertyName];
			  var newValue = event.target.value;
			  if(newValue != oldValue){
				viewModel[propertyName] = newValue;        
			  }    	
			});    

			viewModel.$watch(propertyName, ()=>{
				var oldValue = el.value;
			  var newValue = viewModel[propertyName];
			  if(newValue != oldValue){
				el.value = newValue;        
			  } 
			});

		  }
		});
      
    }

	copy(atomToCopy){
	    const newAtom = new VueAtom(atomToCopy.name);
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
		const template = parent.append('template');

		const tabFolderElement = document.createElement('treez-tab-folder');
		const tabFolder = d3.select(tabFolderElement);
		self.createVueControl(tabFolder, d3);				
		template.node().content.appendChild(tabFolderElement);	
				
		self.viewModel = new Vue({
			el: element.node(),
			template: template.node(),           
			data: this,
			mounted(){										
				self.afterCreateControlAdaptionHook();										
			}
		}); 		
	}	

	/*
	 * Should be overridden by inheriting classes
	 */
	createVueControl(tabFolder, d3){
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
		return new VueAtomCodeAdaption(this);
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