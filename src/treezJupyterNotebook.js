import Treez from './treez.js'; 
import JupyterTerminal from './jupyterTerminal.js';

require([
	'base/js/namespace',
	'../notebooks/treezjs/bower_components/golden-layout/dist/goldenlayout.min',
	'../notebooks/treezjs/bower_components/d3/d3.min'	
], function(
	 Jupyter,
	 GoldenLayout,
	 d3	
) {	
	
	Treez.config({
		home: '../notebooks/treezjs'
	});



	Treez.importCssStyleSheet('/bower_components/golden-layout/src/css/goldenlayout-base.css');	
	Treez.importCssStyleSheet('/bower_components/golden-layout/src/css/goldenlayout-light-theme.css');	
	
	createJupyterLayoutAndRegisterLayoutCompoments(GoldenLayout, document.body);

	var propertiesElement = document.getElementById('treez-properties');
	propertiesElement.onfocusin = () => {
		//disable jupyter keyboard shortcuts to be able to corretly enter text in html elements
		Jupyter.keyboard_manager.disable();		
	}


	var editorFactory = (handleCreatedEditor)=>{
		
		var editorContent = document.getElementById('treez-editor-content');
		
		var site = document.getElementById('site');		
		editorContent.appendChild(site);
		
    	var editor = {
				setText: function(code, finishedHandler){
					var notebook = Jupyter.notebook;
					var firstCell = notebook.get_cells()[0];

					var jupyterText = '%%javascript\n' + code;
					firstCell.set_text(jupyterText);					
					finishedHandler();					
				},
				processText: function(textHandler){	
					var notebook = Jupyter.notebook;
					var firstCell = notebook.get_cells()[0];
					var jupyterText = firstCell.get_text();

                    var text = jupyterText.replace('%%javascript','').replace('%%js','');
													
			    	textHandler(text);
				}
		};
		
		handleCreatedEditor(editor);
    };

    var terminalFactory = (handleCreatedTerminal)=>{    	
    	handleCreatedTerminal(new JupyterTerminal(Jupyter)); 
    };  	
	
	Treez.initialize(d3, editorFactory, terminalFactory); 	
		
});


/*
Defines container DOM elements that are used/filled by Treez:
#treez-tree, 
#treez-properties, 
#treez-editor
#treez-graphics,
#treez-progress, 
#treez-log
*/
function createJupyterLayoutAndRegisterLayoutCompoments(GoldenLayout, containerElement){	
	
	var myLayout = createGoldenLayout(GoldenLayout, containerElement); //Also see http://golden-layout.com/docs/Config.html

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

function createGoldenLayout(GoldenLayout, containerElement){
	
	var firstColumn = {
			type : 'component',
			componentName : 'Tree',
			width: 15			
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
			],
			width: 25
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

