import GraphicsAtom from './../graphics/graphicsAtom.js';

export default class ErrorBar extends GraphicsAtom {
	
	constructor(){
		super();

	this.color = 'black';
	this.width = '0.5pt';
	this.style = 'style';
	this.transparency = '0'	
	this.endSize = '1';
	this.isHidden = false;
	this.isHorizontallyHidden = false;
	this.isVerticallyHidden = false;
	}

	createPage(root) {

		var page = root.append('treez-tab')
			.label('Error bar');

		var section = page.append('treez-section')
			.label('Error bar line');
	
		var sectionContent = section.append('div');
		
		/*

		errorBarLine.createColorChooser(color, "color", "black");

		errorBarLine.createSize(width, this, "0.5pt");

		errorBarLine.createLineStyle(style, "style");

		errorBarLine.createTextField(transparency, this, "0");

		errorBarLine.createCheckBox(hide, this);

		TextField endSizeField = errorBarLine.createTextField(endSize, this, "1");
		endSizeField.setLabel("End size");

		CheckBox hideHorz = errorBarLine.createCheckBox(hideHorizontal, this);
		hideHorz.setLabel("Hide horz.");
		CheckBox hideVert = errorBarLine.createCheckBox(hideVertical, this);
		hideVert.setLabel("Hide vert.");
		
		*/
	}

	plot(dTeeez, graphSelection, rectSelection, parent) {

		//parent.bindStringAttribute(selection, "x", leftMargin);

		return graphSelection;
	}

	//#end region

}
