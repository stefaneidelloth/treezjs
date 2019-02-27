import ComponentAtom from './../../core/component/componentAtom.js';


export default class Variable extends ComponentAtom {
	
	get isEnabled(){
		return this.__isEnabled;
	}
	
	set isEnabled(value){
		this.__isEnabled=value;
	}
	
	constructor(name) {
		super(name);
		this.defaultValue;
		this.__isEnabled;
	}
	
	copy() {
		// TODO
	}

    createComponentControl(tabFolder, dTreez){    
     
		const page = tabFolder.append('treez-tab')
            .title('Data');

		const section = page.append('treez-section')
        	.title('Properties');   

	    const sectionContent = section.append('div'); 
	
	    sectionContent.append('treez-text-field')
	        .title('Name') 
	        .bindValue(this,()=>this.name);   
	}
    
    createVariableControl(parent, dTreez){
    	throw new Error('Must be overridden by inheriting variable class.')
    }

}