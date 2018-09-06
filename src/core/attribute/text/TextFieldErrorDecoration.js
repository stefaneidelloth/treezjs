default export class TextFieldErrorDecoration  {

	//#region ATTRIBUTES

	private Control parentControl;

	private Composite parentComposite;

	/**
	 * The message (prefix) that is shown. Additional information might be added
	 * by the show(extraMessage) method.
	 */
	private String basicMessage;

	//#end region

	//#region CONSTRUCTORS

	public TextFieldErrorDecoration(Control parentControl, String message,
			Composite parent) {
		super(parentControl, SWT.RIGHT, parent);
		this.parentControl = parentControl;
		this.basicMessage = message;
		this.parentComposite = parent;
		initialize(basicMessage);
	}

	/**
	 * Copy Constructor
	 */
	private TextFieldErrorDecoration(
			TextFieldErrorDecoration decorationToCopy) {
		super(decorationToCopy.parentControl, SWT.TOP,
				decorationToCopy.parentComposite);
		this.parentControl = decorationToCopy.parentControl;
		this.basicMessage = decorationToCopy.basicMessage;
		this.parentComposite = decorationToCopy.parentComposite;
		initialize(basicMessage);
	}

	//#end region

	//#region METHODS

	@Override
	public TextFieldErrorDecoration copy() {
		return new TextFieldErrorDecoration(this);
	}

	private void initialize(String message) {
		this.setDescriptionText(message);
		this.setMarginWidth(1);
		Image image = FieldDecorationRegistry.getDefault()
				.getFieldDecoration(FieldDecorationRegistry.DEC_ERROR)
				.getImage();
		this.setImage(image);
		this.hide();
	}

	/**
	 * Shows the default validation message plus an extra message
	 *
	 * @param extraMessage
	 */
	public void show(String extraMessage) {
		String completeMessage = basicMessage + extraMessage;
		setDescriptionText(completeMessage);
		show();
	}

	@Override
	public void show() {
		super.show();
		final Color errorColor = new Color(parentControl.getDisplay(), 250, 200,
				128);
		parentControl.setBackground(errorColor);
	}

	@Override
	public void hide() {
		super.hide();
		setDescriptionText(basicMessage);
		final Color normalColor = new Color(parentControl.getDisplay(), 255,
				255, 255);
		parentControl.setBackground(normalColor);
	}
	//#end region

}
