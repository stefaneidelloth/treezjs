import AtomControlAdaption from "../atom/atomControlAdaption.js";
import Page from "../attribute/container/page.js"

/**
 * The control adaption for the adjustable atom. The control will be build from the underlying tree model of the
 * AdjustableAtom.
 */
export default class AdjustableAtomControlAdaption extends AtomControlAdaption {	

	constructor(parent, adjustableAtom, treeViewerRefreshable) {
		super(parent, adjustableAtom);

		var model = adjustableAtom.model;
		if (model != null) {
			this.createPropertyControlFromModel(parent, model, treeViewerRefreshable);
		} else {
			throw new Error("Could not create control because the underlying model could not be initialized.");
		}
	}

	createPropertyControlFromModel(parent, model, treeViewerRefreshable) {
			
		var colorBackgroundInactive = "grey"; // display.getSystemColor(SWT.COLOR_TITLE_INACTIVE_BACKGROUND_GRADIENT);
		var colorBackgroundActive = "white"; //display.getSystemColor(SWT.COLOR_TITLE_BACKGROUND);
		
        var tabFolder = this.createTabbedFolder(parent, colorBackgroundInactive, colorBackgroundActive);

        this.createTabbedPages(model, tabFolder, treeViewerRefreshable); 

        tabFolder.selectAll(".treez-tab")
           .style("display","none");

        tabFolder.select(".treez-tab")
        	.style("display","block");      		

	}

	createTabbedFolder(parent, colorBackgroundInactive, colorBackgroundActive) {

		 var tabFolder = parent.append("treez-tabs")
        
         //var tabHeader = tabFolder.append("div")
         //	.attr("class", "treez-tabs-header");

		return tabFolder;
	}

	/**
	 * Creates tab pages from the model of the AdjustableAtom. The AttributeAtom Page might contain further children
	 * that are then used to create the control for the page and so on. The pages are lazily created when a tab is
	 * selected
	 */
	createTabbedPages(model, tabFolder, treeViewerRefreshable) {
		
		model.children.forEach(page=>{						
			var isPage = page instanceof Page;
			if (!isPage) {
				var message = "The type of the first children of an AdjustableAtom has to be Page and not '" +
				 page.constructor.name + "'.";
				throw new Error(message);
			}				
			page.createAtomControl(tabFolder, treeViewerRefreshable);
		});
	}

	

}
