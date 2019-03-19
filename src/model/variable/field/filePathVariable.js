import Variable from './../variable.js';

export default class FilePathVariable extends Variable {
	
	constructor(name){
		super(name);
		this.image='filePathVariable.png';
	}
	
	
	createVariableControl(parent, dTreez){

		var textField = parent.append('treez-file-path')
			.label(this.name)
			.bindValue(this, ()=>this.value);		
    	
    }

}