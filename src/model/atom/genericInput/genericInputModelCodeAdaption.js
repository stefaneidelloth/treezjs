import AdjustableAtomCodeAdaption from "../../../core/adjustable/adjustableAtomCodeAdaption";


export default class GenericInputModelCodeAdaption extends AdjustableAtomCodeAdaption {


	constructor(atom) {
		super(atom);
	}



	/**
	 * Builds the code for setting attribute values of the atom. Might be overridden by inheriting classes.
	 */

	 buildCodeContainerForAttributes() {
		return new CodeContainer();
	}

	//#end region

}
