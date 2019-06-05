import GraphicsAtom from './../graphics/graphicsAtom.js';
import Length from './../graphics/length.js';

export default class AxisLabel extends GraphicsAtom {

	constructor(){	
		super();	
		this.font = 'sans-serif';
		this.size = '22';
		this.color = 'black';
		this.isItalic = false;
		this.isBold = false;
		this.hasUnderline = false;
		//this.atEdge = undefined;
		this.rotation = '0';
		this.labelOffset = '4';
		this.position = 'centre';
		this.isHidden = false;
	}	

	createPage(root, parent) {

		var page = root.append('treez-tab')
			.label('Axis label');
		
		var section = page.append('treez-section')
			.label('Axis label');

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
		
		sectionContent.append('treez-check-box')
			.label('Italic')
			.bindValue(this, ()=>this.isItalic);
		
		sectionContent.append('treez-check-box')
			.label('Bold')
			.bindValue(this, ()=>this.isBold);
		
		sectionContent.append('treez-check-box')
			.label('Has underline')
			.bindValue(this, ()=>this.hasUnderline);

		sectionContent.append('treez-check-box')
			.label('IsHidden')
			.bindValue(this, ()=>this.isHidden);
		
		//sectionContent.append('treez-check-box')
		//	.label('At edge')
		//	.bindValue(this, ()=>this.isAtEdge);
					
		sectionContent.append('treez-combo-box')
			.label('Rotation')
			.attr('options','-180,-135,-90,-45,0,45,90,135,180')
			.bindValue(this, ()=>this.rotation);
		
		sectionContent.append('treez-text-field')
			.label('Label offset')		
			.bindValue(this, ()=>this.labelOffset);

		sectionContent.append('treez-combo-box')
			.label('Position')
			.attr('options','at-minimum,centre,at-maximum')
			.bindValue(this, ()=>this.position);
	}

	plot(dTreez, axisSelection, rectSelection, axis) {

		//remove label group if it already exists
		axisSelection //
				.select('#axis-label').remove();

		//create new label
		var labelSelection = axisSelection//
				.append('g') //
				.attr('id', 'axis-label') //
				.append('text');

		var geometryConsumer = () => {
			var graph = axis.parent;
			this.__updateLabelGeometry(axis, labelSelection, graph);
		};

		this.addListener(()=>this.position, geometryConsumer);
		this.addListener(()=>this.rotation, geometryConsumer);
		this.addListener(()=>this.labelOffset, geometryConsumer);
		
		geometryConsumer();

		var data = axis.data;
		
		data.bindText(()=>data.label, labelSelection);
		
		this.bindString(()=>this.font, labelSelection, 'font-family');
		this.bindString(()=>this.size, labelSelection, 'font-size');
		this.bindString(()=>this.color, labelSelection, 'fill');
		
		this.bindFontItalicStyle(()=>this.isItalic, labelSelection);
		this.bindFontBoldStyle(()=>this.isBold, labelSelection);
		this.bindFontUnderline(()=>this.hasUnderline, labelSelection);
		this.bindBooleanToTransparency(()=>this.isHidden, null, labelSelection);		

		return axisSelection;
	}

	__updateLabelGeometry(axis, labelSelection, graph) {

		
		this.__setTextAnchor(labelSelection);

		var rotation = this.__parseRotation();

		//initial transformation
		this.__applyTransformation(labelSelection, 0, 0, rotation);

		//get actual text geometry and update transformation
		var labelNode = labelSelection.node().parentElement; //label group
		var boundingBox = labelNode.getBBox();
		var labelHeight = this.__determineLabelHeight(boundingBox);

		var isHorizontal = axis.data.isHorizontal;
		if (isHorizontal) {
			this.__applyTransformationForHorizontalOrientation(graph, axis, labelSelection, rotation, labelHeight);
		} else {
			this.__applyTransformationForVerticalOrientation(graph, axis, labelSelection, rotation, labelHeight);
		}
	}

	__setTextAnchor(labelSelection) {
		if (this.position === 'at-minimum') {
			labelSelection.attr('text-anchor', 'start');
		} else if (this.position === 'centre') {
			labelSelection.attr('text-anchor', 'middle');
		} else {
			labelSelection.attr('text-anchor', 'end');
		}
	}

	__parseRotation() {
		
		var rotation = 0.0;
		try {
			rotation = -parseFloat(this.rotation);
		} catch (error) {
			
		}
		return rotation;
	}

	__applyTransformationForVerticalOrientation(graph, axis, labelSelection, rotation, labelHeight) {

		var offset = Length.toPx(this.labelOffset);
		var tickOffset = Length.toPx(axis.tickLabels.offset);
		var graphHeight = Length.toPx(graph.data.height);

		var tickLabelWidth = axis.tickLabels.tickLabelWidth;
		var extraVerticalRotation = -90;
		var verticalRotation = rotation + extraVerticalRotation;

		var x = -(tickOffset + tickLabelWidth + offset + 2*labelHeight);
		var y = graphHeight;
		if (this.position === 'centre') {
			y = graphHeight / 2;
		} else if (this.position === 'at-maximum') {
			y = 0;
		}
		this.__applyTransformation(labelSelection, x, y, verticalRotation);
	}

	__applyTransformationForHorizontalOrientation(graph, axis, labelSelection, rotation, labelHeight) {

		var offset = Length.toPx(this.labelOffset);
		var tickOffset = Length.toPx(axis.tickLabels.offset);

		var graphWidth = Length.toPx(graph.data.width);
		var graphHeight = Length.toPx(graph.data.height);

		var tickLabelHeight = axis.tickLabels.tickLabelHeight;

		var x = 0.0;
		if (this.position === 'centre') {
			x = graphWidth / 2;
		} else if (positionString === 'at-maximum') {
			x = graphWidth;
		}

		var y = graphHeight + tickOffset + tickLabelHeight + offset + labelHeight;
		this.__applyTransformation(labelSelection, x, y, rotation);
	}

	__determineLabelHeight(boundingBox) {
		var svgLabelHeight = boundingBox.height;

		var fontSize = parseFloat(this.size);
		var awtTextHeight = fontSize; //TODO AbstractGraphicsAtom.estimateTextHeight(fontName, fontSize);

		var height = Math.max(svgLabelHeight, awtTextHeight);
		return height;
	}

	__applyTransformation(tickLabels, x, y, rotation) {
		var transformString = 'translate(' + x + ',' + y + '),rotate(' + rotation + ')';
		tickLabels.attr('transform', transformString);
	}
	

}
