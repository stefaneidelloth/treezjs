export default class NameAndNumber {	

	constructor(name, number) {
		this.name = name;
		this.number = number;
	}

	copy(nameAndNumberToCopy) {
	    var newNameAndNumber = new NameAndNumber();
		newNameAndNumber.name = nameAndNumberToCopy.name;
		newNameAndNumber.number = nameAndNumberToCopy.number;
		return newNameAndNumber;
	}	

	increaseNumber() {
		this.number += 1;
	}

	getFullName() {
		return this.name + this.number;
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
		
		if (name == null) {
			if (other.name != null) {
				return false;
			}
		} else if (!name.equals(other.name)) {
			return false;
		}

		if (number != other.number) {
			return false;
		}
		return true;
	}	

}
