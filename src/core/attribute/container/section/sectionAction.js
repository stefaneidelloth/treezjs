import AttributeContainerAtom from "../attributeContainerAtom.js";

/**
 * Represents a single action that can be performed from within a section
 */
export default class SectionAction extends AttributeContainerAtom {

	private static final Logger LOG = Logger.getLogger(SectionAction.class);

	//#region ATTRIBUTES

	@IsParameter(defaultValue = "")
	private String description;

	/**
	 * A runnable that performs the actual action
	 */
	private Runnable runnable;

	/**
	 * The image for the action button
	 */
	private Image image;

	//#end region

	//#region CONSTRUCTORS

	public SectionAction(String name) {
		super(name);
		this.name = name;
		this.description = "";
		this.runnable = new Runnable() {

			@Override
			public void run() {
				LOG.debug("example action");
			}
		};
		this.image = Activator.getImage("run.png");
	}

	public SectionAction(String name, String description) {
		super(name);
		this.name = name;
		this.description = description;
		this.runnable = new Runnable() {

			@Override
			public void run() {
				LOG.debug("example action with tooltip");
			}
		};
		this.image = Activator.getImage("run.png");
	}

	public SectionAction(String name, String description, Runnable runnable) {
		super(name);
		this.name = name;
		this.description = description;
		this.runnable = runnable;
		this.image = Activator.getImage("run.png");
	}

	public SectionAction(String name, String description, Runnable runnable, Image image) {
		super(name);
		this.name = name;
		this.description = description;
		this.runnable = runnable;
		this.image = image;
	}

	/**
	 * Copy constructor
	 */
	private SectionAction(SectionAction sectionActionToCopy) {
		super(sectionActionToCopy);
		this.name = sectionActionToCopy.name;
		this.description = sectionActionToCopy.description;
		this.runnable = sectionActionToCopy.runnable;
		this.image = sectionActionToCopy.image;
	}

	//#end region

	//#region METHODS

	@Override
	public SectionAction getThis() {
		return this;
	}

	@Override
	public SectionAction copy() {
		return new SectionAction(this);
	}

	@Override
	public Image provideImage() {
		return image;
	}

	@Override
	protected ArrayList<Object> createContextMenuActions(final TreeViewerRefreshable treeViewer) {
		ArrayList<Object> actions = new ArrayList<>();

		//delete
		actions.add(new TreeViewerAction(
				"Delete",
				Activator.getImage(ISharedImages.IMG_TOOL_DELETE),
				treeViewer,
				() -> createTreeNodeAdaption().delete()));

		return actions;
	}

	@Override
	public void createAtomControl(TreezComposite sectionClient, FocusChangingRefreshable treeViewerRefreshable) {

		//toolkit
		FormToolkit toolkit = new FormToolkit(Display.getCurrent());

		//action button
		Composite parent = ((Composite) sectionClient).getParent();
		org.eclipse.ui.forms.widgets.Section section = (org.eclipse.ui.forms.widgets.Section) parent;
		Composite toolbar = (Composite) section.getTextClient();

		//check if action already exist in tool bar
		boolean alreadyExists = checkIfActionAlreadyExists(toolbar);
		if (!alreadyExists) {

			ImageHyperlink actionLink = toolkit.createImageHyperlink(toolbar, SWT.NULL);
			actionLink.setData(getName());
			actionLink.setImage(provideImage());
			actionLink.setToolTipText(getDescription());
			actionLink.addHyperlinkListener(getHyperlinkAdapter());
			actionLink.setBackground(section.getTitleBarGradientBackground());
		}

	}

	@Override
	public void createAtomControl(Browser browser, Selection parent, FocusChangingRefreshable treeViewerRefreshable) {
		//TODO
	}

	private boolean checkIfActionAlreadyExists(Composite toolbar) {
		String name = getName();
		Control[] children = toolbar.getChildren();
		for (Control child : children) {
			boolean isImageHyperLink = child instanceof ImageHyperlink;
			if (isImageHyperLink) {
				ImageHyperlink existingLink = (ImageHyperlink) child;
				Object data = existingLink.getData();
				if (data != null) {
					String existingName = data.toString();
					if (existingName.equals(name)) {
						return true;
					}
				}
			}
		}
		return false;
	}

	/**
	 * Creates the button action
	 *
	 * @return
	 */
	public IHyperlinkListener getHyperlinkAdapter() {
		return new HyperlinkAdapter() {

			@SuppressWarnings("synthetic-access")
			@Override
			public void linkActivated(HyperlinkEvent e) {
				//LOG.debug("section action");
				runnable.run();
			}

		};
	}

	//#end region

	//#region ACCESSORS

	public String getDescription() {
		return description;
	}

	public SectionAction setDescription(String description) {
		this.description = description;
		return getThis();
	}

	@Override
	public boolean isEnabled() {
		return true;
	}

	@Override
	public SectionAction setEnabled(boolean enable) {
		throw new IllegalStateException("not yet implemented");
	}

	@Override
	public boolean isVisible() {
		return true;
	}

	@Override
	public SectionAction setVisible(boolean visible) {
		throw new IllegalStateException("not yet implemented");
	}

	//#end region

}
