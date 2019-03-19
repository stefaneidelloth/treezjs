import Variable from './../variable.js';

export default class DirectoryPathVariable extends Variable {
	
	constructor(name){
		super(name);
		this.image='directoryVariable.png';
	}
	
	
	createVariableControl(parent, dTreez){

		var textField = parent.append('treez-directory-path')
			.label(this.name)
			.bindValue(this, ()=>this.value);		
    	
    }

}