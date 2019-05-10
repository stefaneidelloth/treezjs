import VariableRange from './variableRange.js';
import FilePathVariable from './../field/filePathVariable.js';

export default class FilePathRange extends VariableRange {

	constructor(name, values) {
		super(name, values);
		this.image = 'filePathRange.png';
		this.directoryList = [];
	}

	createComponentControl(tabFolder){    
	     
		const page = tabFolder.append('treez-tab')
            .label('Data');		

		const section = page.append('treez-section')
        	.label('Data');   

	    const sectionContent = section.append('div'); 
	    
	    sectionContent.append('treez-model-path')
	    	.label('Variable path')
        	.nodeAttr('atomClasses', [FilePathVariable])
        	.bindValue(this, ()=>this.variablePath);	   
	    
	    sectionContent.append('treez-file-path-list')
	    	.label('Range')
	    	.nodeAttr('pathMapProvider', this)
	    	.bindValue(this, ()=>this.directoryList);	 
    }	
	
	createVariableControl(sectionContent, dTreez){
	    sectionContent.append('treez-file-path-list')
	    	.label(this.name)
	    	.nodeAttr('pathMapProvider', this)
	    	.bindValue(this, ()=>this.directoryList);	    	
    }

}
