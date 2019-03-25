export default class VerticalPosition extends Enum{
	
	get isTop(){
		return this === VerticalPosition.top;
	}
	
	get isCentre(){
		return this === VerticalPosition.centre;
	}
	
	get isBottom(){
		return this === VerticalPosition.bottom;
	}
	
	get isManual(){
		return this === VerticalPosition.manual;
	}
}

VerticalPosition.top = new VerticalPosition('top');
VerticalPosition.centre = new VerticalPosition('centre');
VerticalPosition.bottom = new VerticalPosition('bottom');
VerticalPosition.manual = new VerticalPosition('manual');