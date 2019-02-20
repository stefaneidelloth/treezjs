import TreeView from './views/treeView.js';
import EditorView from './views/editorView.js';
import TreezTerminal from './treezTerminal.js'; 


var self = {
	editorViewer: undefined,
	getEditorView: getEditorView,
	treeView: undefined
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
	
	createLayoutAndRegisterLayoutCompoments(GoldenLayout, d3);
	
	window.treezTerminal = new TreezTerminal();

});



function createLayoutAndRegisterLayoutCompoments(GoldenLayout, d3){
	
	var myLayout = createGoldenLayout(GoldenLayout); //Also see http://golden-layout.com/docs/Config.html

	myLayout.registerComponent('Tree', function(container) {
		var element = container.getElement();
		element.attr('id','tree');
		
		self.treeView = new TreeView();
		self.treeView.buildView(element[0], self);
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
}

function createGoldenLayout(GoldenLayout){
	
	var firstColumn = {
			type : 'component',
			componentName : 'Tree'
	};
	
	var secondColumn = {
			type : 'column',
			content : [ 
				{
					type : 'component',
					componentName : 'Properties'
				}, 
				{
					type : 'stack',
					content : [ 
						{
							type : 'component',
							componentName : 'Monitor'
						}, 		
						{
							type : 'component',
							componentName : 'Graphics'
						}
					]
				} 
			]
		};
	
	var thirdColumn = {
			type : 'component',
			componentName : 'Editor'
		};
	
	var goldenLayoutConfig = {
		content : [ {
			type : 'row',
			content : [ firstColumn, secondColumn, thirdColumn ]
		} ]
	};	

	return new GoldenLayout(goldenLayoutConfig);
}

function getEditorView(){
	return self.editorViewer.editor.getTextView();
}
