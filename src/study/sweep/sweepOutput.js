import OutputAtom from './../../core/output/outputAtom.js';

export default class SweepOutput extends OutputAtom {

	constructor(name) {
		super(name,'sweep.png');		
	}	

	createOutputAtom(name) {
		return this.createChild(OutputAtom, name, 'sweep.png');		
	}

}
