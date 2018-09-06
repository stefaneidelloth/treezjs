import AttributeContainerAtom from "./attributeContainerAtom.js";
import Section from "./section/section.js";
import TreeViewerAction from "../../treeview/treeViewerAction.js";
import Atom from "../../atom/atom.js";

export default class Page extends AttributeContainerAtom {

	constructor(name) {
		super(name);
		this.title = name[0].toUpperCase() + name.slice(1); 
	}

	copy() {
        const newAtom = new Page(this.name);
        newAtom.title = this.title;
		return newAtom;
	}

	static provideImageName() {
		return "Page.png";
	}

	createContextMenuActions(treeViewer) {
        const actions = [];

        //add
		actions.push(new TreeViewerAction(
				"Add Section",
				"Section.png",
				treeViewer,
				() => this.addSection(treeViewer)));

		//delete
		actions.push(new TreeViewerAction(
				"Delete",
				"Delete.png",
				treeViewer,
				() => this.delete()));

		return actions;
	}
	
	createAtomControl(tabFolder, treeViewerRefreshable) {

        const tabHeader = tabFolder.select(".tabHeader");


        const page = tabFolder.append("treez-tab")
            .attr("label", this.title);

        page.append("label").html(this.name);
		
		//create scrollbar
		//TODO
		

		//add selection listener hat will create the page when the
		//tab item is selected
		//TODO
		//tabFolder.on("...", ()=>{
		//	recreateSections(treeViewerRefreshable, page);
		//});		

		//comment this out for lazy creation (however, page might not be shown when running tests/demos)
		this.recreateSections(treeViewerRefreshable, page);

	}

	recreateSections(treeViewerRefreshable, page) {
		
		page.selectAll("div").remove();

		this.children.forEach(section=>{
			section.createAtomControl(page, treeViewerRefreshable);
		});		

	}

	addSection(treeViewer) {
        const name = Atom.createChildNameStartingWith(this, "mySection");
        this.createSection(name);
		this.expand(treeViewer);
	}
	
	static createSection(name, absoluteHelpId, isExpanded) {
        const section = new Section(name);
        section.setAbsoluteHelpId(absoluteHelpId);
		section.setExpanded(isExpanded);
		return section;
	}	

}
