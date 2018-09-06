package org.treez.study.atom.range;

import java.util.Arrays;
import java.util.List;

import org.eclipse.swt.graphics.Image;
import org.treez.core.atom.attribute.attributeContainer.AttributeRoot;
import org.treez.core.atom.attribute.attributeContainer.Page;
import org.treez.core.atom.attribute.modelPath.ModelPathSelectionType;
import org.treez.core.atom.base.AbstractAtom;
import org.treez.core.atom.variablefield.DoubleVariableField;
import org.treez.core.atom.variablelist.DoubleVariableListField;
import org.treez.study.Activator;

/**
 * Represents a variable range of Double values, might consist of one or several values. The parent must by a Study
 * (e.g. Sweep)
 */
public class DoubleVariableRange extends AbstractVariableRange<Double> {

	//#region ATTRIBUTES

	private DoubleVariableListField range;

	//#end region

	//#region CONSTRUCTORS

	public DoubleVariableRange(String name) {
		super(name);
	}

	//#end region

	//#region METHODS

	@Override
	protected void createVariableRangeModel() {
		// root, page and section
		AttributeRoot root = new AttributeRoot("root");
		Page dataPage = root.createPage("data", "   Data   ");
		data = dataPage.createSection("data");

		// source variable
		String defaultValue = "";
		ModelPathSelectionType selectionType = ModelPathSelectionType.FLAT;
		AbstractAtom<?> modelEntryPoint = this;
		boolean hasToBeEnabled = true;
		data
				.createModelPath(sourceVariableModelPath, this, defaultValue, DoubleVariableField.class, selectionType,
						modelEntryPoint, hasToBeEnabled)
				.setLabel("Double variable");
		boolean assignRelativeRoot = sourceModelModelPath != null && !sourceModelModelPath.isEmpty();
		if (assignRelativeRoot) {
			assignRealtiveRootToSourceVariablePath();
		}

		//range
		range = data.createDoubleVariableListField("range", "Range");

		//enabled check box
		createEnabledCheckBox();

		setModel(root);
	}

	@Override
	public Image provideImage() {
		Image baseImage = Activator.getImage("doubleVariableRange.png");
		Image image = decorateImageWidthEnabledState(baseImage);
		return image;
	}

	//#end region

	//#region ACCESSORS

	//#region RANGE VALUES

	/**
	 * Returns the range as a list of doubles
	 *
	 * @return
	 */
	@Override
	public List<Double> getRange() {
		return range.get();
	}

	/**
	 * Sets the given valueString as valueString of the range
	 *
	 * @param valueString
	 */
	@Override
	public void setRangeValueString(String valueString) {
		range.setValueString(valueString);
	}

	@Override
	public void setRange(Double... rangeValues) {
		range.set(Arrays.asList(rangeValues));
	}

	//#end region

	//#region TYPE

	@Override
	public Class<Double> getType() {
		return Double.class;
	}

	//#end region

	//#end region

}
