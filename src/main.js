import TreeView from './views/treeView.js';
import EditorView from './views/editorView.js';
import MonitorView from './views/monitorView.js';
import GraphicsView from './views/graphicsView.js';
import TreezTerminal from './treezTerminal.js'; 
import DTreez from './core/dtreez/dTreez.js'; 


var self = {
	getTreeView: getTreeView,
	getEditorView: getEditorView,
	setEditorViewer: setEditorViewer,
	getMonitorView: getMonitorView,
	getGraphicsView: getGraphicsView,
	graphicsContainer: undefined,
	__editorViewer: undefined,	
	__treeView: undefined,
	__monitorView: undefined,
	__graphicsView: undefined
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

	var dTreez = new DTreez(d3);  
	
	createLayoutAndRegisterLayoutCompoments(GoldenLayout, dTreez);
	
	self.__treeView = new TreeView(self, dTreez);
	self.__treeView.buildView();

	self.__monitorView = new MonitorView(self, dTreez);
	self.__monitorView.buildView();
	
	self.__graphicsView = new GraphicsView(self, dTreez);
	self.__graphicsView.buildView();
	
	self.__editorView = new EditorView(self, dTreez);
	self.__editorView.buildView(); //calls setEditorViewer to set the editor viewer of the editor view
	
	window.treezTerminal = new TreezTerminal();	

});



function createLayoutAndRegisterLayoutCompoments(GoldenLayout, dTreez){	
	
	var myLayout = createGoldenLayout(GoldenLayout); //Also see http://golden-layout.com/docs/Config.html

	myLayout.registerComponent('Tree', function(container) {
		var element = container.getElement();
		element.attr('id','treez-tree');		
	});

	myLayout.registerComponent('Properties', function(container) {
		var element = container.getElement();
		element.attr('id','treez-properties')
	});	

	myLayout.registerComponent('Progress', function(container) {		
		var element = container.getElement();
		element.attr('id','trez-progress');

		var layoutSettings = container.layoutManager.config.settings;
		layoutSettings.showMaximiseIcon = false;
		layoutSettings.showPopoutIcon = false;				
	});

	myLayout.registerComponent('Log', function(container) {		
		var element = container.getElement();
		element.attr('id','treez-log');

		var layoutSettings = container.layoutManager.config.settings;
		layoutSettings.showMaximiseIcon = false;
		layoutSettings.showPopoutIcon = false;		
	});

	myLayout.registerComponent('Graphics', function(container) {
		self.graphicsContainer = container;
		var element = container.getElement();
		element.attr('id','treez-graphics');

		var layoutSettings = container.layoutManager.config.settings;
		layoutSettings.showMaximiseIcon = true;
		layoutSettings.showPopoutIcon = true;
	});

	myLayout.registerComponent('Editor', function(container) {
		var element = container.getElement()	
		element.attr('id','treez-editor');		
	});

	myLayout.init();
}

function createGoldenLayout(GoldenLayout){
	
	var firstColumn = {
			type : 'component',
			componentName : 'Tree'			
	};

	var secondColumnUpper = {
					type : 'component',
					componentName : 'Properties'
				};
	
	var secondColumnLower = {
					type : 'stack',
					content : [ 
						{
							type : 'column',
							title : 'Monitor',
							id: 'monitor',
							content : [
								{
									type : 'component',
									componentName : 'Progress',
									isClosable: false																
								},
								{
									type : 'component',
									componentName : 'Log',
									isClosable: false
								}
							]
						}, 		
						{
							type : 'component',
							componentName : 'Graphics'
						}
					]
	} ;

	var secondColumn = {
			type : 'column',
			content : [ 
				secondColumnUpper, 
				secondColumnLower
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

function getTreeView(){
	return self.__treeView;
}

function getEditorView(){
	return self.__editorViewer.editor.getTextView();
}

function setEditorViewer(editorViewer){
	return self.__editorViewer = editorViewer;
}

function getMonitorView(){
	return self.__monitorView;
}

function getGraphicsView(){
	return self.__graphicsView;
}
