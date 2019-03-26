import GraphicsAtom from './../graphics/graphicsAtom.js';
import Length from './../graphics/length.js';

export default class TickLabels extends GraphicsAtom {
	
	constructor(){
		super();
		this.font = 'sans-serif';
		this.size = '22';
		this.color = 'black';
		this.format = ''
		this.isItalic = false;
		this.isBold = false;
		this.hasUnderline = false;
		this.rotation = '0';
		this.offset = '4';
		this.isHidden= false;
		
		this.tickLabelHeight = 0.0;
		this.tickLabelWidth = 0.0;
	}	

	createPage(root) {
		
		var page = root.append('treez-tab')
			.label('Tick labels');
	
		var section = page.append('treez-section')
			.label('Tick labels');
	
		var sectionContent = section.append('div');
		
		sectionContent.append('treez-font')
			.label('Font')
			.bindValue(this, ()=>this.font);
		
		sectionContent.append('treez-text-field')
			.label('Size')
			.bindValue(this, ()=>this.size);
	
		sectionContent.append('treez-color')
			.label('Color')
			.bindValue(this, ()=>this.color);
		
		sectionContent.append('treez-text-field')
			.label('Format')
			.bindValue(this, ()=>this.format);
		
		sectionContent.append('treez-check-box')
			.label('Italic')
			.bindValue(this, ()=>this.isItalic);
		
		sectionContent.append('treez-check-box')
			.label('Bold')
			.bindValue(this, ()=>this.isBold);
		
		sectionContent.append('treez-check-box')
			.label('Has underline')
			.bindValue(this, ()=>this.hasUnderline);		

		sectionContent.append('treez-combo-box')
			.label('Rotation')
			.attr('options','-180,-135,-90,-45,0,45,90,135,180')
			.bindValue(this, ()=>this.rotation);
	
		sectionContent.append('treez-text-field')
			.label('Offset')		
			.bindValue(this, ()=>this.offset);

		sectionContent.append('treez-check-box')
			.label('IsHidden')
			.bindValue(this, ()=>this.isHidden);

	}

	plot(dTreez, axisSelection, rectSelection, axis) {

		//Hint: The major ticks already have been created with the axis (see Data).
		//Here only the properties of the tick labels need to be applied.

		//get tick labels
		var tickLabels = axisSelection.selectAll('.primary') //
							.selectAll('.tick') //
							.selectAll('text');

		//remove default shift		
		var isHorizontal = axis.data.isHorizontal;
		if (isHorizontal) {
			tickLabels.attr('dy', '0');
		}

		//update label geometry
		var geometryConsumer = () => {
			this.__updateLabelGeometry(tickLabels, isHorizontal);
		};
		
		

		//bind attributes
		this.bindString(()=>this.font, tickLabels, 'font-family');
		this.bindString(()=>this.size, tickLabels, 'font-size');
		this.bindString(()=>this.color, tickLabels, 'fill');			
		this.bindFontItalicStyle(()=>this.isItalic, tickLabels);
		this.bindFontBoldStyle(()=>this.isBold, tickLabels);
		this.bindFontUnderline(()=>this.hasUnderline, tickLabels);
		this.bindBooleanToTransparency(()=>this.isHidden, null, tickLabels);

		this.addListener(()=>this.format, ()=>axis.updatePlot(dTreez));		
		this.addListener(()=>this.rotation, geometryConsumer);
		this.addListener(()=>this.offset, geometryConsumer);
		this.addListener(()=>this.size, geometryConsumer);		

		geometryConsumer();		

		return axisSelection;
	}

	__updateLabelGeometry(tickLabels, isHorizontal) {
		var tickOffset = Length.toPx(this.offset);
		
		var rotation = 0;
		try {
			rotation = -parseFloat(this.rotation);
		} catch (error) {
			
		}

		//initial transform
		this.__applyTransformation(tickLabels, 0, 0, rotation);

		//get actual text geometry and update transformation
		var x = 0;
		var y = 0;

		if (isHorizontal) {
			this.tickLabelHeight = this.__determineTickLabelHeight(tickLabels);
			y += this.tickLabelHeight + tickOffset;
		} else {

			var firstNode = tickLabels.node();			
			if (firstNode != null) {							
				var boundingBox = firstNode.getBBox();
				this.tickLabelWidth = boundingBox.width;
				var xMax = boundingBox.x + boundingBox.width;				
				x -= (xMax + tickOffset);
			}

		}

		this.__applyTransformation(tickLabels, x, y, rotation);
	}

	__determineTickLabelHeight(tickLabels) {
		var firstNode = tickLabels.node();
		if (firstNode == null) {
			return 0.0;
		}
		var boundingBox = firstNode.getBBox();
		var svgTickLabelHeight = boundingBox.height;
		var fontName = this.font;
		
		var fontSize = parseInt(this.size);
		var awtTextHeight = fontSize; //TODO AbstractGraphicsAtom.estimateTextHeight(fontName, fontSize);

		var height = Math.max(svgTickLabelHeight, awtTextHeight);
		return height;
	}

	__applyTransformation(tickLabels, x, y, rotation) {
		var transformString = 'translate(' + x + ',' + y + '),rotate(' + rotation + ')';
		tickLabels.attr('transform', transformString);
	}	

}
