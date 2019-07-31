import ComponentAtom from './../../core/component/componentAtom.js';
import Table from './../../data/table/table.js';

export default class PythonExport extends ComponentAtom { 	

	constructor(name) {		
		super(name);
		this.image = 'pythonExport.png';
		this.isRunnable=true;	

		this.structureName = 'results';	
		this.__outcomeNames = {};
        
	}	

    createComponentControl(tabFolder){    
     
		const page = tabFolder.append('treez-tab')
            .label('Data');
		
		const section = page.append('treez-section')
        	.label('Python export');
        	  
        this.createHelpAction(section, 'study/pythonExport/pythonExport.md');
        
		const sectionContent = section.append('div');     

		sectionContent.append('treez-text-field')
	        .label('Name of python structure') 
	        .bindValue(this,()=>this.structureName); 		
			
	}	
    
    extendContextMenuActions(actions, parentSelection, treeView) {
		return actions;
	}
    
    async deleteStructureFromPythonContextIfExists(){
    	if(window.treezTerminal.executePythonCode){
	    	var pythonCode = 'if "' + this.structureName + '" in locals():\n'
	    	               + '    del ' + this.structureName + '\n';
	    	await window.treezTerminal.executePythonCode(pythonCode, false);
    	} else {
    		console.warn('Deletion of python structure "' + this.structureName + '" has been skipped because python is not supported.');
    	}    	
    }
    
    async exportTablesToPythonContext(modelInput, outputAtom) {
		if(outputAtom instanceof Table){
			await this.__exportTableToPythonContext(modelInput, outputAtom);
		}
		
		for(var child of outputAtom.children){
			await this.exportTablesToPythonContext(modelInput, child);
		}
			
	}    
    
    async __exportTableToPythonContext(modelInput, table){
    	if(window.treezTerminal.executePythonCode){
    		
    		var studyVariables = modelInput.all;			
    		
    		var name = table.name;			
    					            
    	    var experimentEntries = [];
    		for(var variable of studyVariables){
    			experimentEntries.push("'" + variable + "': [" + modelInput.get(variable) + "]");
    		}		
    		experimentEntries.push("'scenario': [" + modelInput.jobId + "]");
    		experimentEntries.push("'policy': [None]");
    		experimentEntries.push("'model': ['treez']");
    		
    		var pythonCode = "import pandas\n"
    			           + "import numpy\n"
    			           + "NaN = numpy.NaN\n"
                		   + "newRow = pandas.DataFrame({" + experimentEntries.join(",") + "})\n"
                		   + "if '" + this.structureName +"' in locals():\n"
    			           + "    experiments, outcomes = " + this.structureName + "\n"
    			           + "    experiments = experiments.append(newRow)\n"
    			           + "    " + this.structureName + " = (experiments, outcomes)\n"
    			           + "else:\n"
    			           + "    experiments = newRow\n"
    		               + "    outcomes = dict()\n"
    		               + "    " + this.structureName + " = (experiments, outcomes)\n";
    		
    		var key = 'job' + modelInput.jobId;
    		if(!this.__outcomeNames[key]){
    			this.__outcomeNames[key] = [];
    		}
    		
    		for(var outcomeName of table.headers){
    			
    			if(outcomeName in this.__outcomeNames[key]){
    				console.warn('The outcome column "' + outcomeName + '" already has been written. The data is overridden and the old data is lost.');
    			} else {
    				this.__outcomeNames[key].push(outcomeName);
    			}
    			
    			var columnValues = table.getColumnValues(outcomeName);
    						
    			var outcomeReference = "outcomes['" + outcomeName + "']"
    			pythonCode += (  "if not '" + outcomeName + "' in outcomes:\n"
    			               + "    " + outcomeReference + " = numpy.full((" + modelInput.totalNumberOfJobs + "," + columnValues.length + "), numpy.nan)\n"
    			              );
    			
    			var isStringColumn = table.columnType(outcomeName) === ColumnType.string;
    			if(isStringColumn){
    				pythonCode += outcomeReference + "[" + (modelInput.jobId-1) + "] = ['" + columnValues.join("', '") +"']\n"
    			} else {
    				pythonCode += outcomeReference + "[" + (modelInput.jobId-1) + "] = [" + columnValues.join(", ") +"]\n"
    			}
    			              
    		}
    		
    		await window.treezTerminal.executePythonCode(pythonCode, false);
    		
    		
    	} else {
    		console.warn('Export of table "' + table.name + '" to python context has been skipped because python is not supported.');
    	}
    }

}
