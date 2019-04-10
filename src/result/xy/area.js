import GraphicsAtom from './../graphics/graphicsAtom.js';
import Color from './../../components/color/color.js';

export default class Area extends GraphicsAtom {
	
	constructor(){
		super();
		
		this.aboveColor = Color.white;
		//this.aboveFillStyle = 'solid';
		this.aboveTransparency = '0';
		this.aboveIsHidden = true;
		//this.aboveIsHiddenErrorFill = true;		

		this.belowColor = Color.white; 		
		//this.belowFillStyle = 'solid';
		this.belowTransparency = '0';
		this.belowIsHidden = true;		
		//this.belowHideErrorFill = true;		
	}

	createPage(root) {
		
		var page = root.append('treez-tab')
			.label('Fill');
		
		this.__createAboveSection(page);
		this.__createBelowSection(page);		
	}
	
	__createAboveSection(page){
		var section = page.append('treez-section')
			.label('Fill above');
	
		var sectionContent = section.append('div');
		
		sectionContent.append('treez-color')
			.label('Color')
			.bindValue(this, ()=>this.aboveColor);	
	
		//fillAbove.createFillStyle(aboveFillStyle, 'style', 'Style');
		
		sectionContent.append('treez-text-field')
			.label('Transparency')
			.bindValue(this, ()=>this.aboveTransparency);
		
		sectionContent.append('treez-check-box')
			.label('IsHidden')
			.bindValue(this, ()=>this.aboveIsHidden);		
	
		//fillAbove.createCheckBox(aboveHideErrorFill, 'hideErrorFill', 'Hide error fill');
	}
	
	__createBelowSection(page){
		var section = page.append('treez-section')
			.label('Fill below');
	
		var sectionContent = section.append('div');
		
		sectionContent.append('treez-color')
			.label('Color')
			.bindValue(this, ()=>this.belowColor);	
	
		//fillAbove.createFillStyle(belowFillStyle, 'style', 'Style');
		
		sectionContent.append('treez-text-field')
			.label('Transparency')
			.bindValue(this, ()=>this.belowTransparency);
		
		sectionContent.append('treez-check-box')
			.label('IsHidden')
			.bindValue(this, ()=>this.belowIsHidden);		
	
		//fillAbove.createCheckBox(belowHideErrorFill, 'hideErrorFill', 'Hide error fill');
	}


	plot(dTreez, xySelection, rectSelection, xy) {		
		var xyData = xy.xyData;		
		var interpolationMode = xy.line.interpolation;

		this.__plotAboveArea(dTreez, xy.name, xySelection, xyData, xy.xScale, xy.yScale, interpolationMode);
		this.__plotBelowArea(dTreez, xy.name, xySelection, xyData, xy.xScale, xy.yScale, interpolationMode);

		return xySelection;
	}

	__plotAboveArea(dTreez, parentName, xySelection, xyData, xScale, yScale, interpolationMode) {

		var id = 'area-above_' + parentName;

		//remove old area group if it already exists
		xySelection.selectAll('#' + id) //
				.remove();

		//create new area group
		var areaAboveSelection = xySelection //
				.append('g') //
				.attr('id', id) //
				.attr('class', 'area-above');

		
		var areaAbovePathGenerator = dTreez //
				.area() //
				.x((row)=>xScale(row[0])) //
				.y1((row)=>xScale(row[1]));//
				//.curve(interpolationMode); //TODO

		var aboveArea = areaAboveSelection //
				.append('path') //
				.attr('d', areaAbovePathGenerator(xyData));

		this.bindString(()=>this.aboveColor, aboveArea, 'fill');
		this.bindTransparency(()=>this.aboveTransparency, aboveArea);
		this.bindBooleanToNegatingDisplay(()=>this.aboveIsHidden, aboveArea);
	}

	__plotBelowArea(dTreez, parentName, xySelection, xyData, xScale, yScale, interpolationMode) {

		var id = 'area-below_' + parentName;

		//remove old area group if it already exists
		xySelection.selectAll('#' + id) //
				.remove();

		//create new area group
		var areaBelowSelection = xySelection //
				.append('g') //
				.attr('id', id) //
				.attr('class', 'area-below');

		var yMin = yScale(0.0);

		var areaBelowPathGenerator = dTreez //				
				.area() //
				.x((row)=>xScale(row[0])) //
				.y0(yMin) //
				.y1((row)=>yScale(row[1]));//
				//.curve(mode); //TODO

		var belowArea = areaBelowSelection //
				.append('path') //
				.attr('d', areaBelowPathGenerator(xyData));

		this.bindString(()=>this.belowColor, belowArea, 'fill');
		this.bindTransparency(()=>this.belowTransparency, belowArea);
		this.bindBooleanToNegatingDisplay(()=>this.belowIsHidden, belowArea);		
	}

	//#end region

}
