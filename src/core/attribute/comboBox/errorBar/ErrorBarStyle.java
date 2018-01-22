package org.treez.core.atom.attribute.comboBox.errorBar;

import java.util.List;

import org.eclipse.swt.SWT;
import org.eclipse.swt.events.SelectionAdapter;
import org.eclipse.swt.events.SelectionEvent;
import org.eclipse.swt.graphics.Image;
import org.eclipse.swt.layout.GridData;
import org.eclipse.swt.layout.GridLayout;
import org.eclipse.swt.widgets.Display;
import org.eclipse.swt.widgets.Label;
import org.eclipse.ui.forms.widgets.FormToolkit;
import org.treez.core.Activator;
import org.treez.core.adaptable.FocusChangingRefreshable;
import org.treez.core.adaptable.composite.GridComposite;
import org.treez.core.atom.attribute.base.AbstractAttributeAtom;
import org.treez.core.atom.attribute.base.AbstractStringAttributeAtom;
import org.treez.core.atom.attribute.comboBox.image.ImageCombo;
import org.treez.core.atom.base.annotation.IsParameter;
import org.treez.core.swt.CustomLabel;
import org.treez.javafxd3.d3.core.Selection;
import org.treez.javafxd3.javafx.Browser;

/**
 * Allows the user to choose a error bar style
 */
public class ErrorBarStyle extends AbstractStringAttributeAtom<ErrorBarStyle> {

	//#region ATTRIBUTES

	@IsParameter(defaultValue = "My Error Bar Style:")
	private String label;

	@IsParameter(defaultValue = "bar")
	private String defaultValue;

	@IsParameter(defaultValue = "")
	private String tooltip;

	private ImageCombo styleCombo = null;

	private Label imageLabel = null;

	private final String imagePrefix = "errorbar_";

	/**
	 * Predefined error bar styles
	 */
	private final List<String> errorBarStyles = ErrorBarStyleValue.getAllStringValues();

	//#end region

	//#region CONSTRUCTORS

	public ErrorBarStyle(String name) {
		super(name);
		label = name;
	}

	public ErrorBarStyle(String name, String defaultStyle) {
		super(name);
		label = name;

		boolean isErrorBarStyle = errorBarStyles.contains(defaultStyle);
		if (isErrorBarStyle) {
			attributeValue = defaultStyle;
		} else {
			throw new IllegalArgumentException("The specified error bar style '" + defaultStyle + "' is not known.");
		}
	}

	/**
	 * Copy constructor
	 */
	private ErrorBarStyle(ErrorBarStyle errorBarStyleToCopy) {
		super(errorBarStyleToCopy);
		label = errorBarStyleToCopy.label;
		defaultValue = errorBarStyleToCopy.defaultValue;
		tooltip = errorBarStyleToCopy.tooltip;
	}

	//#end region

	//#region METHODS

	@Override
	public ErrorBarStyle getThis() {
		return this;
	}

	@Override
	public ErrorBarStyle copy() {
		return new ErrorBarStyle(this);
	}

	@Override
	public Image provideImage() {
		return Activator.getImage("errorbar_bar.png");
	}

	@Override
	public AbstractStringAttributeAtom<ErrorBarStyle> createAttributeAtomControl(
			GridComposite parent,
			FocusChangingRefreshable treeViewerRefreshable) {

		//initialize value at the first call
		if (!isInitialized()) {
			set(defaultValue);
		}

		//toolkit
		FormToolkit toolkit = new FormToolkit(Display.getCurrent());

		GridComposite container = createContainer(parent);
		container.setVisible(isVisible());

		//label
		String currentLabel = getLabel();
		CustomLabel labelComposite = new CustomLabel(toolkit, container, currentLabel);
		final int preferredLabelWidth = 80;
		labelComposite.setPrefferedWidth(preferredLabelWidth);

		//image label
		imageLabel = toolkit.createLabel(container, "");

		//combo box
		styleCombo = new ImageCombo(container, SWT.DEFAULT);
		styleCombo.setEnabled(isEnabled());
		styleCombo.setEditable(false);

		//set predefined styles
		final List<String> styles = getErrorBarStyles();
		for (String styleString : styles) {
			styleCombo.add(styleString, Activator.getImage(imagePrefix + styleString + ".png"));
		}

		//initialize selected item
		refreshAttributeAtomControl();

		//action listener for combo box
		styleCombo.addSelectionListener(new SelectionAdapter() {

			@SuppressWarnings("synthetic-access")
			@Override
			public void widgetSelected(SelectionEvent e) {
				int index = styleCombo.getSelectionIndex();
				String currentStyle = styles.get(index);
				set(currentStyle);
				imageLabel.setImage(Activator.getImage(imagePrefix + currentStyle + ".png"));

				//trigger modification listeners
				triggerListeners();
			}
		});

		return this;

	}

	@Override
	public AbstractAttributeAtom<ErrorBarStyle, String> createAttributeAtomControl(
			Browser browser,
			Selection sectionBody,
			FocusChangingRefreshable treeViewerRefreshable) {
		//TODO Auto-generated method stub
		return null;
	}

	@SuppressWarnings("checkstyle:magicnumber")
	private static GridComposite createContainer(GridComposite parent) {
		//create grid data to use all horizontal space
		GridData fillHorizontal = new GridData();
		fillHorizontal.grabExcessHorizontalSpace = true;
		fillHorizontal.horizontalAlignment = GridData.FILL;

		//create container control for labels and line style
		GridComposite container = new GridComposite(parent);
		GridLayout gridLayout = new GridLayout(3, false);
		gridLayout.horizontalSpacing = 10;
		container.setLayout(gridLayout);
		container.setLayoutData(fillHorizontal);
		return container;
	}

	@Override
	public void refreshAttributeAtomControl() {
		if (isAvailable(styleCombo)) {
			String style = get();
			List<String> styles = getErrorBarStyles();
			int index = styles.indexOf(style);
			if (styleCombo.getSelectionIndex() != index) {
				styleCombo.select(index);
				imageLabel.setImage(Activator.getImage(imagePrefix + style + ".png"));
			}
		}
	}

	@Override
	public ErrorBarStyle setBackgroundColor(org.eclipse.swt.graphics.Color backgroundColor) {
		throw new IllegalStateException("Not yet implemented");

	}

	//#end region

	//#region ACCESSORS

	public String getLabel() {
		return label;
	}

	public ErrorBarStyle setLabel(String label) {
		this.label = label;
		return getThis();
	}

	@Override
	public String getDefaultValue() {
		return defaultValue;
	}

	public ErrorBarStyle setDefaultValue(String defaultValue) {
		this.defaultValue = defaultValue;
		return getThis();
	}

	public ErrorBarStyle setDefaultValue(ErrorBarStyleValue defaultStyle) {
		return setDefaultValue(defaultStyle.toString());
	}

	public String getTooltip() {
		return tooltip;
	}

	public ErrorBarStyle setTooltip(String tooltip) {
		this.tooltip = tooltip;
		return getThis();
	}

	public List<String> getErrorBarStyles() {
		return errorBarStyles;
	}

	//#end region

}
