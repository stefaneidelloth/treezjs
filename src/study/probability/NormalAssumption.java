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
 * Represents an assumption with a normal probability distribution.
 */
@SuppressWarnings("checkstyle:visibilitymodifier")
public class NormalAssumption extends AbstractAssumption {

	//#region ATTRIBUTES

	public final Attribute<String> functionPlotter = new Wrap<>();

	private FunctionPlotter plotter;

	public final Attribute<String> mean = new Wrap<>();

	public final Attribute<String> standardDeviation = new Wrap<>();

	//#end region

	//#region CONSTRUCTORS

	public NormalAssumption(String name) {
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

		//mean
		TextField meanField = data.createTextField(mean, this, "0");
		meanField.setLabel("Mean value");
		meanField.addModificationConsumer("plotProbability", () -> {
			plotProbability(mean.get(), standardDeviation.get());
		});

		//standard deviation
		TextField standardDeviationField = data.createTextField(standardDeviation, this, "1");
		standardDeviationField.setLabel("Standard deviation");
		standardDeviationField.addModificationConsumer("plotProbability", () -> {
			plotProbability(mean.get(), standardDeviation.get());
		});

		//function plotter
		plotter = data.createFunctionPlotter(functionPlotter, this);
		plotter.setLabel("Plotter");

		setModel(root);
	}

	@Override
	protected void afterCreateControlAdaptionHook() {
		plotProbability(mean.get(), standardDeviation.get());
	}

	@SuppressWarnings("checkstyle:illegalcatch")
	private void plotProbability(String meanValueString, String stdValueString) {
		try {
			Double meanValue = Double.parseDouble(meanValueString);
			Double stdValue = Double.parseDouble(stdValueString);

			String expression = "1/( (" + stdValue + ")*sqrt(2*" + Math.PI + ") ) *" //
					+ " exp(   -(x-(" + meanValue + "))^2  /  ( 2*(" + stdValue + ")^2 )   )";

			String customExpression = "[{fn: '" + expression + "', closed: true }]";

			final int xLimitFactor = 3;
			Double xMmin = meanValue - xLimitFactor * stdValue;
			Double xMax = meanValue + xLimitFactor * stdValue;

			final double yLimitFactor = 0.1;
			Double yMaxValue = 1.0 / (stdValue * Math.sqrt(2 * Math.PI));
			Double yMmin = -yLimitFactor * yMaxValue;
			Double yMax = yMaxValue * (1 + yLimitFactor);

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
		return Activator.getImage("normalAssumption.png");
	}

	//#end region

}
