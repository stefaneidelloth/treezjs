import OutputAtom from './../../core/output/outputAtom.js';

export default class PickingOutput extends OutputAtom {

	constructor(name) {
		super(name,'picking.png');		
	}	

	createOutputAtom(name) {
		return this.createChild(OutputAtom, name, 'picking.png');		
	}

}
