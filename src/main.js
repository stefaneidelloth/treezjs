import TreeView from './views/treeView.js';
import EditorView from './views/editorView.js';


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
				'lib/orion/code_edit/built-codeEdit-amd' : ['orion/codeEdit', 'orion/Deferred']
			}
});

require([
	'golden-layout',
	'd3'
], function(
	 GoldenLayout,
	 d3
) {		

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
		element.attr('id','tree');
		
		new TreeView().buildView(element[0], getEditorViewer);
	});

	myLayout.registerComponent('Properties', function(container) {
		var element = container.getElement();
		element.attr('id','properties')
	});

	myLayout.registerComponent('Monitor', function(container) {
		var element = container.getElement();
	});

	myLayout.registerComponent('Graphics', function(container) {
		var element = container.getElement();
	});

	myLayout.registerComponent('Editor', function(container) {
		var element = container.getElement()
		new EditorView().buildView(element[0], self, d3);
	});

	myLayout.init();

});

function getEditorViewer(){
	return self.editorViewer.editor.getTextView();
}
