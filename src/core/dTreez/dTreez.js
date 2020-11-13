//* wraps d3 to have a clear interface
//* adds additional functionality

import DTreezSelection from './dTreezSelection.js'
 
export default class DTreez {
	
	constructor(d3){
		this.__d3 = d3;		
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

	interpolateTurbo(values) {
		return this.__d3.interpolateTurbo(values);
	}

	interpolateSinebow(values) {
		return this.__d3.interpolateSinebow(values);
	}

	interpolateRainbow(values) {
		return this.__d3.interpolateRainbow(values);
	}
	interpolateSpectral(values) {
		return this.__d3.interpolateSpectral(values);
	}

	interpolateCubehelixDefault(values) {
		return this.__d3.interpolateCubehelixDefault(values);
	}

	interpolateCividis(values) {
		return this.__d3.interpolateCividis(values);
	}

	interpolateInferno(values) {
		return this.__d3.interpolateInferno(values);
	}

	interpolateMagma(values) {
		return this.__d3.interpolateMagma(values);
	}

	interpolatePlasma(values) {
		return this.__d3.interpolatePlasma(values);
	}

	interpolateViridis(values) {
		return this.__d3.interpolateViridis(values);
	}

	interpolateWarm(values) {
		return this.__d3.interpolateWarm(values);
	}

	interpolateCool(values) {
		return this.__d3.interpolateCool(values);
	}

	interpolatePRGn(values) {
		return this.__d3.interpolatePRGn(values);
	}

	interpolatePuOr(values) {
		return this.__d3.interpolatePuOr(values);
	}

	interpolatePuRd(values) {
		return this.__d3.interpolatePuRd(values);
	}

	interpolateReds(values) {
		return this.__d3.interpolateReds(values);
	}

	interpolateOranges(values) {
		return this.__d3.interpolateOranges(values);
	}

	interpolateOrRd(values) {
		return this.__d3.interpolateOrRd(values);
	}

	interpolateYlOrRd(values) {
		return this.__d3.interpolateYlOrRd(values);
	}

	interpolateYlOrBr(values) {
		return this.__d3.interpolateYlOrBr(values);
	}

	interpolateYlGn(values) {
		return this.__d3.interpolateYlGn(values);
	}

	interpolateGreens(values) {
		return this.__d3.interpolateGreens(values);
	}

	interpolateBuGn(values) {
		return this.__d3.interpolateBuGn(values);
	}

	interpolatePuBuGn(values) {
		return this.__d3.interpolatePuBuGn(values);
	}

	interpolateBrBG(values) {
		return this.__d3.interpolateBrBG(values);
	}

	interpolatePiYG(values) {
		return this.__d3.interpolatePiYG(values);
	}

	interpolateRdYlGn(values) {
		return this.__d3.interpolateRdYlGn(values);
	}

	interpolateRdYlBu(values) {
		return this.__d3.interpolateRdYlBu(values);
	}

	interpolateRdBu(values) {
		return this.__d3.interpolateRdBu(values);
	}

	interpolateRdGy(values) {
		return this.__d3.interpolateRdGy(values);
	}

	interpolateGreys(values) {
		return this.__d3.interpolateGreys(values);
	}

	interpolateYlGnBu(values) {
		return this.__d3.interpolateYlGnBu(values);
	}

	interpolateGnBu(values) {
		return this.__d3.interpolateGnBu(values);
	}

	interpolatePuBu(values) {
		return this.__d3.interpolatePuBu(values);
	}

	interpolateBlues(values) {
		return this.__d3.interpolateBlues(values);
	}

	interpolatePurples(values) {
		return this.__d3.interpolatePurples(values);
	}

	interpolateBuPu(values) {
		return this.__d3.interpolateBuPu(values);
	}

	interpolateRdPu(values) {
		return this.__d3.interpolateRdPu(values);
	}

	line(){
		return this.__d3.line();
	}	

	range(start, end, step){
		return this.__d3.range(start, end, step);
	}

	ribbon(headRadius){
		return this.__d3.ribbon(headRadius);
	}

	ribbonArrow(){
		return this.__d3.ribbonArrow();
	}

	sankey(){
		return this.__d3.sankey();
	}

	sankeyLeft(...args){
		return this.__d3.sankeyLeft(...args);
	}

	sankeyCenter(...args){
		return this.__d3.sankeyCenter(...args);
	}

	sankeyRight(...args){
		return this.__d3.sankeyRight(...args);
	}

	sankeyJustify(...args){
		return this.__d3.sankeyJustify(...args);
	}

	sankeyLinkHorizontal(...args){
		return this.__d3.sankeyLinkHorizontal(...args);
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

	scaleSequential(method){
		return this.__d3.scaleSequential(method);
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