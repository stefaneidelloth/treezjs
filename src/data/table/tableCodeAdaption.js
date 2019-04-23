import AtomCodeAdaption from './../../core/code/atomCodeAdaption.js';

export default class TableCodeAdaption extends AtomCodeAdaption {

	constructor(atom) {
		super(atom);
	}

	postProcessAllChildrenCodeContainer(allChildrenCodeContainer) {
		var extendedContainer = allChildrenCodeContainer;

		for (var row of this.__atom.rows) {
			var rowLine = this.indent + this.__parentVariableNamePlaceholder + '.createRow(' + row + ');';
			extendedContainer.extendBulk(rowLine);
		}
		
		super.postProcessAllChildrenCodeContainer(extendedContainer);

		return extendedContainer;

	}

}
