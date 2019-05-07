import Variable from './../variable.js';

export default class StringItemVariable extends Variable {
	
	constructor(name, value){
		super(name, value);
		this.image = 'stringItemVariable.png';
		this.optionsExpression = '["foo", "baa"]';
		this.value = 'foo';
		this.__comboBox = undefined;
	}	
	
	createComponentControl(tabFolder){    
	     
		const page = tabFolder.append('treez-tab')
            .label('Data');

		const section = page.append('treez-section')
        	.label('Properties');   

	    const sectionContent = section.append('div'); 
	
	    sectionContent.append('treez-text-field')
	        .label('Name') 
	        .onChange(()=>this.__treeView.refresh(this))
	        .bindValue(this,()=>this.name);  
	    
	    sectionContent.append('treez-text-field')
	        .label('Options') 
	        .onChange(()=>this.__optionsChanged())
	        .bindValue(this,()=>this.optionsExpression);  
	}
	
	createVariableControl(parent, dTreez){
		this.__comboBox = parent.append('treez-combo-box')
			.label(this.name)
			.nodeAttr('options', this.options)
			.bindValue(this, ()=>this.value);
    }

    __optionsChanged(){
    	var oldValue = this.value;

        var options = this.options;

        if(this.__comboBox){
        	this.__comboBox.nodeAttr('options', options);
        }
        
        if(!(oldValue in options)){
        	if(options.length > 0){
        		this.value = options[0];
        	} else {
        		this.value = null;
        	}        	
        }
    	
    }
	
	get options(){
		try {
			return eval(this.optionsExpression);
		} catch(error){
			console.error('Could not evaluate options expression "' + this.optionsExpression + '".')
			return [];
		}
	}

}