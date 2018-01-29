import AttributeAtom from './../../attributeAtom.js';
import AttributeContainerAtom from './../attributeContainerAtom.js';

export default class SectionControlProvider  {	

	constructor(section, treeViewerRefreshable) {
		this.section = section;		
		this.treeViewerRefreshable = treeViewerRefreshable;
	}

	createAtomControl() {		

		var expander = this.section //
				.append("details") //
				.style("margin-bottom", "10px");

		expander.append("style") //
				.text("summary::-webkit-details-marker { " //
						+ "   color: #194c7f "//
						+ "}");

		var expanderHeader = expander //
				.append("summary") //
				.style("background", "linear-gradient(#e0e8f1, white)")
				.style("outline", "none")
				.style("border-top-left-radius", "2px")
				.style("border-top-right-radius", "2px")
				.style("padding-left", "5px")
				.style("color", "#194c7f")
				.style("margin-bottom", "5px")
				.text(section.getTitle());

		var expanderBody = expander //
				.append("div");

		var isExpanded = section.isExpanded();
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

		this.createSectionContent(expanderBody);

	}

	createSectionContent(sectionBody) {

		this.section.children.forEach((child)=>{

		var isAttributeAtom = child is AttributeAtom;
		if (isAttributeAtom) {
			this.createControlFromAttributeAtom(sectionBody, child);
			child.createAttributeAtomControl(sectionBody, this.treeViewerRefreshable);
			return;
		} 

		var isAttributeContainerAtom = atom is AttributeContainerAtom;
		if (isAttributeContainerAtom) {			
			atom.createAtomControl(sectionBody, this.treeViewerRefreshable);
		} else {
			var message = "Could not create attribute atom. Type '" + atom.prototype.name() + "' is not yet implemented.";			
			throw new Error(message);
		}
	}
}
