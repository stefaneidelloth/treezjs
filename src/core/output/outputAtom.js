import ComponentAtom from './../component/componentAtom.js';


export default class OutputAtom extends ComponentAtom {
	
	constructor(name, image) {
		super(name);
		this.overlayImage='output.png';		
		this.image=image;		
	}
	
}
