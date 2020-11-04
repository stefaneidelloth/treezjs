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

    
	Treez.importCssStyleSheet('/bower_components/golden-layout/src/css/goldenlayout-base.css');
	Treez.importCssStyleSheet('/bower_components/golden-layout/src/css/goldenlayout-light-theme.css');

	Treez.importStaticCssStyleSheet('https://cdn.jsdelivr.net/npm/handsontable@latest/dist/handsontable.full.min.css');		
	Treez.importStaticScript('https://cdn.jsdelivr.net/npm/handsontable@latest/dist/handsontable.full.min.js');
   

	require([		
		'golden-layout', 		
		'd3'		
	], function(		
		 GoldenLayout,		
		 d3
	) {

		var ReactWidget = dependencies['ReactWidget'];
	  
		var treezPlugin = new ReactWidget();
		treezPlugin.id = 'treez',
		treezPlugin.title.caption = 'Treez';
		treezPlugin.title.icon = 'treez-icon-class'; 
		treezPlugin.render = () => {}; //needs to exist 	

		treezPlugin.onActivateRequest =()=>{		
			//__increaseWidthOfLeftSideBar(app, treezPlugin);						
		};

		treezPlugin.onAfterHide = ()=>{
			//__decreaseWidthOfLeftSideBar(app, treezPlugin);
		}			

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

function __increaseWidthOfLeftSideBar(app, treezPlugin){

	var width = window.innerWidth/2;

    var leftStack = document.getElementById('jp-left-stack');    
	app.__widthOfLeftSideBarBackup = parseInt(leftStack.style.width);
    
	leftStack.style.width = '' + (width) +'px';
		
	var treezElement = document.getElementById('treez');
	treezElement.style.width = '' + (width-1) +'px';

	var splitHandle = leftStack.nextSibling;
	splitHandle.style.left = '' + (width) +'px';	
    splitHandle.style.backgroundColor = 'blue';

	var rightStack = splitHandle.nextSibling;
	rightStack.style.left = '' + (width +1) +'px';	
	
}

function __decreaseWidthOfLeftSideBar(app, treezPlugin){

	var width = app.__widthOfLeftSideBarBackup;    

	if(!width){
		return;
	}	

	var leftStack = document.getElementById('jp-left-stack');	
	leftStack.style.width =  '' + width + 'px';

	var splitHandle = leftStack.nextSibling;
	splitHandle.style.left = '' + width +'px';		

	var rightStack = splitHandle.nextSibling;
	rightStack.style.left = '' + (width +1) +'px';		
}

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
		var type = widget.constructor.name;
		if(type == 'NotebookPanel'){  //other wigets might be of type DocumentWidget
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