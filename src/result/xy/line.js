package org.treez.results.atom.xy;

import java.util.List;

import org.treez.core.atom.attribute.attributeContainer.AttributeRoot;
import org.treez.core.atom.attribute.attributeContainer.Page;
import org.treez.core.atom.attribute.attributeContainer.section.Section;
import org.treez.core.atom.base.AbstractAtom;
import org.treez.core.atom.graphics.AbstractGraphicsAtom;
import org.treez.core.atom.graphics.GraphicsPropertiesPageFactory;
import org.treez.core.attribute.Attribute;
import org.treez.core.attribute.Wrap;
import org.treez.javafxd3.d3.D3;
import org.treez.javafxd3.d3.core.JsEngine;
import org.treez.javafxd3.d3.core.Selection;
import org.treez.javafxd3.d3.functions.data.axis.AxisScaleFirstDataFunction;
import org.treez.javafxd3.d3.functions.data.axis.AxisScaleSecondDataFunction;
import org.treez.javafxd3.d3.scales.Scale;

@SuppressWarnings("checkstyle:visibilitymodifier")
public class Line implements GraphicsPropertiesPageFactory {

	//#region ATTRIBUTES

	public final Attribute<org.treez.javafxd3.d3.svg.InterpolationMode> interpolation = new Wrap<>();

	//public final Attribute<Boolean> bezierJoin = new Wrap<>();

	public final Attribute<String> color = new Wrap<>();

	public final Attribute<String> width = new Wrap<>();

	public final Attribute<String> style = new Wrap<>();

	public final Attribute<Double> transparency = new Wrap<>();

	public final Attribute<Boolean> hide = new Wrap<>();

	//#end region

	//#region METHODS

	@Override
	public void createPage(AttributeRoot root, AbstractAtom<?> parent) {

		Page linePage = root.createPage("line", "   Line    ");

		Section line = linePage.createSection("line");

		line.createEnumComboBox(interpolation, this, org.treez.javafxd3.d3.svg.InterpolationMode.LINEAR);

		//line.createCheckBox(bezierJoin, this).setLabel("Bezier join");

		line.createColorChooser(color, this, "black");

		line.createTextField(width, this, "3");

		line.createLineStyle(style, this, "solid");

		line.createDoubleVariableField(transparency, this, 0.0);

		line.createCheckBox(hide, this);
	}

	@Override
	public Selection plotWithD3(D3 d3, Selection xySelection, Selection rectSelection, AbstractGraphicsAtom parent) {

		String parentName = parent.getName();
		String id = "lines_" + parentName;

		//remove old line group if it already exists
		xySelection //
				.selectAll("#" + id) //
				.remove();

		//create new line group
		Selection linesSelection = xySelection //
				.append("g") //
				.attr("id", id) //
				.attr("class", "lines");

		//get xy parent
		Xy xy = (Xy) parent;

		//get interpolation mode

		org.treez.javafxd3.d3.svg.InterpolationMode mode = interpolation.get();

		//line path generator
		Scale<?> xScale = xy.getXScale();
		Scale<?> yScale = xy.getYScale();

		JsEngine engine = xySelection.getJsEngine();

		org.treez.javafxd3.d3.svg.Line linePathGenerator = d3 //
				.svg()//
				.line()
				.x(new AxisScaleFirstDataFunction(engine, xScale))
				.y(new AxisScaleSecondDataFunction(engine, yScale))//
				.interpolate(mode);

		//plot new lines
		List<Object> xDataValues = xy.getXValues();
		List<Object> yDataValues = xy.getYValues();
		String xyDataString = xy.createXyDataString(xDataValues, yDataValues);

		Selection lines = linesSelection //
				.append("path") //
				.attr("d", linePathGenerator.generate(xyDataString))
				.attr("fill", "none");

		//bind attributes
		AbstractGraphicsAtom.bindDisplayToBooleanAttribute("hideLine", lines, hide);
		AbstractGraphicsAtom.bindStringAttribute(lines, "stroke", color);
		AbstractGraphicsAtom.bindStringAttribute(lines, "stroke-width", width);
		AbstractGraphicsAtom.bindLineTransparency(lines, transparency);
		AbstractGraphicsAtom.bindLineStyle(lines, style);

		interpolation.addModificationConsumer("replot", () -> {
			//if the line interpolation changes other stuff like the area
			//has to be updated as well
			//=> update the whole xy
			xy.updatePlotWithD3(d3);
		});

		return xySelection;
	}

	public Selection plotLegendLineWithD3(D3 d3, Selection parentSelection, int length) {

		org.treez.javafxd3.d3.svg.Line linePathGenerator = d3 //
				.svg()//
				.line();

		String path = linePathGenerator.generate("[[0,0],[" + length + ",0]]");

		Selection legendLine = parentSelection //
				.append("path") //
				.classed("legend-line", true)
				.attr("d", path)
				.attr("fill", "none");

		//bind attributes
		AbstractGraphicsAtom.bindDisplayToBooleanAttribute("hide", legendLine, hide);
		AbstractGraphicsAtom.bindStringAttribute(legendLine, "stroke", color);
		AbstractGraphicsAtom.bindStringAttribute(legendLine, "stroke-width", width);
		AbstractGraphicsAtom.bindLineTransparency(legendLine, transparency);
		AbstractGraphicsAtom.bindLineStyle(legendLine, style);

		return parentSelection;
	}

	//#end region

}
