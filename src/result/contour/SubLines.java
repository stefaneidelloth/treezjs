package org.treez.results.atom.contour;

import org.treez.core.adaptable.Refreshable;
import org.treez.core.atom.attribute.attributeContainer.AttributeRoot;
import org.treez.core.atom.attribute.attributeContainer.Page;
import org.treez.core.atom.attribute.attributeContainer.section.Section;
import org.treez.core.atom.base.AbstractAtom;
import org.treez.core.atom.graphics.AbstractGraphicsAtom;
import org.treez.core.atom.graphics.GraphicsPropertiesPageFactory;
import org.treez.core.attribute.Attribute;
import org.treez.core.attribute.Consumer;
import org.treez.core.attribute.Wrap;
import org.treez.javafxd3.d3.D3;
import org.treez.javafxd3.d3.core.Selection;

@SuppressWarnings("checkstyle:visibilitymodifier")
public class SubLines implements GraphicsPropertiesPageFactory {

	//#region ATTRIBUTES

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

		line.createColorChooser(color, this, "black");

		line.createTextField(width, this, "3");

		line.createLineStyle(style, this, "solid");

		line.createDoubleVariableField(transparency, this, 0.0);

		line.createCheckBox(hide, this);
	}

	@Override
	public Selection plotWithD3(D3 d3, Selection barSelection, Selection rectSelection, AbstractGraphicsAtom parent) {
		/*

		Selection rectsSelection = barSelection //
				.select(".bar-rects") //
				.selectAll("rect");

		GraphicsAtom.bindStringAttribute(rectsSelection, "stroke", color);
		GraphicsAtom.bindStringAttribute(rectsSelection, "stroke-width", width);
		GraphicsAtom.bindLineStyle(rectsSelection, style);
		GraphicsAtom.bindLineTransparency(rectsSelection, transparency);
		GraphicsAtom.bindLineTransparencyToBooleanAttribute(rectsSelection, hide, transparency);
		*/

		return barSelection;
	}

	public Selection formatLegendSymbolLine(Selection symbolSelection, Refreshable refreshable) {

		AbstractGraphicsAtom.bindStringAttribute(symbolSelection, "stroke", color);
		AbstractGraphicsAtom.bindStringAttribute(symbolSelection, "stroke-width", width);
		AbstractGraphicsAtom.bindLineStyle(symbolSelection, style);
		AbstractGraphicsAtom.bindLineTransparency(symbolSelection, transparency);
		AbstractGraphicsAtom.bindLineTransparencyToBooleanAttribute(symbolSelection, hide, transparency);

		Consumer replotLegend = () -> refreshable.refresh();
		width.addModificationConsumer("lineWidthLegendSymbol", replotLegend);

		return symbolSelection;
	}

	//#end region

}
