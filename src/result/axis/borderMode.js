import Enum from './../../components/enum.js';

export default class BorderMode extends Enum {
	
	constructor(name, label, factor){
		super(name);
		this.label = label;
		this.factor = factor;
	}
}

if(window.BorderMode){
	BorderMode = window.BorderMode;
} else {
	BorderMode.none =       new BorderMode('none', '0', 0.0);
	BorderMode.two =        new BorderMode('two', '2%', 0.02);
	BorderMode.five =       new BorderMode('five', '5%', 0.05);
	BorderMode.ten =        new BorderMode('ten', '10%', 0.1);
	BorderMode.fiveteen =   new BorderMode('fiveteen', '15%', 0.15);
	BorderMode.twenty =     new BorderMode('twenty', '20%', 0.2);
	BorderMode.twentyFive = new BorderMode('twentyFive', '25%', 0.25);
	
	window.BorderMode = BorderMode;
}
