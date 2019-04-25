import Enum from './../../components/enum.js';

export default class SortingMode extends Enum{}

if(window.SortingMode){
	SortingMode = window.SortingMode;
} else {
	SortingMode.largestDifference = new SortingMode('largestDifference');
	SortingMode.smallestDifference = new SortingMode('smallestDifference');
	SortingMode.label = new SortingMode('label');
	SortingMode.unsorted = new SortingMode('unsorted');
	
	window.SortingMode = SortingMode;
}