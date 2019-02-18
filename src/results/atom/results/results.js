import ComponentAtom from '../../../core/component/componentAtom.js';
import AddChildAtomTreeViewerAction from '../../../core/treeview/addChildAtomTreeViewerAction.js';
import Data from '../data/data.js';
import Page from '../page/page.js'

/**
 * Represents the root atom for all results, like plots, reports ect.
 */
export default class Results extends ComponentAtom {

    static get LOG() {
        return new Log4js.getLogger(Executable.constructor.name);
    }

	constructor(name) {
		super(name);
		this.image = 'results.png';
		this.isRunnable=true;		
	}

	//#end region

	//#region METHODS
	
	createComponentControl(tabFolder, dTreez){    
	     
		const page = tabFolder.append('treez-tab'); 
		this.__createResultsSection(page); 
	}
	
	__createResultsSection(page){
		
		const section = tab.append('treez-section')
        	.title('Results');
		
		section.append('treez-text-label')
			.attr('value','This atom represents results.');
	}	

	extendContextMenuActions(actions, treeViewer) {

		const addData = new AddChildAtomTreeViewerAction(
				Data.class,
				"data",
				"data.png",
				this,
				treeViewer);
		actions.add(addData);

		const addPage = new AddChildAtomTreeViewerAction(
				Page.class,
				"page",
				"page.png",
				this,
				treeViewer);
		actions.add(addPage);

		return actions;
	}

	execute(treeViewerRefreshable) {
		this.treeViewRefreshable = treeViewerRefreshable;
		this.executeChildren(Data.class, treeViewRefreshable);
		this.executeChildren(Page.class, treeViewRefreshable);
	}

	//#region CREATE CHILD ATOMS

	createData(name) {
		const child = new Data(name);
		this.addChild(child);
		return child;
	}

	createPage(name) {
		const child = new Page(name);
		this.addChild(child);
		return child;
	}

	//#end region

	//#end region

}
