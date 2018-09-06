export default class ColorChooser extends StringAttributeAtom {

	

	constructor(name, defaultValue) {
		super(name);
		this.label = Utils.firstToUpperCase(name);
        this.defaultValue = defaultValue;
       	this.tooltip=undefined;
		this.colors = ColorValue.getAllStringValues();
		this. colorsHex = ColorValue.getAllHexCodes();
	}

	copy() {
		var newAtom = new ColorChooser(this.name);
		newAtom.label = this.label;
  		newAtom.defaultValue = this.defaultValue;
       	newAtom..tooltip = this.tooltip;		
		return newAtom;
	}

	provideImageName() {
		return "ColorChooser.png";
	}


	createAttributeAtomControl(sectionBody, treeViewerRefreshable) {

		var div = sectionBody.append("div");

		var labelSelection = div //
				.append("label") //
				.attr("for", name)
				.style("margin-right", "5px")
				.style("font-size", AtomControlAdaption.DEFAULT_FONT_SIZE);

		labelSelection.text(label);

		var colorChooser = div //
				.append("input") //
				.attr("id", name)
				.attr("type", "color")
				.style("height", "20px")
				.style("margin-right", "5px")
				.style("vertical-align", "middle");

		colorChooser //
				.attr("value", get());

		var colorCombo = div //
				.append("select") //
				.style("height", "20px")
				.style("vertical-align", "middle");

		
		var colorString = this.colors[0];
		var hexColor = this.colorsHex[2];
		var iconUrl = colorString + ".png";

		//for (String colorString : currentColors) {
		//	colorCombo.add(colorString, Activator.getImage(colorString + ".png"));
		//}
		//colorCombo.add("#custom#", null);

		colorCombo.selectAll("optgroup")
				.data(colors.toArray()) //
				.enter() //
				.append("optgroup") //
				.attr("value", new DirectDataFunction<Object>())
				.style("background-color", hexColor)
				.text(new DirectDataFunction<String>());
		colorCombo.attr("value", get());

		return this;
	}

	initializeSelectedItem(final List<String> currentColors, final List<String> currentColorsHex) {
		String colorHex = get();
		boolean colorExists = currentColorsHex.contains(colorHex);
		if (colorExists) {
			//select value from existing colors in combo box
			int index = currentColorsHex.indexOf(colorHex);
			colorCombo.select(index);
		} else {
			//select #selector#
			int index = currentColors.size();
			colorCombo.select(index);
		}
	}

	/**
	 * Creates the listener for the color combo box
	 */
	createColorComboSelectionListener(colorSelector, currentColors, currentColorsHex) {
		return new SelectionAdapter() {

			@SuppressWarnings("synthetic-access")
			@Override
			public void widgetSelected(SelectionEvent e) {
				int index = colorCombo.getSelectionIndex();
				if (index < currentColors.size()) {
					//apply value from combo box and update value button
					String colorHex = currentColorsHex.get(index);
					set(colorHex);
					RGB rgb = getColorRgb();
					colorSelector.setColorValue(rgb);
				} else {
					//apply value from button
					RGB color = colorSelector.getColorValue();
					setColorRGB(color);
				}

				//trigger modification listeners
				triggerListeners();
			}
		};
	}

	/**
	 * Creates the listener for the color button
	 */
	createColorButtonSelectionListener(colorSelector) {
		return new SelectionAdapter() {

			@Override
			public void widgetSelected(SelectionEvent e) {
				//apply value
				RGB color = colorSelector.getColorValue();
				setColorRGB(color);

				refreshAttributeAtomControl();
			}
		};
	}

	refreshAttributeAtomControl() {
		//update combo box
		if (isAvailable(colorCombo)) {
			var currentColorHex = get();
			var colorExists = this.colorsHex.contains(currentColorHex);
			if (colorExists) {
				//select value from existing colors in combo box
				var index = this.colorsHex.indexOf(currentColorHex);
				if (colorCombo.getSelectionIndex() != index) {
					colorCombo.select(index);
				}
			} else {
				//select #selector#
				var index = colors.size();
				if (colorCombo.getSelectionIndex() != index) {
					colorCombo.select(index);
				}
			}
		}
	}

	
	/**
	 * @param defaultColor
	 *            :hex color string or color name
	 */
	setDefaultValue(defaultColor) {

		var isHexColor = defaultColor.substring(0, 1).equals("#");
		if (isHexColor) {
			this.attributeValue = defaultColor;
		} else {
			if (colors.contains(defaultColor)) {
				var index = colors.indexOf(defaultColor);
				this.attributeValue = colorsHex.get(index);
			} else {
				throw new Error("The specified value '" + defaultColor + "' is not know.");
			}
		}

		this.defaultValue = attributeValue;
		return this;
	}

	

	set(value) {
		var isHexColor = value.substring(0, 1).equals("#");
		if (isHexColor) {
			super.set(value);
		} else {
			var isTextColor = colors.contains(value);
			if (isTextColor) {
				var hexColor = ColorValue.getHexCode(value);
				super.set(hexColor);
			} else {
				throw new Error("The string '" + value + "' could not be interpreted as color.");
			}
		}
		return this;
	}

	setEnabled(state) {
		super.setEnabled(state);
		if (isAvailable(colorCombo)) {
			colorCombo.setEnabled(state);
		}
		if (isAvailable(colorButton)) {
			colorButton.setEnabled(state);
		}
		if (treeViewRefreshable != null) {
			//treeViewRefreshable.refresh(); //creates flickering when targets are updated
		}
		refreshAttributeAtomControl();
		return getThis();

	}

	

}
