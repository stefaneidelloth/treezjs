import CodeModel from './codeModel.js';
import AddChildAtomTreeViewAction from './../../core/treeView/addChildAtomTreeViewAction.js';
import TableTargetType from './../../data/table/tableTargetType.js';
import Table from './../../data/table/table.js';

export default class PythonModel extends CodeModel {  	

	constructor(name) {		
		super(name);
		this.image = 'python.png';		
        
        this.code = "print('Hello World!')";
        
        this.__outputSelection = undefined;        
	}	

	get mode(){
		return 'python';
	}

    createComponentControl(tabFolder){    
     
		const page = tabFolder.append('treez-tab')
            .label('Data');

		this.createCodeSection(page);		
		this.createSourceModelSection(page);
        this.createStatusSection(page);
        this.__createOutputSection(page);
	}

	extendContextMenuActions(actions, parentSelection, treeView) {
		return actions;
	}	
    
    async executeCode(code, monitor){
    	
    	if(window.treezTerminal.executePythonCodeWithCell){

    		if(this.__outputSelection){
    			this.__outputSelection.selectAll('div').remove();
    		    this.__outputSelection.html('');
    		}  		
    		
    		
    		var htmlArray = [];
    		try {
    		    htmlArray= await window.treezTerminal.executePythonCodeWithCell(code, false);
    		} catch(error){
    			console.error('Could not execute python code.', error);
    		}

    		if(this.__outputSelection){

				for(var htmlOutput of htmlArray){
					this.__outputSelection.append('div')
						.html(htmlOutput);
				}
    		}

    		var resultString = await window.treezTerminal.executePythonCode('print(result)')
    		    .catch(error=>{
				   	//result is optional
				});
    		if(resultString){
    			var table = Table.createFromJson(resultString);
    			return table;
    		} else {
    			return null;
    		}     		
    		
    	} else {
    		console.warn('Executing python code is not supported.');
    	}
    }     
    
    __createOutputSection(page){    	

    	const section = page.append('treez-section')
            .label('Output'); 

        this.createHelpAction(section, 'model/code/pythonModel.md#output');

        this.__outputSelection = section.append('div');   
    }
   
}
