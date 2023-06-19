import Treez from '../src/treez.js';
import JupyterLabTerminal from './jupyterLabTerminal.js';
import NotebookObserver from './notebookObserver.js';
import { GoldenLayout } from '../lib/golden-layout/golden-layout.min.js'



let url = document.URL;
let labIndex = url.indexOf('/lab');
let urlPrefix = url.substring(0, labIndex);

let home = urlPrefix + '/tree/treezjs';

Treez.config({
	home: home,
	isSupportingPython: true
});

window.init_workspace_module = async (app, dependencies)=>{

	  window.$ = window.jQuery = dependencies['jQuery'];
	  window.CodeMirror = dependencies['codeMirror'];

    var require = window.require
    if(!require){
    	require = window.requirejs
    }
    if(!require){
    	await Treez.importScript('/node_modules/requirejs/require.js')
    	require = window.require;
    }    

    var paths = {			
		'd3' : 'node_modules/d3/dist/d3.min',
		'd3-array' : 'node_modules/d3-array/dist/d3-array.min',
		'd3-path' : 'node_modules/d3-path/dist/d3-path.min',
		'd3-shape' : 'node_modules/d3-shape/dist/d3-shape.min',
		'd3-sankey' : 'node_modules/d3-sankey/dist/d3-sankey.min',	
		'jquery-library': 'lib/jquery-library'
	}

	var require_map = {
		  '*': { 'jquery': 'jquery-library' },			 
	}
	
    var config =  {
		baseUrl : treezConfig.home,			
		paths : paths,		
		map: require_map
	}
	
	require.config(config);	

	await Treez.importCssStyleSheet('/jupyter_lab_extension/treezJupyterLab.css');

	await Treez.importCssStyleSheet('/node_modules/golden-layout/dist/css/goldenlayout-base.css');
	await Treez.importCssStyleSheet('/node_modules/golden-layout/dist/css/themes/goldenlayout-light-theme.css');

	//await Treez.importStaticCssStyleSheet('https://cdn.jsdelivr.net/npm/handsontable@latest/dist/handsontable.full.min.css');
	//await Treez.importStaticScript('https://cdn.jsdelivr.net/npm/handsontable@latest/dist/handsontable.full.min.js');

  await Treez.importCssStyleSheet('/node_modules/flag-icon-css/css/flag-icons.min.css');
    
	require([
	  //'golden-layout',
		'd3',
		'd3-sankey', //needs to be loaded after its dependencies
	], function(
	   //goldenLayout,
		 d3,
		 d3Sankey		
	) {		
       
        for(var name of Object.keys(d3Sankey)){
        	d3[name] = d3Sankey[name];
        };
	
        
		var ReactWidget = dependencies['ReactWidget'];

		var treezPlugin = new ReactWidget();
		treezPlugin.id = 'treez';
		treezPlugin.title.caption = 'Treez';
		treezPlugin.title.icon = 'treez-icon-class';
		treezPlugin.node.classList.add('treez-plugin-class');
		treezPlugin.render = () => {}; //needs to exist

		var treezView = treezPlugin.node;
		var layoutContainer = __createLayoutContainer(treezView);	

		
		var goldenLayout = new GoldenLayout(layoutContainer);		
		const focusManager = __registerLayoutComponents(goldenLayout, layoutContainer);
		
		const layoutConfig = __createGoldenLayoutConfiguration();		
		goldenLayout.loadLayout(layoutConfig);
		
		const editorFactory = __createEditorFactory(app);
		let notebook = __tryToGetActiveNotebook(app);
		let observer = new NotebookObserver();
		//observer.observe(notebook, dependencies);

		const terminalFactory = (handleCreatedTerminal)=>{
			handleCreatedTerminal(new JupyterLabTerminal(app, dependencies));
		};

				

		app.shell.add(treezPlugin, 'left', { rank: 200 });

		let isInitialized=false;

		let resizeObserver = new ResizeObserver( () => {	
			if(!isInitialized){
				Treez.initialize(d3, focusManager, editorFactory, terminalFactory);
				isInitialized=true;
			}
			__updateGoldenLayout(goldenLayout, layoutContainer);
		});
		resizeObserver.observe(layoutContainer);		

	});	

};

