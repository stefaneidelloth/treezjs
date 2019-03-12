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
		this.value=undefined		
		this.__isEnabled=true;
	}
	
	copy() {
		// TODO
	}

    createComponentControl(tabFolder){    
     
		const page = tabFolder.append('treez-tab')
            .label('Data');

		const section = page.append('treez-section')
        	.label('Properties');   

	    const sectionContent = section.append('div'); 
	
	    sectionContent.append('treez-text-field')
	        .label('Name') 
	        .onChange(()=>this.__treeView.refresh())
	        .bindValue(this,()=>this.name);   
	}
    
    createVariableControl(parent, dTreez){
    	throw new Error('Must be overridden by inheriting variable class.')
    }

}