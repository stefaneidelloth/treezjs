import ComponentAtom from './../core/component/componentAtom.js';
import Monitor from './../core/monitor/monitor.js';
import AddChildAtomTreeViewAction from './../core/treeView/addChildAtomTreeViewAction.js';
import RegionsAtomCodeAdaption from './../core/code/regionsAtomCodeAdaption.js';
import Data from './data/data.js';
import Page from './page/page.js';
import PythonModel from './../model/code/pythonModel.js';


export default class Results extends ComponentAtom {
   
	constructor(name) {		
		super(name);
		this.image = 'results.png';
		this.isRunnable=true;		
	}
	
	createComponentControl(tabFolder){    
	     
		const page = tabFolder.append('treez-tab')
			.label('Data'); 
		
		const section = page.append('treez-section')
    		.label('Results');	

    	this.createHelpAction(section, 'result/results.md');

    	section.append('treez-section-action')
            .image('run.png')
            .label('Run results')
            .addAction(()=>this.execute(this.__treeView)
            				   .catch(error => {
            					   	console.error('Could not execute  ' + this.constructor.name + ' "' + this.name + '"!', error);            					   
            				   })
            );
    	
    	const sectionContent = section.append('div');
	
    	sectionContent.append('treez-text-label')
			.value('This atom represents results.');		
	}	
	
	extendContextMenuActions(actions, parentSelection, treeView) {	

		actions.push(
			new AddChildAtomTreeViewAction(
				Data,
				'data',
				'data.png',
				parentSelection,
				this,
				treeView
			)
		);		

		actions.push(
			new AddChildAtomTreeViewAction(
				Page,
				'page',
				'page.png',
				parentSelection,
				this,
				treeView
			)
		);	
		
		actions.push(
			new AddChildAtomTreeViewAction(
				PythonModel,
				"pythonModel",
				"python.png",
				parentSelection,
				this,
				treeView
			)
		);

		return actions;
	}

	createCodeAdaption(){
		return new RegionsAtomCodeAdaption(this);
	}
		
	createData(name) {
		return this.createChild(Data, name);		
	}

	createPage(name) {
		return this.createChild(Page, name);		
	}	
	
	createPythonModel(name) {
		return this.createChild(PythonModel, name);
	}

}
