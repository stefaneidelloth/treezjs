import Enum from './../../components/enum.js';

export default class PositionReference extends Enum{}

if(window.PositionReference){
	PositionReference = window.PositionReference;
} else {
	PositionReference.graph = new PositionReference('graph');
	PositionReference.page = new PositionReference('page');
	
	window.PositionReference = PositionReference;
}