import Enum from './../enum.js';

export default class Color extends Enum {
	
	constructor(name, hexString){
		super(name);
		this.hexString = hexString;
	}
	
	static custom(colorHexString) {
		return Color.forHexString(colorHexString);
	}
	
	static forHexString(colorHexString) {
		for(let color of this.values){
			if(color.hexString === colorHexString){
				return Color;
			}
		}

		if(colorHexString){
			if(colorHexString[0] === '#' && colorHexString.length === 7){
				return new Color('custom', colorHexString);
			} else {
				throw new Error('Invalid color hex string: ' + colorHexString);
			}
		} else {
			return Color.black;
		}
	};
	
	toString(){
		if(this.name !== 'custom'){
			return this.name;
		} else {
			return "custom('" + this.hexString + "')";
		}		
	}
	
	static get baseValues(){
			
		return [	//source: https://de.wikipedia.org/wiki/Hilfe:Farbtabelle		
			Color.black,
			Color.blue,
			Color.cyan,
			Color.lime,
            Color.magenta,
			Color.red,
			Color.white,
			Color.yellow
		];
	}
	
	static get simpleValues(){
			
		return [  
			//sources: 
			//https://simple.wikipedia.org/wiki/List_of_colors
		    //https://www.w3schools.com/cssref/css_colors.asp
		    //
		    //the disabled colors are not known by css3
		
            //Color.amaranth,
			//Color.amber,
			//Color.amethyst,
			//Color.apricot,			
			Color.aqua,
			Color.aquamarine,
			Color.azure,
			
			//Color.babyBlue,
			Color.beige,
			Color.bisque,
			Color.black, 
			Color.blue, 
			//Color.brickRed,	
			//Color.blueGreen,
			Color.blueViolet,
			//Color.blush,
			//Color.bronze,
			Color.brown,
			//Color.burgundy,
			//Color.byzantium,
			
			//Color.carmine,
			//Color.cerise,
			//Color.cerulean,
			//Color.champagne,
			//Color.chartreuseGreen,
			Color.chocolate,
			//Color.cobaltBlue,
			//Color.coffee,
			//Color.copper,
			Color.coral,
			Color.cornsilk,
			Color.crimson,
			Color.cyan, 			
			
			//Color.desertSand,
			Color.dodgerBlue,
			
			//Color.electricBlue,
			//Color.emerald,
			//Color.erin,
			
			Color.fireBrick,
			Color.forestGreen,
			Color.fuchsia,
			
			Color.gold,			
			Color.gray, 
			Color.grey,
			Color.green,

			//Color.harlequin,
             
            Color.indianRed,
			Color.indigo,
			Color.ivory,
			
			//Color.jade,
			//Color.jungleGreen,

			Color.khaki,
			
			Color.lavender,
			//Color.lemon,
			//Color.lilac,
			Color.lime,
            Color.linen,		
			
			Color.magenta,
            Color.maroon,
            //Color.mauve,
            Color.moccasin,				
			
			Color.navy, 
			
			//Color.ochre,
			Color.olive, 
			Color.orange,
			Color.orangeRed,
			Color.orchid,

			//Color.peach,
			//Color.pear,
			//Color.periwinkle,
			//Color.persianBlue,	
			Color.peru,
			Color.pink,
			Color.plum,
			//Color.prussianBlue,
			//Color.puce,
			Color.purple, 
			
			//Color.raspberry,
			Color.red, 
			//Color.redViolet,
			//Color.rose,
			//Color.ruby,
			
			Color.salmon,
			//Color.sangria,
			//Color.sapphire,
			//Color.scarlet,
			Color.sienna,
			Color.silver,
			Color.slateGray,
            Color.snow,
			//Color.springBud,
			Color.springGreen,
			
            Color.tan,	
			//Color.taupe,
			Color.teal,
            Color.thistle,
            Color.tomato,
            Color.turquoise,

			//Color.ultramarine,

			//Color.viridian,		
            Color.violet,
			
            Color.wheat,			
			Color.white, 
			
			Color.yellow,			
		];
	}	
	
}



