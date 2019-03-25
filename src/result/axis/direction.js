
export default class Direction extends Enum {
	
	get isVertical(){
		return this === Direction.vertical;
	}
	
	get isHorizontal(){
		return this === Direction.horizontal;
	}
}

Direction.vertical = new Direction('vertical');
Direction.horizontal = new Direction('horizontal');