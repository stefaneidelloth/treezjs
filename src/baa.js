import Qux from './qux.js';

export default class Baa {
	constructor(){
		var qux = new Qux();
		this.qvalue = qux.value;
	}
    value(){
        return 3;
    }
}