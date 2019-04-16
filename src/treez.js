import TreeView from './views/treeView.js';
import EditorView from './views/editorView.js';
import MonitorView from './views/monitorView.js';
import GraphicsView from './views/graphicsView.js';

import DTreez from './core/dtreez/dTreez.js'; 

export default class Treez {
	
	//Do not use this construtor directly but the static method initialize.
	constructor(d3, editorFactory, focusManager){		
		
		var dTreez = new DTreez(d3);  
		
		this.__editor = undefined;			
		this.__graphicsContainer = undefined;
		
		this.__treeView = new TreeView(this, dTreez);
		this.__treeView.buildView();

		this.__monitorView = new MonitorView(this, dTreez);
		this.__monitorView.buildView();
		
		this.__graphicsView = new GraphicsView(this, dTreez);
		this.__graphicsView.buildView();
		
		this.__editorView = new EditorView(this, dTreez);
		this.__editorView.buildView(editorFactory); //also calls setEditorViewer to set the editor viewer of the editor view

		this.__focusManager = focusManager;
	}
	
	static config(treezConfig){
		window.treezConfig = treezConfig;
	}
	
	static initialize(d3, editorFactory, terminalFactory, focusManager){			
	
		Treez.importCssStyleSheet('/src/views/treeView.css');
		Treez.importCssStyleSheet('/src/views/editorView.css');
		Treez.importCssStyleSheet('/src/views/propertyView.css');
		Treez.importCssStyleSheet('/src/views/monitorView.css');
		Treez.importCssStyleSheet('/src/views/graphicsView.css');
		
		terminalFactory((terminal)=>{
			window.treezTerminal = terminal;
		});			
		
		new Treez(d3, editorFactory, focusManager);			
	}
	
	static importCssStyleSheet(href){
		var link = document.createElement('link');
		link.setAttribute('type','text/css');
		link.setAttribute('rel','stylesheet');
		link.setAttribute('href',window.treezConfig.home + href);
		document.head.appendChild(link);
	}	
	
	static imagePath(imageName){
		return window.treezConfig.home + '/icons/' + imageName;
	}

	focusGraphicsView(){		
		this.__focusManager.focusGraphicsView();
	}

	get treeView(){
		return this.__treeView;
	}

	get editorView(){
		return this.__editorViewer.editor.getTextView();
	}

	set editor(editor){
		return this.__editor = editor;
	}

	get editor(){
		return this.__editor;
	}

	get monitorView(){
		return this.__monitorView;
	}

	get graphicsView(){
		return this.__graphicsView;
	}	
	
}