if(window.Color){
	Color = window.Color;
} else {
	
	/*Notes from https://www.cssportal.com/css3-color-names/:

		fuchsia has the same color code as Magenta
		aqua has the same color code as Cyan
		lightGrey is spelled with an 'e', all other grays are spelled with an 'a'
		darkGray is actually lighter than Gray
		lightPink is actually darker than Pink
	*/


	Color.aliceBlue = new Color('aliceBlue','#f0f8ffff');
	Color.antiqueWhite = new Color('antiqueWhite','#faebd7ff');
	Color.aqua = new Color('aqua','#00ffffff');
	Color.aquamarine = new Color('aquamarine','#7fffd4ff');
	Color.azure = new Color('azure','#f0ffffff');

	Color.beige = new Color('beige','#f5f5dcff');
	Color.bisque = new Color('bisque','#ffe4c4ff');
	Color.black = new Color('black','#000000ff');
	Color.black = new Color('black','#000000ff');
	Color.blanchedAlmond = new Color('blanchedAlmond','#ffebcdff');
	Color.blue = new Color('blue','#0000ffff');
	Color.blueViolet = new Color('blueViolet','#8a2be2ff');
	Color.brown = new Color('brown','#a52a2aff');
	Color.burlyWood = new Color('burlyWood','#deb887ff');

	Color.cadetBlue = new Color('cadetBlue','#5f9ea0ff');
	Color.chartreuse = new Color('chartreuse','#7fff00ff');
	Color.chocolate = new Color('chocolate','#d2691eff');
	Color.coral = new Color('coral','#ff7f50ff');
	Color.cornflowerBlue = new Color('cornflowerBlue','#6495edff');
	Color.cornsilk = new Color('cornsilk','#fff8dcff');
	Color.crimson = new Color('crimson','#dc143cff');
	Color.cyan = new Color('cyan','#00ffffff');

	Color.darkBlue = new Color('darkBlue','#00008bff');
	Color.darkCyan = new Color('darkCyan','#008b8bff');
	Color.darkGoldenRod = new Color('darkGoldenRod','#b8860bff');
	Color.darkGray = new Color('darkGray','#a9a9a9ff');
	Color.darkGreen = new Color('darkGreen','#006400ff');
	Color.darkGrey = new Color('darkGrey','#a9a9a9ff');
	Color.darkKhaki = new Color('darkKhaki','#bdb76bff');
	Color.darkMagenta = new Color('darkMagenta','#8b008bff');
	Color.darkOliveGreen = new Color('darkOliveGreen','#556b2fff');
	Color.darkOrange = new Color('darkOrange','#ff8c00ff');
	Color.darkOrchid = new Color('darkOrchid','#9932ccff');
	Color.darkRed = new Color('darkRed','#8b0000ff');
	Color.darkSalmon = new Color('darkSalmon','#e9967aff');
	Color.darkSeaGreen = new Color('darkSeaGreen','#8fbc8fff');
	Color.darkSlateBlue = new Color('darkSlateBlue','#483d8bff');
	Color.darkSlateGray = new Color('darkSlateGray','#2f4f4fff');
	Color.darkSlateGrey = new Color('darkSlateGrey','#2f4f4fff');
	Color.darkTurquoise = new Color('darkTurquoise','#00ced1ff');
	Color.darkViolet = new Color('darkViolet','#9400d3ff');
	Color.deepPink = new Color('deepPink','#ff1493ff');
	Color.deepSkyBlue = new Color('deepSkyBlue','#00bfffff');
	Color.dimGray = new Color('dimGray','#696969ff');
	Color.dimGrey = new Color('dimGrey','#696969ff');
	Color.dodgerBlue = new Color('dodgerBlue','#1e90ffff');

	Color.fireBrick = new Color('fireBrick','#b22222ff');
	Color.floralWhite = new Color('floralWhite','#fffaf0ff');
	Color.forestGreen = new Color('forestGreen','#228b22ff');
	Color.fuchsia = new Color('fuchsia','#ff00ffff');

	Color.gainsboro = new Color('gainsboro','#dcdcdcff');
	Color.ghostWhite = new Color('ghostWhite','#f8f8ffff');
	Color.gold = new Color('gold','#ffd700ff');
	Color.goldenRod = new Color('goldenRod','#daa520ff');
	Color.goldenrod = new Color('goldenrod','#daa520ff');
	Color.gray = new Color('gray','#808080ff');
	Color.green = new Color('green','#008000ff');
	Color.greenYellow = new Color('greenYellow','#adff2fff');
	Color.grey = new Color('grey','#808080ff');

	Color.honeyDew = new Color('honeyDew','#f0fff0ff');
	Color.hotPink = new Color('hotPink','#ff69b4ff');

	Color.indianRed = new Color('indianRed','#cd5c5cff');
	Color.indigo = new Color('indigo','#4b0082ff');
	Color.ivory = new Color('ivory','#fffff0ff');

	Color.khaki = new Color('khaki','#f0e68cff');

	Color.lavender = new Color('lavender','#e6e6faff');
	Color.lavenderBlush = new Color('lavenderBlush','#fff0f5ff');
	Color.lawnGreen = new Color('lawnGreen','#7cfc00ff');
	Color.lemonChiffon = new Color('lemonChiffon','#fffacdff');
	Color.lightBlue = new Color('lightBlue','#add8e6ff');
	Color.lightCoral = new Color('lightCoral','#f08080ff');
	Color.lightCyan = new Color('lightCyan','#e0ffffff');
	Color.lightGoldenRodYellow = new Color('lightGoldenRodYellow','#fafad2ff');
	Color.lightGray = new Color('lightGray','#d3d3d3ff');
	Color.lightGreen = new Color('lightGreen','#90ee90ff');
	Color.lightGrey = new Color('lightGrey','#d3d3d3ff');
	Color.lightPink = new Color('lightPink','#ffb6c1ff');
	Color.lightSalmon = new Color('lightSalmon','#ffa07aff');
	Color.lightSeaGreen = new Color('lightSeaGreen','#20b2aaff');
	Color.lightSkyBlue = new Color('lightSkyBlue','#87cefaff');
	Color.lightSlateGray = new Color('lightSlateGray','#778899ff');
	Color.lightSlateGrey = new Color('lightSlateGrey','#778899ff');
	Color.lightSteelBlue = new Color('lightSteelBlue','#b0c4deff');
	Color.lightYellow = new Color('lightYellow','#ffffe0ff');
	Color.lime = new Color('lime','#00ff00ff');
	Color.limeGreen = new Color('limeGreen','#32cd32ff');
	Color.linen = new Color('linen','#faf0e6ff');

	Color.magenta = new Color('magenta','#ff00ffff');
	Color.maroon = new Color('maroon','#800000ff');
	Color.mediumAquaMarine = new Color('mediumAquaMarine','#66cdaaff');
	Color.mediumBlue = new Color('mediumBlue','#0000cdff');
	Color.mediumOrchid = new Color('mediumOrchid','#ba55d3ff');
	Color.mediumPurple = new Color('mediumPurple','#9370dbff');
	Color.mediumSeaGreen = new Color('mediumSeaGreen','#3cb371ff');
	Color.mediumSlateBlue = new Color('mediumSlateBlue','#7b68eeff');
	Color.mediumSpringGreen = new Color('mediumSpringGreen','#00fa9aff');
	Color.mediumTurquoise = new Color('mediumTurquoise','#48d1ccff');
	Color.mediumVioletRed = new Color('mediumVioletRed','#c71585ff');
	Color.midnightBlue = new Color('midnightBlue','#191970ff');
	Color.mintCream = new Color('mintCream','#f5fffaff');
	Color.mistyRose = new Color('mistyRose','#ffe4e1ff');
	Color.moccasin = new Color('moccasin','#ffe4b5ff');

	Color.navajoWhite = new Color('navajoWhite','#ffdeadff');
	Color.navy = new Color('navy','#000080ff');

	Color.oldLace = new Color('oldLace','#fdf5e6ff');
	Color.olive = new Color('olive','#808000ff');
	Color.oliveDrab = new Color('oliveDrab','#6b8e23ff');
	Color.orange = new Color('orange','#ffa500ff');
	Color.orangeRed = new Color('orangeRed','#ff4500ff');
	Color.orchid = new Color('orchid','#da70d6ff');

	Color.paleGoldenRod = new Color('paleGoldenRod','#eee8aaff');
	Color.paleGreen = new Color('paleGreen','#98fb98ff');
	Color.paleTurquoise = new Color('paleTurquoise','#afeeeeff');
	Color.paleVioletRed = new Color('paleVioletRed','#db7093ff');
	Color.papayaWhip = new Color('papayaWhip','#ffefd5ff');
	Color.peachPuff = new Color('peachPuff','#ffdab9ff');
	Color.peru = new Color('peru','#cd853fff');
	Color.pink = new Color('pink','#ffc0cbff');
	Color.plum = new Color('plum','#dda0ddff');
	Color.powderBlue = new Color('powderBlue','#b0e0e6ff');
	Color.purple = new Color('purple','#800080ff');

	Color.rebeccaPurple = new Color('rebeccaPurple','#663399ff');
	Color.red = new Color('red','#ff0000ff');
	Color.rosyBrown = new Color('rosyBrown','#bc8f8fff');
	Color.royalBlue = new Color('royalBlue','#4169e1ff');

	Color.saddleBrown = new Color('saddleBrown','#8b4513ff');
	Color.salmon = new Color('salmon','#fa8072ff');
	Color.sandyBrown = new Color('sandyBrown','#f4a460ff');
	Color.seaGreen = new Color('seaGreen','#2e8b57ff');
	Color.seaShell = new Color('seaShell','#fff5eeff');
	Color.seashell = new Color('seashell','#fff5eeff');
	Color.sienna = new Color('sienna','#a0522dff');
	Color.silver = new Color('silver','#c0c0c0ff');
	Color.skyBlue = new Color('skyBlue','#87ceebff');
	Color.slateBlue = new Color('slateBlue','#6a5acdff');
	Color.slateGray = new Color('slateGray','#708090ff');
	Color.slateGrey = new Color('slateGrey','#708090ff');
	Color.snow = new Color('snow','#fffafaff');
	Color.springGreen = new Color('springGreen','#00ff7fff');
	Color.steelBlue = new Color('steelBlue','#4682b4ff');

	Color.tan = new Color('tan','#d2b48cff');
	Color.teal = new Color('teal','#008080ff');
	Color.thistle = new Color('thistle','#d8bfd8ff');
	Color.tomato = new Color('tomato','#ff6347ff');
	Color.turquoise = new Color('turquoise','#40e0d0ff');

	Color.violet = new Color('violet','#ee82eeff');

	Color.wheat = new Color('wheat','#f5deb3ff');
	Color.white = new Color('white','#ffffffff');
	Color.whiteSmoke = new Color('whiteSmoke','#f5f5f5ff');

	Color.yellow = new Color('yellow','#ffff00ff');
	Color.yellowGreen = new Color('yellowGreen','#9acd32ff');
	
	window.Color = Color;
}