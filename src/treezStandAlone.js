import Treez from './treez.js';
import StandAloneTerminal from './standAloneTerminal.js'; 

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
	'd3',
	'orion/codeEdit', 
	'orion/Deferred'
], function(
	 GoldenLayout,
	 d3,
	 OrionCodeEdit, 
	 OrionDeferred
) {		
	
	Treez.config('.');	
	
	Treez.importCssStyleSheet('/bower_components/golden-layout/src/css/goldenlayout-base.css');	
	Treez.importCssStyleSheet('/bower_components/golden-layout/src/css/goldenlayout-light-theme.css');	
	Treez.importCssStyleSheet('/lib/orion/code_edit/built-codeEdit.css');
	
	var focusManager = createStandAloneLayoutAndRegisterLayoutCompoments(GoldenLayout, document.body);		
		
	 var editorFactory = (handleCreatedEditor)=>{
		 createEditor(handleCreatedEditor, OrionCodeEdit);
	 }
	
	 var terminalFactory = (handleCreatedTerminal)=>{
		 handleCreatedTerminal(new StandAloneTerminal());
	 };
	
	Treez.initialize(d3, editorFactory, terminalFactory, focusManager); 		
});


function createEditor(handleCreatedEditor, OrionCodeEdit){
		 
	 var code = "import Root from './src/root/root.js';\n"+			
		"\n"+
		"window.createModel = function(){\n"+
		"\n"+
		"	var root = new Root();\n"+	
		"	var models = root.createModels();\n"+
		"	var genericInput = models.createGenericInput();\n"+
		"	return root;\n"+
		"};\n";

	var codeEdit = new OrionCodeEdit();	
	
	codeEdit.create({parent: 'treez-editor-content'}).then(function(editorView) {
		
		editorView.setContents(code, 'application/javascript');
		
		var editor = {
				setText: function(code, finishedHandler){
					editorView.setContents(code, 'application/javascript').then(()=>finishedHandler());
				},
				processText: function(textHandler){						
			    	var editorContext = editorView.editor.getEditorContext();
			    	editorContext.getText().then((text)=>textHandler(text));
				}
		};
		
		handleCreatedEditor(editor);
	});		 
}	


/*
Defines container DOM elements that are used/filled by Treez:
#treez-tree, 
#treez-properties, 
#treez-editor
#treez-graphics,
#treez-progress, 
#treez-log
*/
function createStandAloneLayoutAndRegisterLayoutCompoments(GoldenLayout, containerElement){	
	
	var myLayout = createGoldenLayout(GoldenLayout, containerElement); //Also see http://golden-layout.com/docs/Config.html

	var focusManager = {
		__graphicsContainer: undefined,
		focusGraphicsView: ()=>{
			var graphics = this.__graphicsContainer.parent;
        	graphics.parent.setActiveContentItem(graphics);
		}
	}

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
		element.attr('id','treez-progress');

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
		focusManager.__graphicsContainer = container;
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

	return focusManager;
}

function createGoldenLayout(GoldenLayout, containerElement){
	
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

	return new GoldenLayout(goldenLayoutConfig, containerElement);
}