function __createEditorFactory(app){
    return (handleCreatedEditor) => {

		var editor = {
			setText: function(code, finishedHandler){
				var firstCell = __tryToGetActiveNotebookCell(app);

				var jupyterText = '%%javascript\n' + code;
				firstCell.editor.doc.setValue(jupyterText);

				if(finishedHandler){
					finishedHandler();
				}

			},
			processText: function(textHandler){
				var firstCell = __tryToGetActiveNotebookCell(app);
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


function __tryToGetActiveNotebookCell(app){   
	var notebook = __tryToGetActiveNotebook(app);
	return notebook
		?notebook.activeCell
		:null;    	
}

function __tryToGetActiveNotebook(app){
	var notebookPanel = __getActiveNotebookPanel(app);
    return notebookPanel
        ?notebookPanel.content
        :null;
}


function __getActiveNotebookPanel(app){
	var mainWidgets = app.shell.widgets('main');
	var widget = mainWidgets.next();
	while(widget){
		if(widget.sessionContext){
			var type = widget.sessionContext.type;
			if(type == 'notebook'){  //other wigets might be of type DocumentWidget
				if (widget.isVisible){
					return widget;
				}
			}
		}
		
		widget = mainWidgets.next();
	}
	return null;
}

function __updateGoldenLayout(layout, layoutContainer){
	var rect = layoutContainer.getBoundingClientRect();
	layout.updateSize(rect.width, rect.height);
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

function __createGoldenLayoutConfiguration(){
	//Also see http://golden-layout.com/docs/Config.html

	const firstColumn = _createFirstColumn();
	const secondColumn = _createSecondColumn();

	var goldenLayoutConfig = {
		settings: {		
			//showCloseIcon: false,
			showPopoutIcon: false
		},
		root : {
			type : 'row',
			content : [ 
			   firstColumn,
			   secondColumn,
			 ]
		}
	    
	 };	
	
	return goldenLayoutConfig;
}

function _createFirstColumn(){
	var column = {
		componentName : 'Tree',
		type : 'component',
		componentType: 'Tree',		
		isClosable: false,
		width: 25
	};
	return column;
}

function _createSecondColumn(){

	var firstRow = _createFirstRowOfSecondColumn();
	var secondRow = _createSecondRowOfSecondColumn();

	var column =  {
		type: 'column',		
		content: [	
			firstRow,
			secondRow,
		],		
	};
	return column;

}

function _createFirstRowOfSecondColumn(){
	return {
		type: 'stack',
		content: [
			{
				componentName : 'Properties',
				type : 'component',
				componentType: 'Properties',
				isClosable: false,
			},
			{
				componentName : 'Graphics',
				type : 'component',
				componentType: 'Graphics',
				isClosable: false,
			},
		]
		
	} ;
}

function _createSecondRowOfSecondColumn(){
	const row = {
		type : 'row',
		content :
		[
			{
				title : 'Monitor',
				type : 'column',				
				id: 'monitor',				
				content : [
					{
						componentName : 'Progress',
						type : 'component',
						componentType: 'Progress',
						isClosable: false
					},
					{
						componentName : 'Log',
						type : 'component',
						componentType: 'Log',
						isClosable: false
					}					
				]
			},  	
					  
			
   

	    ]
	};
    return row;
}

/*
Defines container DOM elements that are used/filled by Treez:
#treez-tree,
#treez-properties,
#treez-graphics,
#treez-progress,
#treez-log
*/
function __registerLayoutComponents(layout, containerElement){

    layout.registerComponent('Tree', function(container) {
		var element = container.getElement();
		element.setAttribute('id','treez-tree');		
	});

	layout.registerComponent('Properties', function(container) {
		var element = container.getElement();
		element.setAttribute('id','treez-properties')
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
		element.setAttribute('id','treez-graphics');
	});

	layout.registerComponent('Progress', function(container) {
		var element = container.getElement();
		element.setAttribute('id','treez-progress');		
	});

	layout.registerComponent('Log', function(container) {
		var element = container.getElement();
		element.setAttribute('id','treez-log');		
	});

	return focusManager;
}