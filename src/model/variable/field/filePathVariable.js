import Variable from './../variable.js';

export default class FilePathVariable extends Variable {
	
	constructor(name, value){
		super(name, value);
		this.image='filePathVariable.png';
		
		this.__pathMapProvider = undefined;
		this.__filePathSelection = undefined;
	}
	
	
	createVariableControl(parent, dTreez){

		this.__filePathSelection = parent.append('treez-file-path')
			.label(this.name)
			.nodeAttr('pathMapProvider', this.__pathMapProvider)
			.bindValue(this, ()=>this.value);		
    	
    }
	
	set pathMapProvider(pathMapProvider){
		this.__pathMapProvider = pathMapProvider;
		if(this.__filePathSelection){
			this.__filePathSelection.nodeAttr('pathMapProvider', pathMapProvider);
		}
	}
	
	

}