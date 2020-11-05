//* wraps d3 to have a clear interface
//* adds additional functionality

import DTreezSelection from './dTreezSelection.js'
import DTreezEvent from './dTreezEvent.js';
 
export default class DTreez {
	
	constructor(d3){
		this.__d3 = d3;
		this.event = new DTreezEvent(d3);
	}

	arc(){
		return this.__d3.arc();
	}

	area(){
		return this.__d3.area();
	}

	axisLeft(scale){
		return this.__d3.axisLeft(scale);
	}

	axisRight(scale){
		return this.__d3.axisRight(scale);
	}

	axisTop(scale){
		return this.__d3.axisTop(scale);
	}

	axisBottom(scale){
		return this.__d3.axisBottom(scale);
	}

	chord(){
		return this.__d3.chord();
	}

	drag(){
		return this.__d3.drag();
	}

	format(formatter){
		return this.__d3.format(formatter);
	}

	line(){
		return this.__d3.line();
	}	

	range(start, end, step){
		return this.__d3.range(start, end, step);
	}

	ribbon(){
		return this.__d3.ribbon();
	}

	scaleBand(){
		return this.__d3.scaleBand();
	}

	scaleLinear(){
		return this.__d3.scaleLinear();
	}

	scaleLog(){
		return this.__d3.scaleLog();
	}

	scaleOrdinal(){
		return this.__d3.scaleOrdinal();
	}
	
	select(selector){
		let selection = this.__d3.select(selector);
		return new DTreezSelection(selection);
	}
	
	selectAll(selector){
		let selection = this.__d3.selectAll(selector);
		return new DTreezSelection(selection);
	}

	symbol(){
		return this.__d3.symbol();
	}

	transform(transformString){
		return this.__getTransformation(transformString);
	}

	__getTransformation(transform) {
	  //original source: https://stackoverflow.com/questions/38224875/replacing-d3-transform-in-d3-v4

	  if(!transform){
	  	return {
			translateX: 0,
			translateY: 0,
			rotate: 0,
			skewX: 0,
			scaleX: 1,
			scaleY: 1
		};
	  }

	  // Create a dummy g for calculation purposes only. This will never
	  // be appended to the DOM and will be discarded once this function 
	  // returns.
	  var g = document.createElementNS("http://www.w3.org/2000/svg", "g");

	  // Set the transform attribute to the provided string value.
	  g.setAttributeNS(null, "transform", transform);

	  // consolidate the SVGTransformList containing all transformations
	  // to a single SVGTransform of type SVG_TRANSFORM_MATRIX and get
	  // its SVGMatrix. 
	  var matrix = g.transform.baseVal.consolidate().matrix;

	  // Below calculations are taken and adapted from the private function
	  // transform/decompose.js of D3's module d3-interpolate.
	  var {a, b, c, d, e, f} = matrix;   // ES6, if this doesn't work, use below assignment
	  // var a=matrix.a, b=matrix.b, c=matrix.c, d=matrix.d, e=matrix.e, f=matrix.f; // ES5
	  var scaleX, scaleY, skewX;
	  if (scaleX = Math.sqrt(a * a + b * b)) a /= scaleX, b /= scaleX;
	  if (skewX = a * c + b * d) c -= a * skewX, d -= b * skewX;
	  if (scaleY = Math.sqrt(c * c + d * d)) c /= scaleY, d /= scaleY, skewX /= scaleY;
	  if (a * d < b * c) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
	  return {
		translateX: e,
		translateY: f,
		rotate: Math.atan2(b, a) * 180 / Math.PI,
		skewX: Math.atan(skewX) * 180 / Math.PI,
		scaleX: scaleX,
		scaleY: scaleY
	  };
	}

	get descending(){
		return this.__d3.descending;
	}

	get symbols(){
		return this.__d3.symbols;
	}

	get symbolCircle(){
		return this.__d3.symbolCircle;
	}

	get symbolCross(){
		return this.__d3.symbolCross;
	}

	get symbolDiamond(){
		return this.__d3.symbolDiamond;
	}

	get symbolSquare(){
		return this.__d3.symbolSquare;
	}

	get symbolStar(){
		return this.__d3.symbolStar;
	}

	get symbolTriangle(){
		return this.__d3.symbolTriangle;
	}
	
	get symbolWye(){
		return this.__d3.symbolWye;
	}
	
	
}	