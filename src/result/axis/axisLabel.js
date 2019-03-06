export default class AxisLabel {

	constructor(){
		
		this.font = undefined;
		this.size = undefined;
		this.color = undefined;
		this.italic = undefined;
		this.bold = undefined;
		this. underline = undefined;
		//this.atEdge = undefined;
		this. rotate = undefined;
		this.labelOffset = undefined;
		this.position = undefined;
		this.hide = undefined;
	}

	

	createPage(root, parent) {

		Page axisLabelPage = root.createPage("axisLabel", "   Axis label   ");

		Section axisLabel = axisLabelPage.createSection("axisLabel", "Axis label");

		axisLabel.createFont(font, this);

		axisLabel.createTextField(size, this, "22");

		axisLabel.createColorChooser(color, this, "black");

		axisLabel.createCheckBox(italic, this);

		axisLabel.createCheckBox(bold, this);

		axisLabel.createCheckBox(underline, this);

		axisLabel.createCheckBox(hide, this);

		//CheckBox atEdgeCheck = axisLabel.createCheckBox(atEdge, "atEdge");
		//atEdgeCheck.setLabel("At edge");

		axisLabel.createComboBox(rotate, this, "-180,-135,-90,-45,0,45,90,135,180", "0");

		TextField offsetField = axisLabel.createTextField(labelOffset, this, "4");
		offsetField.setLabel("Label offset");

		axisLabel.createComboBox(position, this, "at-minimum,centre,at-maximum", "centre");

	}

	plot(dTreez, axisSelection, rectSelection, axis) {

		

		//remove label group if it already exists
		axisSelection //
				.select("#axis-label").remove();

		//create new label
		var label = axisSelection//
				.append("g").attr("id", "axis-label").append("text");

		var geometryConsumer = () -> {
			var graph = axis.parent;
			this.__updateLabelGeometry(axis, label, graph);
		};

		position.addModificationConsumer("position", geometryConsumer);
		rotate.addModificationConsumer("position", geometryConsumer);
		labelOffset.addModificationConsumer("position", geometryConsumer);

		geometryConsumer.consume();

		var labelAttribute = axis.data.label;
		AbstractGraphicsAtom.bindText(label, labelAttribute);
		AbstractGraphicsAtom.bindStringAttribute(label, "font-family", font);
		AbstractGraphicsAtom.bindStringAttribute(label, "font-size", size);
		AbstractGraphicsAtom.bindStringAttribute(label, "fill", color);
		AbstractGraphicsAtom.bindFontItalicStyle(label, italic);
		AbstractGraphicsAtom.bindFontBoldStyle(label, bold);
		AbstractGraphicsAtom.bindFontUnderline(label, underline);
		AbstractGraphicsAtom.bindTransparencyToBooleanAttribute(label, hide);

		return axisSelection;
	}

	__updateLabelGeometry(axis, label, graph) {

		var positionString = position.get();
		setTextAnchor(label, positionString);

		var rotation = getRotation();

		//initial transformation
		applyTransformation(label, 0, 0, rotation);

		//get actual text geometry and update transformation
		Element labelNode = label.node().getParentElement(); //label group
		BoundingBox boundingBox = labelNode.getBBox();
		double labelHeight = determineLabelHeight(boundingBox);

		boolean isHorizontal = axis.data.isHorizontal();
		if (isHorizontal) {
			applyTransformationForHorizontalOrientation(graph, axis, label, positionString, rotation, labelHeight);
		} else {
			applyTransformationForVerticalOrientation(graph, axis, label, positionString, rotation, labelHeight);
		}
	}

	__setTextAnchor(label, positionString) {
		if (positionString.equals("at-minimum")) {
			label.attr("text-anchor", "start");
		} else if (positionString.equals("centre")) {
			label.attr("text-anchor", "middle");
		} else {
			label.attr("text-anchor", "end");
		}
	}

	getRotation() {
		String angleString = rotate.get();
		double rotation = 0;
		try {
			rotation = -Double.parseDouble(angleString);
		} catch (NumberFormatException exception) {}
		return rotation;
	}

	applyTransformationForVerticalOrientation(
			Graph graph,
			Axis axis,
			Selection label,
			String positionString,
			double rotation,
			double labelHeight) {

		double offset = getPxLength(labelOffset);
		double tickOffset = getPxLength(axis.tickLabels.offset);
		double graphHeight = getPxLength(graph.data.height);

		Double tickLabelWidth = axis.tickLabels.getTickLabelWidth();
		final int extraVerticalRotation = -90;
		double verticalRotation = rotation + extraVerticalRotation;

		double x = -(tickOffset + tickLabelWidth + offset + labelHeight);
		double y = graphHeight;
		if (positionString.equals("centre")) {
			y = graphHeight / 2;
		} else if (positionString.equals("at-maximum")) {
			y = 0;
		}
		applyTransformation(label, x, y, verticalRotation);
	}

	applyTransformationForHorizontalOrientation(
			Graph graph,
			Axis axis,
			Selection label,
			String positionString,
			double rotation,
			double labelHeight) {

		double offset = getPxLength(labelOffset);
		double tickOffset = getPxLength(axis.tickLabels.offset);

		double graphWidth = getPxLength(graph.data.width);
		double graphHeight = getPxLength(graph.data.height);

		Double tickLabelHeight = axis.tickLabels.getTickLabelHeight();

		double x = 0.0;
		if (positionString.equals("centre")) {
			x = graphWidth / 2;
		} else if (positionString.equals("at-maximum")) {
			x = graphWidth;
		}

		double y = graphHeight + tickOffset + tickLabelHeight + offset + labelHeight;
		applyTransformation(label, x, y, rotation);
	}

	determineLabelHeight(BoundingBox boundingBox) {
		double svgLabelHeight = boundingBox.getHeight();

		String fontName = font.get();
		String fontSizeString = size.get();
		int fontSize = (int) Double.parseDouble(fontSizeString);
		double awtTextHeight = AbstractGraphicsAtom.estimateTextHeight(fontName, fontSize);

		double height = Math.max(svgLabelHeight, awtTextHeight);
		return height;
	}

	applyTransformation(Selection tickLabels, double x, double y, double rotation) {
		String transformString = "translate(" + x + "," + y + "),rotate(" + rotation + ")";
		tickLabels.attr("transform", transformString);
	}

	getPxLength(Attribute<String> attribute) {
		String stringValue = attribute.get();
		Double doubleValue = Length.toPx(stringValue);
		return doubleValue;
	}

	//#end region

}
