import AtomCodeAdaption from './../../core/code/atomCodeAdaption.js';
import CodeContainer from './../../core/code/codeContainer.js';

export default class PathCodeAdaption extends AtomCodeAdaption {

	constructor(atom) {
		super(atom);
	}

    buildCodeContainerForAttributes() {
		return new CodeContainer();
	}    

}
