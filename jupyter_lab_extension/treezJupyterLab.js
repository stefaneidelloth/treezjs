import Treez from '../src/treez.js';
import JupyterLabTerminal from './jupyterLabTerminal.js';

let home = '../files/files/treezjs';
let url = document.URL;
if(url.includes('localhost')){
    home =  '../files/treezjs';
}

Treez.config({
	home: home,
	isSupportingPython: true
});

window.init_workspace_module = async (app, dependencies)=>{

	await Treez.importScript('/node_modules/requirejs/require.js');
	
	require.config({
		baseUrl : treezConfig.home,
		paths : {			
			'd3' : 'node_modules/d3/dist/d3.min',
			'd3-array' : 'node_modules/d3-array/dist/d3-array.min',
			'd3-path' : 'node_modules/d3-path/dist/d3-path.min',
			'd3-shape' : 'node_modules/d3-shape/dist/d3-shape.min',
			'd3-sankey' : 'node_modules/d3-sankey/dist/d3-sankey.min',			
			'jquery' : 'node_modules/jquery/dist/jquery.min',
			'golden-layout' : 'node_modules/golden-layout/dist/goldenlayout.min',
			'codemirror' : 'node_modules/codemirror'
		},
	});

	await Treez.importCssStyleSheet('/jupyter_lab_extension/treezJupyterLab.css');


	await Treez.importCssStyleSheet('/node_modules/golden-layout/src/css/goldenlayout-base.css');
	await Treez.importCssStyleSheet('/node_modules/golden-layout/src/css/goldenlayout-light-theme.css');

	await Treez.importStaticCssStyleSheet('https://cdn.jsdelivr.net/npm/handsontable@latest/dist/handsontable.full.min.css');
	await Treez.importStaticScript('https://cdn.jsdelivr.net/npm/handsontable@latest/dist/handsontable.full.min.js');

    await Treez.importCssStyleSheet('/node_modules/flag-icon-css/css/flag-icon.min.css');
    
	require([
		'golden-layout',
		'd3',
		'd3-sankey', //needs to be loded after its dependencies		
	], function(
		 GoldenLayout,
		 d3,
		 d3Sankey		
	) {
       
        for(var name of Object.keys(d3Sankey)){
        	d3[name] = d3Sankey[name];
        };
	

		var ReactWidget = dependencies['ReactWidget'];

		var treezPlugin = new ReactWidget();
		treezPlugin.id = 'treez',
		treezPlugin.title.caption = 'Treez';
		treezPlugin.title.icon = 'treez-icon-class';
		treezPlugin.node.classList.add('treez-plugin-class');
		treezPlugin.render = () => {}; //needs to exist

		var treezView = treezPlugin.node;

		var layoutContainer = __createLayoutContainer(treezView);
		var layout = __createGoldenLayout(GoldenLayout, layoutContainer);
		var focusManager = __registerLayoutCompoments(layout, layoutContainer);
		var editorFactory = __createEditorFactory(app);

		var terminalFactory = (handleCreatedTerminal)=>{
			handleCreatedTerminal(new JupyterLabTerminal(app, dependencies));
		};

		app.shell.add(treezPlugin, 'left', { rank: 200 });

		let resizeObserver = new ResizeObserver( () => {
			if(!layout.isInitialised){
				 // this is here because initialization needs to be done after
				 // widget is part of DOM
				 layout.init();
				 Treez.initialize(d3, focusManager, editorFactory, terminalFactory);
			}
			__updateGoldenLayout(layout, layoutContainer);
		});
		resizeObserver.observe(layoutContainer);

		

	});

};

function __createEditorFactory(app){
    return (handleCreatedEditor) => {

		var editor = {
			setText: function(code, finishedHandler){
				var firstCell = __tryToGetFirstNotebookCell(app);

				var jupyterText = '%%javascript\n' + code;
				firstCell.editor.doc.setValue(jupyterText);

				if(finishedHandler){
					finishedHandler();
				}

			},
			processText: function(textHandler){
				var firstCell = __tryToGetFirstNotebookCell(app);
				if(firstCell){
					var jupyterText = firstCell.editor.doc.getValue();
					var javaScript = jupyterText.replace('%%javascript\n','').replace('%%js\n','');

					textHandler(javaScript);
				} else {
					console.warn('In order to import code, first document must by notebook.');
				}
			}
		};

		handleCreatedEditor(editor);
	};

}

