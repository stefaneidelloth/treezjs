import Enum from './../../components/enum.js';

export default class DomainType extends Enum {}

if(window.DomainType){
	DomainType = window.DomainType;
} else {

	//The one based indice of the samples (1, 2, 3,...) are taken as domin values for the probe
	DomainType.sampleIndex = new DomainType('Sample index');
	
	//The domain values are defined by the time series of the parent picking atom
	//Only works if the picking atom is time dependent
	DomainType.timeSeriesFromPicking = new DomainType('Time series from picking');
	
	//The user references some (custom) column to define the domain values for the probe
	DomainType.timeSeriesFromColumn = new DomainType('Time series from column');
	
	window.DomainType = DomainType;
}

