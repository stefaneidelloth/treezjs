import VariableRange from './variableRange.js';
import DirectoryPathVariable from './../../model/variable/field/directoryPathVariable.js';

export default class DirectoryPathRange extends VariableRange {

	constructor(name, values) {
		super(name, values);
		this.image = 'directoryPathRange.png';
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
        	.nodeAttr('atomClasses', [DirectoryPathVariable])
        	.bindValue(this, ()=>this.variablePath);
	   
	    sectionContent.append('treez-directory-path-list')
	    	.label('Range')
	    	.nodeAttr('pathMapProvider', this)
	    	.bindValue(this, ()=>this.directoryList);
	    	   
    }	

}
