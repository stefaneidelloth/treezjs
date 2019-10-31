import OutputAtom from './../../core/output/outputAtom.js';

export default class ProbabilityOutput extends OutputAtom {

	constructor(name) {
		super(name,'probability.png');
	}	

	createOutputAtom(name) {
		return this.createChild(OutputAtom, name, 'probability.png');
	}

}
