import Treez from './treez.js';
import JupyterLabTerminal from './jupyterLabTerminal.js';

Treez.config({
	home: '../files/treezjs',
	isSupportingPython: true
});

window.init_workspace_module = async (app, Widget)=>{
   
	await Treez.importScript('/bower_components/requirejs/require.js');	

	require.config({
		baseUrl : treezConfig.home,
		paths : {
			'd3' : 'bower_components/d3/d3.min',				
			'jquery' : 'bower_components/jquery/dist/jquery.min',
			'golden-layout' : 'bower_components/golden-layout/dist/goldenlayout.min',
			'codemirror' : 'bower_components/codemirror'					
		},
	});


	require([		
		'golden-layout', 		
		'd3'		
	], function(		
		 GoldenLayout,		
		 d3
	) {
	  
      var treezPlugin = new Widget();
      treezPlugin.id = 'treez',
      treezPlugin.title.caption = 'Treez';
      treezPlugin.title.icon = 'treez-icon-class'; 
      treezPlugin.render = (foo, baa, qux) => {
            var a=1;
      	
      };     

      app.shell.add(treezPlugin, 'left', { rank: 200 });

     
     /*
		Treez.importCssStyleSheet('/bower_components/golden-layout/src/css/goldenlayout-base.css');
		Treez.importCssStyleSheet('/bower_components/golden-layout/src/css/goldenlayout-light-theme.css');

		Treez.importStaticCssStyleSheet('https://cdn.jsdelivr.net/npm/handsontable@latest/dist/handsontable.full.min.css');		
		Treez.importStaticScript('https://cdn.jsdelivr.net/npm/handsontable@latest/dist/handsontable.full.min.js');

		var layoutContainer = __createLayoutContainer(GoldenLayout);
		var focusManager = __createJupyterLayoutAndRegisterLayoutCompoments(GoldenLayout, layoutContainer);

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
						if(finishedHandler){
							finishedHandler();
						}

					},
					processText: function(textHandler){
						var notebook = Jupyter.notebook;
						var firstCell = notebook.get_cells()[0];
						var jupyterText = firstCell.get_text();

						var text = jupyterText.replace('%%javascript\n','').replace('%%js\n','');

						textHandler(text);
					}
			};

			handleCreatedEditor(editor);
		};

		var terminalFactory = (handleCreatedTerminal)=>{
			handleCreatedTerminal(new JupyterTerminal(Jupyter));
		};

		Treez.initialize(d3, focusManager, editorFactory, terminalFactory);

		*/

	});

};


function __createLayoutContainer(GoldenLayout){
	var container = document.createElement('div');

	var style= container.style;
	//style.backgroundColor='red';
	style.position= 'absolute';
	style.top='110px';
	style.bottom = 0;
	style.left=0;
	style.right=0;
	style.padding=0;
	style.margin=0;
	document.body.appendChild(container);
	return container;
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
function __createJupyterLayoutAndRegisterLayoutCompoments(GoldenLayout, containerElement){

	var myLayout = __createGoldenLayout(GoldenLayout, containerElement); //Also see http://golden-layout.com/docs/Config.html

	window.onresize = ()=>{
		var rect = containerElement.getBoundingClientRect();
		myLayout.updateSize(rect.width, rect.height);
	};

	var focusManager = {
		__graphicsContainer: undefined,
		focusGraphicsView: undefined
	};

	focusManager['focusGraphicsView'] = ()=>{
		var graphics = focusManager.__graphicsContainer.parent;
		graphics.parent.setActiveContentItem(graphics);
	};

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

function __createGoldenLayout(GoldenLayout, containerElement){

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

