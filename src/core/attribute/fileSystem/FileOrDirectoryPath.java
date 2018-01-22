package org.treez.core.atom.attribute.fileSystem;

import org.eclipse.swt.SWT;
import org.eclipse.swt.events.ModifyEvent;
import org.eclipse.swt.events.ModifyListener;
import org.eclipse.swt.graphics.Image;
import org.eclipse.swt.graphics.Point;
import org.eclipse.swt.layout.GridData;
import org.eclipse.swt.layout.GridLayout;
import org.eclipse.swt.widgets.Composite;
import org.eclipse.swt.widgets.DirectoryDialog;
import org.eclipse.swt.widgets.Display;
import org.eclipse.swt.widgets.FileDialog;
import org.eclipse.swt.widgets.Label;
import org.eclipse.swt.widgets.Listener;
import org.eclipse.swt.widgets.Text;
import org.eclipse.ui.forms.widgets.FormToolkit;
import org.treez.core.Activator;
import org.treez.core.adaptable.FocusChangingRefreshable;
import org.treez.core.adaptable.composite.GridComposite;
import org.treez.core.atom.attribute.base.AbstractAttributeAtom;
import org.treez.core.atom.attribute.base.AbstractStringAttributeAtom;
import org.treez.core.atom.attribute.text.TextFieldErrorDecoration;
import org.treez.core.atom.base.annotation.IsParameter;
import org.treez.javafxd3.d3.core.Selection;
import org.treez.javafxd3.javafx.Browser;

/**
 * Allows the user to choose a file path or directory path
 */
public class FileOrDirectoryPath extends AbstractStringAttributeAtom<FileOrDirectoryPath> {

	//#region ATTRIBUTES

	@IsParameter(defaultValue = "File or folder:")
	private String label;

	@IsParameter(defaultValue = "C:\\")
	private String defaultValue;

	@IsParameter(defaultValue = "")
	private String tooltip;

	@IsParameter(defaultValue = "*.*")
	//comma separated file extensions, e.g. "*.txt,*.xls"
	private String fileExtensions;

	@IsParameter(defaultValue = "Any")
	//comma separated file names, e.g. "Rich Text Format,HTML Document,Any"
	private String fileExtensionNames;

	@IsParameter(defaultValue = "true")
	private Boolean showOpenButton;

	@IsParameter(defaultValue = "true")
	private Boolean validatePath;

	private Text textField = null;

	//#end region

	//#region CONSTRUCTORS

	public FileOrDirectoryPath(String name) {
		super(name);
		label = name;
	}

	public FileOrDirectoryPath(String name, String defaultPath) {
		super(name);
		label = name;
		setDefaultValue(defaultPath);
		set(defaultPath);

	}

	public FileOrDirectoryPath(String name, String label, String defaultPath) {
		super(name);
		setLabel(label);
		setDefaultValue(defaultPath);
		set(defaultPath);

	}

	public FileOrDirectoryPath(String name, String label, String defaultPath, Boolean validatePath) {
		super(name);
		setLabel(label);
		setDefaultValue(defaultPath);
		set(defaultPath);
		setValidatePath(validatePath);

	}

	/**
	 * Copy constructor
	 */
	private FileOrDirectoryPath(FileOrDirectoryPath filePathToCopy) {
		super(filePathToCopy);
		label = filePathToCopy.label;
		defaultValue = filePathToCopy.defaultValue;
		tooltip = filePathToCopy.tooltip;
		fileExtensions = filePathToCopy.fileExtensions;
		fileExtensionNames = filePathToCopy.fileExtensionNames;
		showOpenButton = filePathToCopy.showOpenButton;
		validatePath = filePathToCopy.validatePath;
	}

	//#end region

	//#region METHODS

	@Override
	public FileOrDirectoryPath getThis() {
		return this;
	}

	@Override
	public FileOrDirectoryPath copy() {
		return new FileOrDirectoryPath(this);
	}

	@Override
	public Image provideImage() {
		return Activator.getImage("browse.png");
	}

