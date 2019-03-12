


export default class PagedGraphicsAtomCodeAdaption extends AdjustableAtomCodeAdaption {

	constructor(atom) {
		super(atom);
	}

	

	/**
	 * Builds the code for setting attribute values of the atom. Might be overridden by inheriting classes.
	 */
	@Override
	protected CodeContainer buildCodeContainerForAttributes() {

		AdjustableAtom adjustableAtom = initializeModelIfRequired();

		AbstractAtom<?> model = adjustableAtom.getModel();
		if (model != null) {
			CodeContainer codeContainer = createCodeForAttributesFromModel(adjustableAtom);
			//codeContainer = addCodeForPropertyPages(codeContainer);
			return codeContainer;
		} else {
			throw new IllegalStateException(
					"Could not create attribute code because the underlying model could not be initialized.");
		}
	}

	/**
	 * Builds the code for setting attribute values using the underlying model.
	 */
	@Override
	protected CodeContainer createCodeForAttributesFromModel(AdjustableAtom parentAtom) {

		List<TreeNodeAdaption> pageNodes = getPageNodes(parentAtom);

		CodeContainer attributeContainer = new CodeContainer(scriptType);
		for (TreeNodeAdaption pageNode : pageNodes) {

			assertPageNodeIsPage(pageNode);
			Page page = (Page) pageNode.getAdaptable();

			//extend code with attribute code for page
			AttributeParentCodeAdaption codeAdaption = page.createCodeAdaption(scriptType);
			AbstractAtom<?> intermediateAtom = page;
			attributeContainer = codeAdaption.extendAttributeCodeContainerForModelParent(parentAtom, intermediateAtom,
					attributeContainer);
		}

		return attributeContainer;
	}

	
}
