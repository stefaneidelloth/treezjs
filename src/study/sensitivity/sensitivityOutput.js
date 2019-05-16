import OutputAtom from './../../core/output/outputAtom.js';

export default class SensitivityOutput extends OutputAtom {

	constructor(name) {
		super(name,'sensitivity.png');		
	}	

	createOutputAtom(name) {
		return this.createChild(SensitivityOutput, name);		
	}

}
