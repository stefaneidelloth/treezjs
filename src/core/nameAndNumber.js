export default class NameAndNumber {	

	constructor(name, number) {
		this.name = name;
		this.number = number;
	}

	copy() {
	    var newNameAndNumber = new NameAndNumber();
		newNameAndNumber.name = this.name;
		newNameAndNumber.number = this.number;
		return newNameAndNumber;
	}	

	increaseNumber() {
		this.number += 1;
	}

	getFullName() {
		if(this.number > 0){
			return this.name + this.number;
		} else {
			return this.name;
		}
	}	
	
	equals(other) {
		if (this === other) {
			return true;
		}
		if (!other) {
			return false;
		}
		if (this.constructor != other.constructor) {
			return false;
		}
		
		if (this.name == null) {
			if (other.name != null) {
				return false;
			}
		} else if (!(this.name === other.name)) {
			return false;
		}

		if (!(this.number === other.number)) {
			return false;
		}
		return true;
	}	

}
