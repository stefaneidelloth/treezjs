package org.treez.study.atom.probability;

import java.util.Objects;

import org.eclipse.swt.graphics.Image;
import org.treez.core.atom.attribute.attributeContainer.AttributeRoot;
import org.treez.core.atom.attribute.attributeContainer.Page;
import org.treez.core.atom.attribute.modelPath.ModelPath;
import org.treez.core.atom.attribute.modelPath.ModelPathSelectionType;
import org.treez.core.atom.attribute.plot.FunctionPlotter;
import org.treez.core.atom.attribute.text.TextField;
import org.treez.core.atom.base.AbstractAtom;
import org.treez.core.atom.variablefield.DoubleVariableField;
import org.treez.core.attribute.Attribute;
import org.treez.core.attribute.AttributeWrapper;
import org.treez.core.attribute.Wrap;
import org.treez.study.Activator;

/**
 * Represents an assumption with an equal probability distribution.
 */
@SuppressWarnings("checkstyle:visibilitymodifier")
public class EqualAssumption extends AbstractAssumption {

	//#region ATTRIBUTES

	public final Attribute<String> functionPlotter = new Wrap<>();

	private FunctionPlotter plotter;

	public final Attribute<String> min = new Wrap<>();

	public final Attribute<String> max = new Wrap<>();

	//#end region

	//#region CONSTRUCTORS

	public EqualAssumption(String name) {
		super(name);
		createNormalAssumptionModel();
	}

	//#end region

	//#region METHODS

	/**
	 * Creates the underlying model
	 */
	private void createNormalAssumptionModel() {
		// root, page and section
		AttributeRoot root = new AttributeRoot("root");
		Page dataPage = root.createPage("data", "   Data   ");

		String relativeHelpContextId = "normal";
		String absoluteHelpContextId = Activator.getInstance().getAbsoluteHelpContextId(relativeHelpContextId);

		data = dataPage.createSection("normal", absoluteHelpContextId);

		//source variable
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

		//min
		TextField minField = data.createTextField(min, this, "0");
		minField.addModificationConsumer("plotProbability", () -> {
			plotProbability(min.get(), max.get());
		});

		//max
		TextField maxField = data.createTextField(max, this, "1");
		maxField.addModificationConsumer("plotProbability", () -> {
			plotProbability(min.get(), max.get());
		});

		//function plotter
		plotter = data.createFunctionPlotter(functionPlotter, this);
		plotter.setLabel("Plotter");

		//thumbnail plot
		setModel(root);
	}

	@Override
	protected void afterCreateControlAdaptionHook() {
		plotProbability(min.get(), max.get());
	}

	@SuppressWarnings("checkstyle:illegalcatch")
	private void plotProbability(String minValueString, String maxValueString) {
		try {
			Double minValue = Double.parseDouble(minValueString);
			Double maxValue = Double.parseDouble(maxValueString);

			Double distance = maxValue - minValue;
			Double probability = 1 / (distance);

			String customExpression = "[{fn: '" + probability + "', range: [" + minValue + ", " + maxValue
					+ "], closed: true }]";

			final double xLimitFactor = 0.1;
			Double xMmin = minValue - xLimitFactor * distance;
			Double xMax = maxValue + xLimitFactor * distance;

			final double yLimitFactor = 0.1;

			Double yMmin = -yLimitFactor * probability;
			Double yMax = probability * (1 + yLimitFactor);

			plotter.setXDomain(xMmin, xMax);
			plotter.setYDomain(yMmin, yMax);
			plotter.plotCustomExpression(customExpression);
		} catch (Exception exception) {
			plotter.showError();
		}

	}

	/**
	 * Changes the model path selection for the source variable to use the source model as relative root
	 */
	@Override
	protected void assignRealtiveRootToSourceVariablePath() {
		Objects.requireNonNull(sourceModelModelPath, "Source model path must not be null when calling this function.");
		data.setLabel("Data for " + sourceModelModelPath);
		AbstractAtom<?> relativeRootAtom = this.getChildFromRoot(sourceModelModelPath);
		AttributeWrapper<String> pathWrapper = (AttributeWrapper<String>) sourceVariableModelPath;
		ModelPath modelPath = (ModelPath) pathWrapper.getAttribute();
		modelPath.setModelRelativeRoot(relativeRootAtom);
	}

	/**
	 * Provides an image to represent this atom
	 */
	@Override
	public Image provideImage() {
		return Activator.getImage("equalAssumption.png");
	}

	//#end region

}
