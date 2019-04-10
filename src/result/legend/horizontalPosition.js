import Enum from './../../components/enum.js';

export default class HorizontalPosition extends Enum{
	
	get isLeft(){
		return this === HorizontalPosition.left;
	}
	
	get isCentre(){
		return this === HorizontalPosition.centre;
	}
	
	get isRight(){
		return this === HorizontalPosition.right;
	}
	
	get isManual(){
		return this === HorizontalPosition.manual;
	}
}

HorizontalPosition.left = new HorizontalPosition('left');
HorizontalPosition.centre = new HorizontalPosition('centre');
HorizontalPosition.right = new HorizontalPosition('right');
HorizontalPosition.manual = new HorizontalPosition('manual');