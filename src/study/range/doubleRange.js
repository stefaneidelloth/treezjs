import Range from './range.js';
import DoubleVariable from './../../model/variable/field/doubleVariable.js';

export default class DoubleRange extends Range {

	constructor(name) {
		super(name);
		this.image = 'doubleRange.png';		
	}

	createComponentControl(tabFolder, treeView){    
	     
		const page = tabFolder.append('treez-tab')
            .label('Data');		

		const section = page.append('treez-section')
        	.label('Data');   

	    const sectionContent = section.append('div'); 
	    
	    sectionContent.append('treez-model-path')
	    	.label('Variable path')
        	.nodeAttr('atomClasses', [DoubleVariable])
        	.bindValue(this, ()=>this.variablePath);

	    //TODO apply source model path as origin and use
	    //relative model paths
	    
	    sectionContent.append('treez-text-field')
	    	.label('Range')
	    	.bindValue(this, ()=>this.rangeString);	 
	    
	    sectionContent.append('treez-check-box')
	    	.label('Enable')
	    	.bindValue(this, ()=>this.isEnabled);
				
    }	

	

}
