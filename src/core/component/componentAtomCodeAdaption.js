import AtomCodeAdaption from './../code/atomCodeAdaption.js';

export default class ComponentAtomCodeAdaption extends AtomCodeAdaption {
	
	constructor(atom) {
		super(atom);
	}

	
	/*
	 createCodeForAttributesFromModel(parentAtom) {

		var pages = this.page(parentAtom);

		var attributeContainer = new CodeContainer();
		for (var page of pages) {			

			//extend code with attribute code for page
			var codeAdaption = page.createCodeAdaption();
			
			attributeContainer = codeAdaption.extendAttributeCodeContainerForModelParent(parentAtom, null,
					attributeContainer);
		}

		return attributeContainer;
	}

	static pages(parentAtom) {
		return parentAtom.children;
		
	}

	 static assertPageNodeIsPage(pageNode) {
		String type = pageNode.getAdaptable().getClass().getSimpleName();
		String pageType = Page.class.getSimpleName();
		boolean isPage = type.equals(pageType);
		if (!isPage) {
			String message = "The type of the first children of an AdjustableAtom has to be " + pageType + " and not '"
					+ type + "'.";
			throw new IllegalArgumentException(message);
		}
	}
	
	*/

    
}