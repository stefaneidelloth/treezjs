import Enum from './../enum.js';

export default class Color extends Enum {
	
	constructor(name, hexString){
		super(name);
		this.hexString = hexString;
	}
	
	toString(){
		if(this.name !== 'custom'){
			return this.name;
		} else {
			return this.hexString;
		}		
	}
	
}

Color.forHexString = function(colorHexString){
	for(var color of this.values){
		if(color.hexString === colorHexString){
			return color;
		}
	}
	throw new Error('Unknown color hex string "' + colorHexString + '"');
};

if(window.Color){
	Color = window.Color;
} else {
	Color.black = new Color('black','#000000');   
	Color.blue = new Color('blue','#0000ff'); 
	Color.cyan = new Color('cyan','#00ffff')
	Color.darkblue = new Color('darkblue','#00008b')
	Color.darkcyan = new Color('darkcyan','#008b8b'); 
	Color.darkgreen = new Color('darkgreen','#006400'); 
	Color.darkmagenta = new Color('darkmagenta','#8b008b'); 
	Color.darkred = new Color('darkred','#8b0000'); 
	Color.green = new Color('green','#008000'); 
	Color.grey = new Color('grey','#808080'); 
	Color.magenta = new Color('magenta','#ff00ff'); 
	Color.red = new Color('red','#ff0000'); 
	Color.white = new Color('white','#ffffff');
	Color.yellow = new Color('yellow','#ffff00');
	
	window.Color = Color;
}



