import ComponentAtom from './../component/componentAtom.js';
import Table from './../../data/table/table.js';

export default class OutputAtom extends ComponentAtom {
	
	constructor(name, image) {
		super(name);
		this.overlayImage='output.png';			
		this.image=image;		
	}

	createOutputAtom(name) {
		return this.createChild(OutputAtom, name, this.image);		
	}
	
	createTable(name){
		return this.createChild(Table, name);
	}
	
}
