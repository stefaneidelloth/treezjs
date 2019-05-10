import AbstractPathVariable from './abstractPathVariable.js';
import FilePathRange from './../range/filePathRange.js';

export default class FilePathVariable extends AbstractPathVariable {
	
	constructor(name, value){
		super(name, value);
		this.image='filePathVariable.png';		
	}
	
	createVariableControl(parent, dTreez){
		this.__pathSelection = parent.append('treez-file-path')
			.label(this.name)			
			.bindValue(this, ()=>this.value);

		if(this.__pathMapProvider){
			this.__pathSelection.nodeAttr('pathMapProvider', this.__pathMapProvider)
		}
    }
	
	createRange(name){
    	return new FilePathRange(name);
    }

}