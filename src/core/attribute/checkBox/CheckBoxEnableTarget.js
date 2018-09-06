
export default class CheckBoxEnableTarget extends Atom {

	 constructor(name, enableValue, targetPath) {
		super(name);
		this.value=enableValue;
		this.targetPath=targetPath;
	}

	copy() {
		var newAtom = new CheckBoxEnableTarget(this.name);
		newAtom.value= this.value;
		newAtom.targetPath = this.targetPath;
		return newAtom;
	}

	provideImageName() {
		return "switch.png";
	}

	
}
