package org.treez.results.atom.graphicsPage;

import org.treez.core.atom.attribute.attributeContainer.AttributeRoot;
import org.treez.core.atom.attribute.attributeContainer.Page;
import org.treez.core.atom.attribute.attributeContainer.section.Section;
import org.treez.core.atom.base.AbstractAtom;
import org.treez.core.atom.graphics.AbstractGraphicsAtom;
import org.treez.core.atom.graphics.GraphicsPropertiesPageFactory;
import org.treez.core.attribute.Attribute;
import org.treez.core.attribute.Wrap;
import org.treez.javafxd3.d3.D3;
import org.treez.javafxd3.d3.core.Selection;

@SuppressWarnings("checkstyle:visibilitymodifier")
public class Background implements GraphicsPropertiesPageFactory {

	//#region ATTRIBUTES

	public final Attribute<String> color = new Wrap<>();

	//public final Attribute<String> fillStyle = new Wrap<>();

	public final Attribute<String> transparency = new Wrap<>();

	public final Attribute<Boolean> hide = new Wrap<>();

	//#end region

	//#region METHODS

	@Override
	public void createPage(AttributeRoot root, AbstractAtom<?> parent) {

		Page backgroundPage = root.createPage("background", "Background");

		Section background = backgroundPage.createSection("background", "Background");

		background.createColorChooser(color, this, "white");

		//background.createFillStyle(fillStyle, "style", "Style");

		background.createTextField(transparency, this, "0");

		background.createCheckBox(hide, this);
	}

	@Override
	public Selection plotWithD3(D3 d3, Selection parentSelection, Selection rectSelection, AbstractGraphicsAtom parent) {

		AbstractGraphicsAtom.bindStringAttribute(rectSelection, "fill", color);

		transparency.addModificationConsumerAndRun("updateTransparency", () -> {
			try {
				double fillTransparency = Double.parseDouble(transparency.get());
				double opacity = 1 - fillTransparency;
				rectSelection.attr("fill-opacity", "" + opacity);
			} catch (NumberFormatException exception) {}
		});

		hide.addModificationConsumerAndRun("hideFill", () -> {
			try {
				boolean doHide = hide.get();
				if (doHide) {
					rectSelection.attr("fill-opacity", "0");
				} else {
					double fillTransparency = Double.parseDouble(transparency.get());
					double opacity = 1 - fillTransparency;
					rectSelection.attr("fill-opacity", "" + opacity);
				}
			} catch (NumberFormatException exception) {

			}
		});

		return parentSelection;
	}

	//#end region

}
