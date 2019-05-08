import Variable from './../variable.js';

export default class DirectoryPathVariable extends Variable {
	
	constructor(name, value){
		super(name, value);
		this.image='directoryPathVariable.png';
		
		this.__pathMapProvider = undefined;
		this.__directoryPathSelection = undefined;
	}	
	
	createVariableControl(parent, dTreez){

		this.__directoryPathSelection = parent.append('treez-directory-path')
			.label(this.name)
			.nodeAttr('pathMapProvider', this.__pathMapProvider)
			.bindValue(this, ()=>this.value);		
    	
    }
	
	set pathMapProvider(pathMapProvider){
		this.__pathMapProvider = pathMapProvider;
		if(this.__directoryPathSelection){
			this.__directoryPathSelection.nodeAttr('pathMapProvider', pathMapProvider);
		}
	}

}