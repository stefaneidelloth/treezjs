import TreeView from "./views/treeView.js";

var self = {
	editorViewer: undefined
}

requirejs.config({
			baseUrl : '..',
			paths : {
				'd3' : 'bower_components/d3/d3.min',				
				'jquery' : 'bower_components/jquery/dist/jquery.min',
				'golden-layout' : 'bower_components/golden-layout/dist/goldenlayout.min'
			},
			bundles : {
				"lib/orion/code_edit/built-codeEdit-amd" : ["orion/codeEdit", "orion/Deferred"]
			}
});

require([ 'golden-layout' ], function(GoldenLayout) {

	var goldenLayoutConfig = {
		content : [ {
			type : 'row',
			content : [ {
				type : 'component',
				componentName : 'Tree'
			}, {
				type : 'column',
				content : [ {
					type : 'component',
					componentName : 'Properties'
				}, {
					type : 'stack',
					content : [ {
						type : 'component',
						componentName : 'Monitor'
					}, {
						type : 'component',
						componentName : 'Graphics'
					}, ]
				} ]
			}, {
				type : 'component',
				componentName : 'Editor'
			} ]
		} ]
	};	

	var myLayout = new GoldenLayout(goldenLayoutConfig);

	myLayout.registerComponent('Tree', function(container) {
		var element = container.getElement();
		element.attr("id","tree");
		new TreeView().buildView(element[0], getEditorViewer);
	});

	myLayout.registerComponent('Properties', function(container) {
		var element = container.getElement();
	});

	myLayout.registerComponent('Monitor', function(container) {
		var element = container.getElement();
	});

	myLayout.registerComponent('Graphics', function(container) {
		var element = container.getElement();
	});

	myLayout.registerComponent('Editor', function(container) {

		var element = container.getElement();
		element.attr("id", "editor");	
			
		require(["orion/codeEdit", "orion/Deferred"], function(CodeEdit, Deferred) {

		var content = "import Atom from './src/core/atom.js';\n"+		
			"\n"+
			"window.createModel = function(){\n"+
			"\n"+
			"	var root = new Atom('root');\n"+
			"	var firstChild = new Atom('firstChild');\n"+
			"	root.addChild(firstChild);\n"+
			"	var secondChild = new Atom('secondChild');\n"+
			"	root.addChild(secondChild);\n"+
			"	var grandChild = new Atom('grandChild');\n"+
			"	secondChild.addChild(grandChild);\n"+
			"	return root;\n"+
			"};\n";
			
		var codeEdit = new CodeEdit();			
		codeEdit.create({parent: "editor"}).then(function(editorViewer) {
				editorViewer.setContents(content, "application/javascript");
				self.editorViewer = editorViewer;
			});
		});       

	});

	myLayout.init();

});

function getEditorViewer(){
	return self.editorViewer.editor.getTextView();
}