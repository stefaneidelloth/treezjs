import CodeModel from './codeModel.js';
import AddChildAtomTreeViewAction from './../../core/treeView/addChildAtomTreeViewAction.js';
import TableTargetType from './../../data/table/tableTargetType.js';

export default class JavaScriptModel extends CodeModel {   

	//static variable __finishedString is defined below class definition

	constructor(name) {		
		super(name);
		this.image = 'javaScript.png';		
        
        this.code = "alert('Hello World!')";        
	}	
	
	get mode(){
		return 'javascript';
	}

    createComponentControl(tabFolder){    
     
		const page = tabFolder.append('treez-tab')
            .label('Data');

		this.createCodeSection(page); 
		this.createSourceModelSection(page);
        this.createStatusSection(page);
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
