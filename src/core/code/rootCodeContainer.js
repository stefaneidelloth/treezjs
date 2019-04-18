import CodeContainer from './codeContainer.js';


/**
 * The root code container contains the complete code for creating a tree.
 */
export default class RootCodeContainer extends CodeContainer {

	constructor(atom) {	
		super();	
		this.__atom = atom;	
		this.__buildHeader();
		this.__buildInitialImports();
		this.__buildOpening();

		this.__buildClosing();
	}

	__buildHeader() {
		//this.extendHeader('//#header line above imports');
		//this.extendHeaderWithEmptyLine();
	}
	
	__buildInitialImports() {
		
		var urlPrefix = window.treezConfig
							?window.treezConfig.home
							:'.';
		
		this.extendImports("import Root from '" + urlPrefix + "/src/root/root.js';");
	}

	__buildOpening() {
		this.extendOpeningWithEmptyLine();
		this.extendOpening('window.createModel = function(){');
		this.extendOpeningWithEmptyLine();		
	}

	__buildClosing() {
		this.__buildCodeToSaveExpansionState();
		this.__buildCodeToReturnRoot();
	}

	__buildCodeToSaveExpansionState() {
		var expandedNodes = this.__atom.expandedNodes;

		if (expandedNodes.length > 0) {
			var code = this.__atom.name + ".setExpandedNodes('";
			for (var index = 0; index < expandedNodes.length - 1; index++) {
				code = code + expandedNodes[index] + ',';
			}
			code = code + expandedNodes[expandedNodes.length - 1] + "');";
			this.extendClosing(code);
		}
	}

	__buildCodeToReturnRoot() {
		this.extendClosingWithEmptyLine();
		this.extendClosing(this.indent  + 'return root;');
		this.extendClosing('};');		
	}
}
