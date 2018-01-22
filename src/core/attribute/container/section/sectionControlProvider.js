

export default class SectionControlProvider  {	

	private Section section;

	private Browser browser;

	private FocusChangingRefreshable treeViewerRefreshable;

	private org.eclipse.ui.forms.widgets.Section sectionComposite;

	//#end region

	//#region CONSTRUCTORS

	public HtmlSectionControlProvider(
			Section section,
			Browser browser,
			FocusChangingRefreshable treeViewerRefreshable) {
		this.section = section;
		this.browser = browser;
		this.treeViewerRefreshable = treeViewerRefreshable;
	}

	//#end region

	//#region METHODS

	@Override
	public void createAtomControl() {

		D3 d3 = browser.getD3();

		Selection root = d3.select("#root");

		Selection expander = root //
				.append("details") //
				.style("margin-bottom", "10px");

		expander.append("style") //
				.text("summary::-webkit-details-marker { " //
						+ "   color: #194c7f "//
						+ "}");

		Selection expanderHeader = expander //
				.append("summary") //
				.style("background", "linear-gradient(#e0e8f1, white)")
				.style("outline", "none")
				.style("border-top-left-radius", "2px")
				.style("border-top-right-radius", "2px")
				.style("padding-left", "5px")
				.style("color", "#194c7f")
				.style("margin-bottom", "5px")
				.text(section.getTitle());

		Selection expanderBody = expander //
				.append("div");

		boolean isExpanded = section.isExpanded();
		if (isExpanded) {
			expander.attr("open", "open");
		} else {
			expander.attr("open", "false");
		}

		/*
		 * sectionComposite.setDescription(section.getDescription());

		String absoluteHelpId = section.getAbsoluteHelpId();
		AbstractActivator.registerAbsoluteHelpId(absoluteHelpId, sectionComposite);

		createSectionToolbar(toolkit); //TODO
		 */

		//setEnabled(section.isEnabled()); //TODO

		createSectionContent(expanderBody);

	}

	private void createSectionContent(Selection sectionBody) {

		List<TreeNodeAdaption> childNodes = section.createTreeNodeAdaption().getChildren();
		for (TreeNodeAdaption childNode : childNodes) {

			Adaptable adaptable = childNode.getAdaptable();

			boolean isAbstractAttributeAtom = adaptable instanceof AbstractAttributeAtom;
			if (isAbstractAttributeAtom) {
				createControlFromAttributeAtom(sectionBody, adaptable);
			} else {
				createControlFromAttributeContainerAtom(sectionBody, adaptable);
			}
		}

	}

	private void createControlFromAttributeAtom(Selection sectionBody, Adaptable adaptable) {
		AbstractAttributeAtom<?, ?> attributeAtom = (AbstractAttributeAtom<?, ?>) adaptable;
		attributeAtom.createAttributeAtomControl(browser, sectionBody, treeViewerRefreshable);
	}

	private void createControlFromAttributeContainerAtom(Selection sectionBody, Adaptable adaptable) {
		boolean isAbstractAttributeContainerAtom = adaptable instanceof AbstractAttributeContainerAtom;
		if (isAbstractAttributeContainerAtom) {
			AbstractAttributeContainerAtom<?> attributeContainerAtom = (AbstractAttributeContainerAtom<?>) adaptable;
			attributeContainerAtom.createAtomControl(browser, sectionBody, treeViewerRefreshable);
		} else {
			String message = "Could not create attribute atom. Type '" + adaptable.getClass().getName()
					+ "' is not yet implemented.";
			LOG.error(message);
			throw new IllegalStateException(message);
		}
	}

	//#end region

	//#region ATTRIBUTES

	@Override
	public void setEnabled(boolean enable) {
		throw new IllegalStateException("not yet implemented");
	}

	@Override
	public void setVisible(boolean visible) {
		throw new IllegalStateException("not yet implemented");
	}

	//#end region

}
