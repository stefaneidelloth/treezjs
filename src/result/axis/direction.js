import Enum from './../../components/enum.js';

export default class Direction extends Enum {
	
	get isVertical(){
		return this === Direction.vertical;
	}
	
	get isHorizontal(){
		return this === Direction.horizontal;
	}
}

if(window.Direction){
	Direction = window.Direction;
} else {
	Direction.vertical = new Direction('vertical');
	Direction.horizontal = new Direction('horizontal');
	
	window.Direction = Direction;
}