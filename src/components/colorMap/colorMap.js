import Enum from './../enum.js';

export default class ColorMap extends Enum {

	constructor(name, colors){
		super(name);
		this.colors = colors;
	}
}

if(window.ColorMap){
	ColorMap = window.ColorMap;
} else {
	//the following color maps are derived from the
	//d3.interpolate{$XY} functions
	ColorMap.Turbo = new ColorMap('Turbo', ['#23171bff','#4a58ddff','#2f9df5ff','#27d7c4ff','#4df884ff','#95fb51ff','#dedd32ff','#ffa423ff','#f65f18ff','#ba2208ff','#900c00ff']);
	ColorMap.Sinebow = new ColorMap('Sinebow', ['#ff4040ff','#e78d0bff','#a7d503ff','#58fc2aff','#18f472ff','#00bfbfff','#1872f4ff','#582afcff','#a703d5ff','#e70b8dff','#ff4040ff']);
	ColorMap.Rainbow = new ColorMap('Rainbow', ['#6e40aaff','#bf3cafff','#fe4b83ff','#ff7847ff','#e2b72fff','#aff05bff','#52f667ff','#1ddfa3ff','#23abd8ff','#4c6edbff','#6e40aaff']);	
	ColorMap.Spectral = new ColorMap('Spectral', ['#9e0142ff','#d13c4bff','#f0704aff','#fcac63ff','#fedd8dff','#fbf8b0ff','#e0f3a1ff','#a9dda2ff','#69bda9ff','#4288b5ff','#5e4fa2ff']);
	ColorMap.CubehelixDefault = new ColorMap('CubehelixDefault', ['#000000ff','#1a1530ff','#163d4eff','#1f6642ff','#54792fff','#a07949ff','#d07e93ff','#cf9cdaff','#c1caf3ff','#d2eeefff','#ffffffff']);
    ColorMap.Cividis = new ColorMap('Cividis', ['#002051ff','#0a326aff','#2b446eff','#4d566dff','#696970ff','#7f7c75ff','#948f78ff','#ada476ff','#caba6aff','#ead156ff','#fdea45ff']);
	
    ColorMap.Inferno = new ColorMap('Inferno', ['#000004','#160b39','#420a68','#6a176e','#932667','#bc3754','#dd513a','#f37819','#fca50a','#f6d746','#fcffa4']);
	ColorMap.Magma = new ColorMap('Magma', ['#000004','#140e36','#3b0f70','#641a80','#8c2981','#b73779','#de4968','#f7705c','#fe9f6d','#fecf92','#fcfdbf']);

	ColorMap.Plasma = new ColorMap('Plasma', ['#0d0887','#41049d','#6a00a8','#8f0da4','#b12a90','#cc4778','#e16462','#f2844b','#fca636','#fcce25','#f0f921']);
    ColorMap.Viridis = new ColorMap('Viridis', ['#440154','#482475','#414487','#355f8d','#2a788e','#21918c','#22a884','#44bf70','#7ad151','#bddf26','#fde725']);
    
    ColorMap.Warm = new ColorMap('Warm', ['#6e40aaff','#963db3ff','#bf3cafff','#e4419dff','#fe4b83ff','#ff5e63ff','#ff7847ff','#fb9633ff','#e2b72fff','#c6d63cff','#aff05bff']);
	ColorMap.Cool = new ColorMap('Cool', ['#6e40aaff','#6054c8ff','#4c6edbff','#368ce1ff','#23abd8ff','#1ac7c2ff','#1ddfa3ff','#30ef82ff','#52f667ff','#7ff658ff','#aff05bff']);
   	
    ColorMap.PRGn = new ColorMap('PRGn', ['#40004bff','#732f80ff','#9a6daaff','#c1a4cdff','#e4d2e6ff','#eff0efff','#d6eed1ff','#a2d79eff','#5cad65ff','#217839ff','#00441bff']);
	
	ColorMap.PuOr = new ColorMap('PuOr', ['#2d004bff','#552d84ff','#8170acff','#b0aad0ff','#d7d7e9ff','#f3eeeaff','#fdddb3ff','#f8b664ff','#dd841fff','#b25a09ff','#7f3b08ff']);

	ColorMap.PuRd = new ColorMap('PuRd', ['#f7f4f9ff','#eae3f0ff','#dcc9e2ff','#d0aad2ff','#d08ac2ff','#dd63aeff','#e33890ff','#d71c6cff','#b70b4fff','#8f023aff','#67001fff']);
    ColorMap.Reds = new ColorMap('Reds', ['#fff5f0ff','#fee3d6ff','#fdc9b4ff','#fcaa8eff','#fc8a6bff','#f9694cff','#ef4533ff','#d92723ff','#bb151aff','#970b13ff','#67000dff']);
	ColorMap.Oranges = new ColorMap('Oranges', ['#fff5ebff','#fee8d3ff','#fdd8b3ff','#fdc28cff','#fda762ff','#fb8d3dff','#f2701dff','#e25609ff','#c44103ff','#9f3303ff','#7f2704ff']);
	ColorMap.OrRd = new ColorMap('OrRd', ['#fff7ecff','#feebcfff','#fddcafff','#fdca94ff','#fdb07aff','#fa8e5dff','#f16c49ff','#e04530ff','#c81d13ff','#a70403ff','#7f0000ff']);

    ColorMap.YlOrRd = new ColorMap('YlOrRd', ['#ffffccff','#fff0a9ff','#fee087ff','#fec965ff','#feab4bff','#fd893cff','#fa5c2eff','#ec3023ff','#d31121ff','#af0225ff','#800026ff']);
    ColorMap.YlOrBr = new ColorMap('YlOrBr', ['#ffffe5ff','#fff8c4ff','#feeaa1ff','#fed676ff','#feba4aff','#fb992cff','#ee7918ff','#d85b0aff','#b74304ff','#8f3204ff','#662506ff']);

    ColorMap.YlGn = new ColorMap('YlGn', ['#ffffe5ff','#f7fcc4ff','#e4f4acff','#c7e89bff','#a2d88aff','#78c578ff','#4eaf63ff','#2f944eff','#15793fff','#036034ff','#004529ff']);
	
    ColorMap.Greens = new ColorMap('Greens', ['#f7fcf5ff','#e8f6e3ff','#d3eecdff','#b7e2b1ff','#97d494ff','#73c378ff','#4daf62ff','#2f984fff','#157f3bff','#036429ff','#00441bff']);
    ColorMap.BuGn = new ColorMap('BuGn', ['#f7fcfdff','#e8f6f9ff','#d5efedff','#b7e4daff','#8fd3c1ff','#68c2a3ff','#49b17fff','#2f9959ff','#157f3cff','#036429ff','#00441bff']);
    ColorMap.PuBuGn = new ColorMap('PuBuGn', ['#fff7fbff','#efe7f2ff','#dbd8eaff','#bec9e2ff','#98b9d9ff','#69a8cfff','#4096c0ff','#19879fff','#037877ff','#016353ff','#014636ff']);
    
    ColorMap.BrBG = new ColorMap('BrBG', ['#543005ff','#8b540fff','#bc8435ff','#debe7bff','#f2e4c0ff','#eef1eaff','#c3e7e2ff','#7fc9bfff','#39988fff','#0a675fff','#003c30ff']);
	ColorMap.PiYG = new ColorMap('PiYG', ['#8e0152ff','#c0267eff','#dd72adff','#f0b3d6ff','#faddedff','#f5f3efff','#e1f2caff','#b6de87ff','#80bb47ff','#4f9125ff','#276419ff']);
	ColorMap.RdYlGn = new ColorMap('RdYlGn', ['#a50026ff','#d4322cff','#f16e43ff','#fcac63ff','#fedd8dff','#f9f7aeff','#d7ee8eff','#a4d86eff','#64bc61ff','#22964fff','#006837ff']);
	
	ColorMap.RdYlBu = new ColorMap('RdYlBu', ['#a50026ff','#d4322cff','#f16e43ff','#fcac64ff','#fedd90ff','#faf8c1ff','#dcf1ecff','#abd6e8ff','#75abd0ff','#4a74b4ff','#313695ff']);	
    ColorMap.RdBu = new ColorMap('RdBu', ['#67001fff','#ac202fff','#d56050ff','#f1a385ff','#fbd7c4ff','#f2efeeff','#cde3eeff','#8fc2ddff','#4b94c4ff','#2265a3ff','#053061ff']);
    
    ColorMap.RdGy = new ColorMap('RdGy', ['#67001fff','#ac202fff','#d56050ff','#f1a385ff','#fcd8c5ff','#faf4f1ff','#dfdfdfff','#b8b8b8ff','#868686ff','#4e4e4eff','#1a1a1aff']);
	ColorMap.Greys = new ColorMap('Greys', ['#ffffffff','#f2f2f2ff','#e2e2e2ff','#cececeff','#b4b4b4ff','#979797ff','#7a7a7aff','#5f5f5fff','#404040ff','#1e1e1eff','#000000ff']);
	
    ColorMap.YlGnBu = new ColorMap('YlGnBu', ['#ffffd9ff','#eff9bdff','#d5eeb3ff','#a9ddb7ff','#73c9bdff','#45b4c2ff','#2897bfff','#2073b2ff','#234ea0ff','#1c3185ff','#081d58ff']);
    ColorMap.GnBu = new ColorMap('GnBu', ['#f7fcf0ff','#e5f5dfff','#d3eeceff','#bde5bfff','#9ed9bbff','#7bcbc4ff','#58b7cdff','#399cc6ff','#1d7eb7ff','#0b60a1ff','#084081ff']);
	ColorMap.PuBu = new ColorMap('PuBu', ['#fff7fbff','#efeaf4ff','#dbdaebff','#bfc9e2ff','#9bb9d9ff','#72a8cfff','#4394c3ff','#1a7db6ff','#0667a1ff','#045281ff','#023858ff']);
    ColorMap.Blues = new ColorMap('Blues', ['#f7fbffff','#e3eef9ff','#cfe1f2ff','#b5d4e9ff','#93c3dfff','#6daed5ff','#4b97c9ff','#2f7ebcff','#1864aaff','#0a4a90ff','#08306bff']);

    ColorMap.Purples = new ColorMap('Purples', ['#fcfbfdff','#f1eff6ff','#e2e1efff','#cecee5ff','#b6b5d8ff','#9e9bc9ff','#8782bcff','#7363acff','#61409bff','#501f8cff','#3f007dff']);
    ColorMap.BuPu = new ColorMap('BuPu', ['#f7fcfdff','#e4eef5ff','#ccddecff','#b2cae1ff','#9cb3d5ff','#8f95c6ff','#8c74b5ff','#8952a5ff','#852d8fff','#730f71ff','#4d004bff']);
	ColorMap.RdPu = new ColorMap('RdPu', ['#fff7f3ff','#fde4e1ff','#fccfccff','#fbb5bcff','#f993b0ff','#f369a3ff','#e03e98ff','#c01788ff','#99037cff','#700174ff','#49006aff']);
			

	window.ColorMap = ColorMap;
}

//Code to derive values:

/*

colorMaps = Object.keys(d3).filter(key=>key.substring(0,11)=='interpolate').map(key=>key.substring(11))

for(colorMap of colorMaps){
  
  try{
   myfunc = d3['interpolate' + colorMap];
   arr = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1].map(val=>
         {
            col = myfunc(val);            
            if(col[0] === 'r'){
               col = "#" +rgba2hex(col) ;
            }
            return col;
         });
   str = arr.join("','");
   if (str[0] === '#'){
      console.log("ColorMap." + colorMap + " = new ColorMap('"+ colorMap +"', ['" + str + "']);");     
   }
  } catch(e){}
}

*/