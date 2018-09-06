package org.treez.results.atom.contour;

import org.treez.core.atom.attribute.attributeContainer.AttributeRoot;
import org.treez.core.atom.attribute.attributeContainer.Page;
import org.treez.core.atom.attribute.attributeContainer.section.Section;
import org.treez.core.atom.attribute.checkBox.CheckBox;
import org.treez.core.atom.attribute.checkBox.CheckBoxEnableTarget;
import org.treez.core.atom.attribute.color.ColorChooser;
import org.treez.core.atom.attribute.comboBox.enumeration.EnumComboBox;
import org.treez.core.atom.base.AbstractAtom;
import org.treez.core.atom.graphics.AbstractGraphicsAtom;
import org.treez.core.atom.graphics.GraphicsPropertiesPageFactory;
import org.treez.core.attribute.Attribute;
import org.treez.core.attribute.Consumer;
import org.treez.core.attribute.Wrap;
import org.treez.javafxd3.d3.D3;
import org.treez.javafxd3.d3.core.Selection;
import org.treez.javafxd3.plotly.data.contour.Coloring;

@SuppressWarnings("checkstyle:visibilitymodifier")
public class Data implements GraphicsPropertiesPageFactory {

	//#regionATTRIBUTES

	public final Attribute<String> xData = new Wrap<>();

	public final Attribute<String> yData = new Wrap<>();

	public final Attribute<String> zData = new Wrap<>();

	public final Attribute<Boolean> automaticZLimits = new Wrap<>();

	public final Attribute<Double> zMin = new Wrap<>();

	public final Attribute<Double> zMax = new Wrap<>();

	public final Attribute<Boolean> automaticContours = new Wrap<>();

	public final Attribute<Coloring> coloring = new Wrap<>();

	public final Attribute<Integer> numberOfContours = new Wrap<>();

	public final Attribute<Double> startLevel = new Wrap<>();

	public final Attribute<Double> endLevel = new Wrap<>();

	public final Attribute<Double> levelSize = new Wrap<>();

	public final Attribute<Boolean> connectGaps = new Wrap<>();

	//public finalAttribute<String>labels=newWrap<>();

	public final Attribute<String> xAxis = new Wrap<>();

	public final Attribute<String> yAxis = new Wrap<>();

	//#endregion

	//#regionMETHODS

	@Override
	@SuppressWarnings("checkstyle:magicnumber")
	public void createPage(AttributeRoot root, AbstractAtom<?> parent) {

		Page dataPage = root.createPage("data", "Data");

		//data

		Section dataSection = dataPage.createSection("data", "Data");

		Class<?> targetClass = org.treez.data.column.Column.class;
		String value = "root.data.table.columns.x";
		dataSection.createModelPath(xData, this, value, targetClass, parent)//
				.setLabel("x-Data");

		value = "root.data.table.columns.y";
		dataSection.createModelPath(yData, this, value, targetClass, parent)//
				.setLabel("y-Data");

		value = "root.data.table.columns.z";
		dataSection.createModelPath(zData, this, value, targetClass, parent)//
				.setLabel("z-Data");

		dataSection.createCheckBox(connectGaps, this, true).setLabel("Connect gaps");

		//axis
		Section axisSection = dataPage.createSection("axis", "Axis");

		targetClass = org.treez.results.atom.axis.Axis.class;
		value = "";
		axisSection.createModelPath(xAxis, this, value, targetClass, parent)//
				.setLabel("Xaxis");

		axisSection.createModelPath(yAxis, this, value, targetClass, parent)//
				.setLabel("Yaxis");

		//zLimits
		Section zLimits = dataPage.createSection("zLimits", "zLimits");
		zLimits.setLabel("z-Limits");

		CheckBox autoZLimitsCheckBox = zLimits.createCheckBox(automaticZLimits, this, true);
		autoZLimitsCheckBox.setLabel("Automatic z limits");
		autoZLimitsCheckBox.addChild(new CheckBoxEnableTarget("zMin", false, "data.zLimits.zMin"));
		autoZLimitsCheckBox.addChild(new CheckBoxEnableTarget("zMax", false, "data.zLimits.zMax"));

		zLimits.createDoubleVariableField(zMin, this, 0.0).setEnabled(false);
		zLimits.createDoubleVariableField(zMax, this, 1.0).setEnabled(false);

		//contours
		Section contours = dataPage.createSection("contours", "z-Limits");

		CheckBox autoContourCheckBox = contours.createCheckBox(automaticContours, this, true);
		autoContourCheckBox.setLabel("Automatic contours");
		autoContourCheckBox.addChild(new CheckBoxEnableTarget("coloring", false, "data.contours.coloring"));
		autoContourCheckBox
				.addChild(new CheckBoxEnableTarget("numberOfContours", true, "data.contours.numberOfContours"));
		autoContourCheckBox.addChild(new CheckBoxEnableTarget("startLevel", false, "data.contours.startLevel"));
		autoContourCheckBox.addChild(new CheckBoxEnableTarget("endLevel", false, "data.contours.endLevel"));
		autoContourCheckBox.addChild(new CheckBoxEnableTarget("levelSize", false, "data.contours.levelSize"));

		contours.createIntegerVariableField(numberOfContours, this, 5);

		EnumComboBox<?> coloringComboBox = contours.createEnumComboBox(coloring, this, Coloring.FILL);
		coloringComboBox.setLabel("Coloring mode");
		coloringComboBox.setEnabled(false);

		Contour contour = (Contour) parent;

		coloring.addModificationConsumer("enableOrDisableLineColor", () -> {
			Wrap<?> wrap = (Wrap<?>) contour.lines.color;
			ColorChooser colorChooser = (ColorChooser) wrap.getAttribute();
			boolean isLinesMode = coloring.get().equals(Coloring.LINES.toString());
			colorChooser.setEnabled(!isLinesMode);
		});

		contours.createDoubleVariableField(startLevel, this, 0.0).setEnabled(false);
		contours.createDoubleVariableField(endLevel, this, 10.0).setEnabled(false);
		contours.createDoubleVariableField(levelSize, this, 2.0).setEnabled(false);

	}

	@Override
	@SuppressWarnings("checkstyle:magicnumber")
	public Selection plotWithD3(
			D3 d3,
			Selection contourSelection,
			Selection rectSelection,
			AbstractGraphicsAtom parent) {

		Contour contour = (Contour) parent;

		Consumer dataChangedConsumer = () -> {
			contour.updatePlotWithD3(d3);
		};
		xData.addModificationConsumer("replot", dataChangedConsumer);

		//TODO: other listeners

		xAxis.addModificationConsumer("replot", dataChangedConsumer);
		yAxis.addModificationConsumer("replot", dataChangedConsumer);

		return contourSelection;
	}

	//#end region

}