	@Override
	public AbstractStringAttributeAtom<FileOrDirectoryPath> createAttributeAtomControl(
			GridComposite parent,
			FocusChangingRefreshable treeViewerRefreshable) {

		//initialize value at the first call
		if (!isInitialized()) {
			set(defaultValue);
		}

		//toolkit
		FormToolkit toolkit = new FormToolkit(Display.getCurrent());

		GridComposite container = createContainer(parent);

		//label
		@SuppressWarnings("unused")
		Label labelComposite = toolkit.createLabel(container, label);

		//sub container for rest (text field and buttons)
		GridComposite subContainer = createSubContainer(container);

		createTextField(toolkit, container, subContainer);

		//browse file button
		createBrowseFileButton(toolkit, subContainer);

		//browse directory button
		createBrowseDirectoryButton(toolkit, subContainer);

		if (showOpenButton) {
			//open button
			Label openButton = toolkit.createLabel(subContainer, "", SWT.NONE);
			Image runImage = Activator.getImage("run_triangle.png");
			openButton.setImage(runImage);
			openButton.setToolTipText("Open/Run");

			//create action listener for open button
			openButton.addListener(SWT.MouseDown, new Listener() {

				@Override
				public void handleEvent(org.eclipse.swt.widgets.Event event) {
					String filePath = get();
					FileHelper.openFile(filePath);
				}
			});

		}

		return this;
	}

	@Override
	public AbstractAttributeAtom<FileOrDirectoryPath, String> createAttributeAtomControl(
			Browser browser,
			Selection sectionBody,
			FocusChangingRefreshable treeViewerRefreshable) {
		//TODO Auto-generated method stub
		return null;
	}

	private static GridComposite createContainer(GridComposite parent) {
		//create grid data to use all horizontal space
		GridData containerFillHorizontal = new GridData();
		containerFillHorizontal.grabExcessHorizontalSpace = true;
		containerFillHorizontal.horizontalAlignment = GridData.FILL;

		//container for label and rest
		GridComposite container = new GridComposite(parent);
		container.setLayoutData(containerFillHorizontal);
		return container;
	}

	@SuppressWarnings("checkstyle:magicnumber")
	private GridComposite createSubContainer(GridComposite container) {
		GridComposite subContainer = new GridComposite(container);
		int numberOfColumns = 3;
		if (showOpenButton) {
			numberOfColumns = 4;
		}

		//create grid data to use all horizontal space
		GridData subContainerFillHorizontal = new GridData();
		subContainerFillHorizontal.grabExcessHorizontalSpace = true;
		subContainerFillHorizontal.horizontalAlignment = GridData.FILL;

		GridLayout gridLayout = new GridLayout(numberOfColumns, false);
		gridLayout.horizontalSpacing = 10;
		gridLayout.marginLeft = -5;
		subContainer.setLayout(gridLayout);
		subContainer.setLayoutData(subContainerFillHorizontal);
		return subContainer;
	}

	private void createTextField(FormToolkit toolkit, GridComposite container, GridComposite subContainer) {
		//create grid data to use all horizontal space and limit preferred width
		GridData textFieldFillHorizontal = new GridData();
		textFieldFillHorizontal.grabExcessHorizontalSpace = true;
		textFieldFillHorizontal.horizontalAlignment = GridData.FILL;
		final int prefferedTextFieldWidth = 200;
		textFieldFillHorizontal.widthHint = prefferedTextFieldWidth;

		//text field
		textField = toolkit.createText(subContainer, get());
		textField.setEnabled(isEnabled());
		textField.setVisible(isVisible());
		textField.setLayoutData(textFieldFillHorizontal);
		//initialize value
		refreshAttributeAtomControl();

		//create error decoration for text field
		String errorMessage = "Invalid path";
		final TextFieldErrorDecoration errorDecoration = new TextFieldErrorDecoration(
				textField,
				errorMessage,
				container);

		//path validation

		textField.addModifyListener(new ModifyListener() {

			@SuppressWarnings("synthetic-access")
			@Override
			public void modifyText(ModifyEvent e) {

				//get current caret position
				int caretPosition = textField.getCaretPosition();

				//get text
				String text = textField.getText();

				//validate text
				if (validatePath) {
					validateFilePath(errorDecoration, text);
				}

				//set text
				set(text);

				//restore caret position
				textField.setSelection(caretPosition);

				//trigger listeners
				triggerListeners();

			}

		});

		if (validatePath) {
			validateFilePath(errorDecoration, get());
		}
	}

	private void createBrowseFileButton(FormToolkit toolkit, Composite subContainer) {
		Label browseFileButton = toolkit.createLabel(subContainer, "", SWT.PUSH);
		browseFileButton.setEnabled(isEnabled());
		browseFileButton.setVisible(isVisible());
		Image browseImage = Activator.getImage("browse.png");
		browseFileButton.setImage(browseImage);
		browseFileButton.setToolTipText("Select file path");

		//create action listener for browse file button
		final String[] extensionsArray = fileExtensions.split(",");
		final String[] extensionNamesArray = fileExtensionNames.split(",");

		browseFileButton.addListener(SWT.MouseDown, new Listener() {

			@SuppressWarnings("synthetic-access")
			@Override
			public void handleEvent(org.eclipse.swt.widgets.Event event) {
				FileDialog fileDialog = new FileDialog(Display.getCurrent().getActiveShell(), SWT.MULTI);

				fileDialog.setFilterPath(defaultValue);

				fileDialog.setFilterExtensions(extensionsArray);
				fileDialog.setFilterNames(extensionNamesArray);

				String firstFile = fileDialog.open();

				if (firstFile != null) {
					defaultValue = fileDialog.getFilterPath();
					set(firstFile);
					textField.setText(get());
				}
			}
		});
	}

