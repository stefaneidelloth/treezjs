import Enum from './../../components/enum.js';

export default class PositionReference extends Enum{


	get isPage(){
		return this.name === PositionReference.page.name;
	}
}

if(window.PositionReference){
	PositionReference = window.PositionReference;
} else {
	PositionReference.graph = new PositionReference('graph');
	PositionReference.page = new PositionReference('page');
	
	window.PositionReference = PositionReference;
}