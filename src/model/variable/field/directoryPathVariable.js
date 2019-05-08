import AbstractPathVariable from './abstractPathVariable.js';

export default class DirectoryPathVariable extends AbstractPathVariable {
	
	constructor(name, value){
		super(name, value);
		this.image='directoryPathVariable.png';		
	}	
	
	createVariableControl(parent, dTreez){

		this.__pathSelection = parent.append('treez-directory-path')
			.label(this.name)			
			.bindValue(this, ()=>this.value);

		if(this.__pathMapProvider){
			this.__pathSelection.nodeAttr('pathMapProvider', this.__pathMapProvider)
		}
    }	

}