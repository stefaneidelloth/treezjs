import GraphicsAtom from './../graphics/graphicsAtom.js';
import LabelMode from './labelMode.js';
import Color from './../../components/color/color.js';
import Length from './../graphics/length.js';

export default class Labels extends GraphicsAtom {
	
	constructor(){
		super();

		this.labelMode = LabelMode.absolute;
		this.font = 'serif';
		this.size = 14;
		this.color = Color.black;
		this.isItalic = false;
		this.isBold = false;
		this.hasUnderline = false;
		this.isHidden = false;

	} 
	
	createPage(root) {

		var page = root.append('treez-tab')
			.label('Labels');
		
		var section = page.append('treez-section')
			.label('Labels');	
	
		var sectionContent = section.append('div');

		sectionContent.append('treez-enum-combo-box')
			.label('Label mode')
			.labelWidth('70px')	
			.nodeAttr('enum', LabelMode)
			.bindValue(this, ()=>this.labelMode);
		
		sectionContent.append('treez-font')
			.label('Font')
			.labelWidth('70px')		
			.bindValue(this, ()=>this.font);
		
		sectionContent.append('treez-double')
			.label('Size')	
			.labelWidth('70px')		
			.min('0')
			.bindValue(this, ()=>this.size);
		
		sectionContent.append('treez-color')
			.label('Color')	
			.labelWidth('70px')		
			.bindValue(this, ()=>this.color);
		
		sectionContent.append('treez-check-box')
			.label('Italic')
			.contentWidth('70px')			
			.bindValue(this, ()=>this.isItalic);
		
		sectionContent.append('treez-check-box')
			.label('Bold')	
			.contentWidth('70px')			
			.bindValue(this, ()=>this.isBold);
		
		sectionContent.append('treez-check-box')
			.label('Underline')	
			.contentWidth('70px')			
			.bindValue(this, ()=>this.hasUnderline);
		
		sectionContent.append('treez-check-box')
			.label('IsHidden')
			.contentWidth('70px')				
			.bindValue(this, ()=>this.isHidden);	

	}

	plot(dTreez, tornadoSelection, rectSelection, tornado) {

		var leftSelection = tornadoSelection //
				.select('.bar-rects-left'); //

		var rightSelection = tornadoSelection //
				.select('.bar-rects-right');

		
		var graph = tornado.graph;
		var graphHeight = Length.toPx(graph.data.height);
		var graphWidth = Length.toPx(graph.data.width);

		var labelAxis = tornado.data.labelAxis;		
		var inputScale = tornado.data.inputScale;

		var outputAxis = tornado.data.outputAxis;		
		var outputScale = tornado.data.outputScale;

		var leftData = eval(tornado.data.leftBarDataString);
		var rightData = eval(tornado.data.rightBarDataString);
		

		if (outputAxis.isHorizontal) {

			leftSelection.selectAll('text') //
					.data(leftData) //
					.enter() //
					.append('text')
					.attr('x', entry => outputScale(entry.value))
					.attr('y', entry => inputScale(entry.key))
					.style('fill', 'black')
					.text(entry => entry.input);

			rightSelection.selectAll('text') //
					.data(rightData) //
					.enter() //
					.append('text')
					.attr('x', entry => outputScale(entry.value))
					.attr('y', entry => inputScale(entry.key))
					.style('fill', 'black')
					.text(entry => entry.input);

		} else {

			leftSelection.selectAll('text') //
					.data(leftData) //
					.enter() //
					.append('text')
					.attr('x', entry => inputScale(entry.key))
					.attr('y', entry => graphHeight - outputScale(entry.value))
					.style('fill', 'black')
					.text(entry => entry.input);

			rightSelection.selectAll('text') //
					.data(rightData) //
					.enter() //
					.append('text')
					.attr('x', entry => inputScale(entry.key))
					.attr('y', entry => graphHeight - outputScale(entry.value))
					.style('fill', 'black')
					.text(entry => entry.input);
		}

		var textSelection = tornadoSelection.selectAll('g') //
								.selectAll('text');

		this.__formatText(textSelection);

		return tornadoSelection;
	}

	__formatText(textSelection) {		
		
		this.bindString(()=>this.font, textSelection, 'font-family');
		this.bindString(()=>this.size, textSelection, 'font-size');
		this.bindColor(()=>this.color, textSelection, 'fill');			
		this.bindFontItalicStyle(()=>this.isItalic, textSelection);
		this.bindFontBoldStyle(()=>this.isBold, textSelection);
		this.bindFontUnderline(()=>this.hasUnderline, textSelection);
		this.bindBooleanToTransparency(()=>this.isHidden, null, textSelection);			

		return textSelection;
	}

	

}
