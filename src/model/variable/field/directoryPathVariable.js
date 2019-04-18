import Variable from './../variable.js';

export default class DirectoryPathVariable extends Variable {
	
	constructor(name, value){
		super(name, value);
		this.image='directoryVariable.png';
	}
	
	
	createVariableControl(parent, dTreez){

		var textField = parent.append('treez-directory-path')
			.label(this.name)
			.bindValue(this, ()=>this.value);		
    	
    }

}