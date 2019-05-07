import VariableRange from './variableRange.js';
import FilePathVariable from './../../model/variable/field/filePathVariable.js';

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
	    	.bindValue(this, ()=>this.directoryList);	 
	    
	   				
    }	

}
