import Variable from './../variable.js';

export default class FilePathVariable extends Variable {
	
	constructor(name, value){
		super(name, value);
		this.image='filePathVariable.png';
	}
	
	
	createVariableControl(parent, dTreez){

		var textField = parent.append('treez-file-path')
			.label(this.name)
			.bindValue(this, ()=>this.value);		
    	
    }

}