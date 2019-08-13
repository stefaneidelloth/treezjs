import DTreez from './core/dtreez/dTreez.js'; 

import TreeView from './views/treeView.js';
import EditorView from './views/editorView.js';
import MonitorView from './views/monitorView.js';
import GraphicsView from './views/graphicsView.js';

export default class Treez {
	
	//Do not use this construtor directly but the static method initialize.
	constructor(d3, focusManager){	
		
		this.dTreez = new DTreez(d3);  
			
		this.__editor = undefined;			
		this.__graphicsContainer = undefined;
		this.__focusManager = focusManager;
		
		this.__treeView = new TreeView(this);	
		this.__monitorView = new MonitorView(this);		
		this.__graphicsView = new GraphicsView(this);		
		this.__editorView = new EditorView(this);		
	}
	
	static config(treezConfig){
		window.treezConfig = treezConfig;
	}
	
	static initialize(d3, focusManager, editorFactory, terminalFactory){			
	
		Treez.__importCssStyleSheetsForViews();			
		var treez = new Treez(d3, focusManager);	
		Treez.__buildViews(treez, editorFactory);	
		
		terminalFactory((terminal)=>{
			window.treezTerminal = terminal;
		});

		return treez;		
	}

	static __importCssStyleSheetsForViews(){
		Treez.importCssStyleSheet('/src/views/treeView.css');
		Treez.importCssStyleSheet('/src/views/editorView.css');
		Treez.importCssStyleSheet('/src/views/propertyView.css');
		Treez.importCssStyleSheet('/src/views/monitorView.css');
		Treez.importCssStyleSheet('/src/views/graphicsView.css');
	}

	static __buildViews(treez, editorFactory){
		treez.__treeView.buildView();
		treez.__monitorView.buildView();
		treez.__graphicsView.buildView();
		treez.__editorView.buildView(editorFactory); //also calls setEditorViewer to set the editor viewer of the editor view
	}
	
	static importCssStyleSheet(href){
		var link = document.createElement('link');
		link.setAttribute('type','text/css');
		link.setAttribute('rel','stylesheet');
		link.setAttribute('href',window.treezConfig.home + href);
		document.head.appendChild(link);
	}	

	static importStaticCssStyleSheet(href){
		var link = document.createElement('link');
		link.setAttribute('type','text/css');
		link.setAttribute('rel','stylesheet');
		link.setAttribute('href', href);
		document.head.appendChild(link);
	}	

	static importScript(src){
		var script = document.createElement('script');
		script.setAttribute('src', window.treezConfig.home + src);		
		document.head.appendChild(script);
	}	

	static importStaticScript(src){
		var script = document.createElement('script');
		script.setAttribute('src', src);		
		document.head.appendChild(script);
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