import CodeModel from './codeModel.js';
import AddChildAtomTreeViewAction from './../../core/treeView/addChildAtomTreeViewAction.js';
import TableTargetType from './../../data/table/tableTargetType.js';

export default class StarBoardModel extends CodeModel {

	//static variable __finishedString is defined below class definition

	constructor(name) {		
		super(name);
		this.image = 'starBoard.png';        
        this.code = "'# %% [javascript]\n'alert('Hello World!')";        
	}	
	
	get mode(){
		return 'javascript';
	}

	createCodeArea(section){
		const sectionContent = section.append('div');  
		sectionContent.append('treez-notebook-area') 
            .bindValue(this,()=>this.code);
	} 

	createStatusSection(page){
		//overriden to remove status section
	}

	extendContextMenuActions(actions, parentSelection, treeView) {
		return actions;
	}	  
    
    async executeCode(code, monitor){    	
    	
    	//store logging methods and redirect them to monitor    	
    	var logFunction = console.log;
    	var infoFunction = console.info;
    	var warnFunction = console.warn;
    	var errorFunction = console.error;
    	
    	console.log = message => monitor.info(message);
    	console.info = message => monitor.info(message);
    	console.warn = message => monitor.warn(message);
    	console.error = message => monitor.error(message);    	
    	
    	try{
    		eval(code);    	
    	} catch(error){
    		monitor.error(error);
    	}
    	
    	//restore logging methods    	
    	console.log = logFunction;
    	console.info = infoFunction;
    	console.warn = warnFunction;
    	console.error = errorFunction;    	
    	
    }    
   
}
