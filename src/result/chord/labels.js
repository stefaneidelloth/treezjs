import GraphicsAtom from './../graphics/graphicsAtom.js';

export default class Label extends GraphicsAtom {
	
	constructor(){
		super();

		this.horizontalPosition = 'centre';
		this.verticalPosition = 'centre';
		this.angle = '0';
		this.font = 'serif';
		this.fontSize = '14pt';
		this.color = Color.black;
		this.isItalic = false;
		this.isBold = false;
		this.hasUnderline = false;
		this.isHidden = false;		
	}

	createPage(root) {
		
		var page = root.append('treez-tab')
		.label('Label');

		var section = page.append('treez-section')
			.label('Label');
	
		var sectionContent = section.append('div');

		/*

		ComboBox horzPosComboBox = label.createComboBox(horizontalPosition, this, "right, centre, left", "centre");
		horzPosComboBox.setLabel("Horz position");

		ComboBox vertPosComboBox = label.createComboBox(verticalPosition, this, "top, centre, bottom", "centre");
		vertPosComboBox.setLabel("Vert position");

		label.createTextField(angle, this, "0");

		label.createFont(font, "font");

		label.createSize(fontSize, this, "14pt").setLabel("Size");

		label.createColorChooser(color, this, "black");

		label.createCheckBox(italic, this);

		label.createCheckBox(bold, this);

		label.createCheckBox(underline, this);

		label.createCheckBox(hide, this);
		
		*/
	}

	plot(dTreez, graphSelection, rectSelection, parent) {

		//parent.bindStringAttribute(selection, "x", leftMargin);

		return graphSelection;
	}

	

}