	private void createBrowseDirectoryButton(FormToolkit toolkit, Composite subContainer) {
		Label browseDirectoryButton = toolkit.createLabel(subContainer, "", SWT.PUSH);
		browseDirectoryButton.setEnabled(isEnabled());
		browseDirectoryButton.setVisible(isVisible());
		Image browseFolderImage = Activator.getImage("browseDirectory.png");
		browseDirectoryButton.setImage(browseFolderImage);
		browseDirectoryButton.setToolTipText("Select directory path");

		//create action listener for browse folder button
		browseDirectoryButton.addListener(SWT.MouseDown, new Listener() {

			@SuppressWarnings("synthetic-access")
			@Override
			public void handleEvent(org.eclipse.swt.widgets.Event event) {
				DirectoryDialog directoryDialog = new DirectoryDialog(Display.getCurrent().getActiveShell(), SWT.MULTI);

				directoryDialog.setFilterPath(defaultValue);
				String firstFolder = directoryDialog.open();

				if (firstFolder != null) {
					defaultValue = directoryDialog.getFilterPath();
					set(firstFolder);
					textField.setText(get());
				}
			}
		});
	}

	/**
	 * Validates the file path
	 *
	 * @param errorDecoration
	 * @param text
	 */
	private void validateFilePath(final TextFieldErrorDecoration errorDecoration, String text) {

		boolean isValid = FileHelper.isValidFilePath(text);
		if (isValid) {
			errorDecoration.hide();
			set(text);
		} else {
			errorDecoration.show();
		}
	}

	@Override
	public void refreshAttributeAtomControl() {
		if (isAvailable(textField)) {
			final int maxWidth = 30;
			String value = get();
			if (!textField.getText().equals(value)) {
				textField.setText(get());
				Point size = textField.getSize();
				int width = size.x;
				boolean isTooLarge = width > maxWidth;
				if (isTooLarge) {
					textField.setSize(maxWidth, size.y);
				}
			}
		}
	}

	@Override
	public FileOrDirectoryPath setBackgroundColor(org.eclipse.swt.graphics.Color backgroundColor) {
		throw new IllegalStateException("Not yet implemented");

	}

	//#end region

	//#region ACCESSORS

	public String getLabel() {
		return label;
	}

	public FileOrDirectoryPath setLabel(String label) {
		this.label = label;
		return getThis();
	}

	@Override
	public String getDefaultValue() {
		return defaultValue;
	}

	public FileOrDirectoryPath setDefaultValue(String defaultFilePath) {
		this.defaultValue = defaultFilePath;
		return getThis();
	}

	public String getTooltip() {
		return tooltip;
	}

	public FileOrDirectoryPath setTooltip(String tooltip) {
		this.tooltip = tooltip;
		return getThis();
	}

	/**
	 * Get file extensions as comma separated list, e.g. '*.txt, *.xml'
	 *
	 * @return the extensions
	 */
	public String getFileExtensions() {
		return fileExtensions;
	}

	/**
	 * Set file extensions as comma separated list, e.g. '*.txt, *.xml'
	 *
	 * @param extensions
	 *            the extensions to set
	 */
	public FileOrDirectoryPath setFileExtensions(String extensions) {
		this.fileExtensions = extensions;
		return getThis();
	}

	/**
	 * Get file extension names as comma separated list, e.g. 'TestFile, ImageFile'
	 *
	 * @return the extensionNames
	 */
	public String getFileExtensionNames() {
		return fileExtensionNames;
	}

	/**
	 * Set file extension names as comma separated list, e.g. 'TestFile, ImageFile'
	 *
	 * @param extensionNames
	 *            the extensionNames to set
	 */
	public FileOrDirectoryPath setFileExtensionNames(String extensionNames) {
		this.fileExtensionNames = extensionNames;
		return getThis();
	}

	/**
	 * If set to false the file path is not validated/no error decoration is shown
	 *
	 * @param validatePath
	 */
	public FileOrDirectoryPath setValidatePath(Boolean validatePath) {
		this.validatePath = validatePath;
		return getThis();
	}

	//#end region

}