function __updateGoldenLayout(layout, layoutContainer){
	var rect = layoutContainer.getBoundingClientRect();
	layout.updateSize(rect.width, rect.height);
}

function __tryToGetFirstNotebookCell(app){
    var notebookPanel = __getFirstVisibleNotebookPanel(app);
    if(notebookPanel){
    	var notebook = notebookPanel.content;
    	if(notebook){
    		return notebook.activeCell;
    	}
    }
	return null;
}

function __getFirstVisibleNotebookPanel(app){
	var mainWidgets = app.shell.widgets('main');
	var widget = mainWidgets.next();
	while(widget){
		var type = widget.sessionContext.type;
		if(type == 'notebook'){  //other wigets might be of type DocumentWidget
			if (widget.isVisible){
				return widget;
			}
		}
		widget = mainWidgets.next();
	}
	return null;
}


function __createLayoutContainer(parentElement){
	var container = document.createElement('div');
	var style= container.style;
	style.position= 'absolute';
	style.top = 0;
	style.bottom = 0;
	style.left = 0;
	style.right = 0;

	style.padding = 0;
	style.margin = 0;

	style.backgroundColor = 'red'; //for debugging layout issues
	parentElement.appendChild(container);
	return container;
}

function __createGoldenLayout(GoldenLayout, containerElement){
	//Also see http://golden-layout.com/docs/Config.html

	var firstColumn = {
		componentName : 'Tree',
		type : 'component',
		isClosable: false,
		width: 25
	};

	var secondColumnUpperRow = {
		componentName : 'Properties',
		type : 'component',
		isClosable: false,
		height: 60
	};

	var secondColumnLowerRow = {
		type : 'stack',
		content :
		[

			{
				componentName : 'Graphics',
				type : 'component',

				isClosable: false
			},
			{
				title : 'Monitor',
				type : 'column',
				id: 'monitor',
				isClosable: false,
				content : [
					{
						componentName : 'Progress',
						type : 'component',
						isClosable: false
					},
					{
						componentName : 'Log',
						type : 'component',
						isClosable: false
					}
				]
			},

	    ]
	};

	var secondColumn =  {
		type: 'column',
		content: [
		    secondColumnUpperRow,
		    secondColumnLowerRow
		]
	};


	var goldenLayoutConfig = {
		content :
		[
		    {
			    type : 'row',
			    content : [
                   firstColumn,
                   secondColumn
			     ]
	        }
	    ]
	 };

	return new GoldenLayout(goldenLayoutConfig, containerElement);
}


/*
Defines container DOM elements that are used/filled by Treez:
#treez-tree,
#treez-properties,
#treez-graphics,
#treez-progress,
#treez-log
*/
function __registerLayoutCompoments(layout, containerElement){

    layout.registerComponent('Tree', function(container) {
		var element = container.getElement();
		element.attr('id','treez-tree');

		var layoutSettings = container.layoutManager.config.settings;
		layoutSettings.showMaximiseIcon = false;
		layoutSettings.showPopoutIcon = false;
	});

	layout.registerComponent('Properties', function(container) {
		var element = container.getElement();
		element.attr('id','treez-properties')
	});

	var focusManager = {
		__graphicsContainer: undefined,
		focusGraphicsView: undefined
	};

	focusManager['focusGraphicsView'] = ()=>{
		var graphics = focusManager.__graphicsContainer.parent;
		graphics.parent.setActiveContentItem(graphics);
	};

	layout.registerComponent('Graphics', function(container) {
		focusManager.__graphicsContainer = container;
		var element = container.getElement();
		element.attr('id','treez-graphics');
	});

	layout.registerComponent('Progress', function(container) {
		var element = container.getElement();
		element.attr('id','treez-progress');

		var layoutSettings = container.layoutManager.config.settings;
		layoutSettings.showMaximiseIcon = false;
		layoutSettings.showPopoutIcon = false;
	});

	layout.registerComponent('Log', function(container) {
		var element = container.getElement();
		element.attr('id','treez-log');

		var layoutSettings = container.layoutManager.config.settings;
		layoutSettings.showMaximiseIcon = false;
		layoutSettings.showPopoutIcon = false;
	});

	return focusManager;
}