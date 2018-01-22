import AtomControlAdaption from "./../atom/atomControlAdaption.js";

export default class EmptyControlAdaption extends AtomControlAdaption {

	constructor(parent, atom, labelText) {
		super(parent, atom);

		parent.children.forEach(child=>{
			child.dispose();
		});

		parent.append("label")
			.attr("text",labelText);
	}
	
}
