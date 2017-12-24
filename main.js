import * as treeView from "./treeView.js";

var self = {
	editorViewer: undefined
}

requirejs.config({
			baseUrl : '.',
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
				componentName : 'Tree',
				width : '20'
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
		treeView.build(element[0], getEditorViewer);
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

		var content = "//import Root from './root.js';\n"+
		"\n"+
		"window.createModel = function(){\n"+
		"\n"+
		"	//var root = new Root('root');\n"+
		"	return {id:'root'};//root;\n"+
		"};\n"
			
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