import DTreez from './../core/dtreez/dTreez.js';
import Root from './../root/root.js';

import Treez from './../treez.js'

export default class TreeView {

	constructor(treez){
		this.__treez = treez;	
		this.dTreez = treez.dTreez;
		this.content = undefined;	
		this.__lastAtomPathShownInPropertiesView = undefined;
	}

	buildView(){		
		var parentSelection = this.__treez.dTreez.select('#treez-tree');
		this.buildToolBar(parentSelection);
		this.buildContent(parentSelection);		
	}	

    buildToolBar(parentSelection){
		var toolbar = parentSelection.append('div');

		this.createButton(
			toolbar, 
			'root.png',
			'Create a new Root atom without children.\n'+
			'The current content of the Tree View will be overwritten.', 
			()=>this.createRoot()
		);

		this.createButton(
			toolbar, 
			'toTree.png',
			'Build tree model from the JavaScript source code that is currently opened in the Editor View.\n' +
			'The current content of the Tree View will be overwritten.', 
			()=>this.toTree()
		);

		this.createButton(
			toolbar, 
			'fromTree.png',
			'Generate JavaScript source code from the tree model.\n' +
			'The generated source code will be written to the Editor View.\n' +
			'The currently opened source code will be overwritten.', 
			()=>this.fromTree()
		);

		this.createButton(
			toolbar, 
			'help.png',
			'Open online help for Treez in a new browser tab.', 
			()=>this.showHelp()
		);	
    }

    createButton(parent, imageName, tooltip, action){
    	parent
		.append('img')
		.className('treez-tool-icon')				
		.src(Treez.imagePath(imageName))
		.title(tooltip)
		.onClick(action);
    }

    buildContent(parentSelection){       

 		var content = parentSelection.append('div')
 			.className('treez-tree-content');
 		this.content = content;
    }

    createRoot(){    	
    	this.model = new Root();
		this.refresh();
    }

    toTree(){

    	this.clearPropertiesView();
		this.clearMonitoringView(); 

		 window.scriptLoadedHook = ()=>{
				window.scriptLoadedHook = undefined;
				this.model = window.createModel();
				this.refresh(); 			
		};   

		var body = document.getElementsByTagName('body')[0];
		var script = document.createElement('script');
		script.type = 'module';   
    	 		   	
        this.editor.processText((sourceCode)=>{
			
			script.innerHTML = sourceCode + '\n' + 
							   'if(window.scriptLoadedHook){window.scriptLoadedHook();}'; 			
			body.appendChild(script); 
        }); 

        this.refreshPropertiesView();		
    }

    clearPropertiesView(){
    	var propertiesView = this.propertiesView;
    	propertiesView.selectAll('treez-tab-folder').remove();	
		propertiesView.selectAll('div').remove();
    };  

    clearMonitoringView(){
    	var progressView = this.__treez.dTreez.select('#treez-progress');    	
		progressView.selectAll('div').remove();

		var logView = this.__treez.dTreez.select('#treez-log');    	
		logView.selectAll('div').remove();
    };
    
    fromTree(){    	
    	var sourceCode = this.model.createCode();    		
    	this.editor.setText(sourceCode);    	    	
    }

    refresh(){
    	this.content.selectAll('div').remove(); 
    	this.content.selectAll('details').remove();   	
    	this.model.createTreeNodeAdaption(this.content, this);

    	this.refreshPropertiesView();
    }   

    refreshPropertiesView(){
    	this.clearPropertiesView();
    	if(this.__lastAtomPathShownInPropertiesView){
    		let lastAtom = null;
    		
    		try{
    			lastAtom = this.model.childFromRoot(this.__lastAtomPathShownInPropertiesView);
    		} catch(error){

    		}

    		if(lastAtom){
    			this.showProperties(lastAtom);
    		} 			 
    	}
    }

    showHelp(){
		var url = 'https://github.com/stefaneidelloth/treezjs/blob/master/README.md'
		var newWindow = window.open(url, '_blank');
		newWindow.focus();    	
    }

    showProperties(atom){ 
    	atom.createControlAdaption(this.propertiesView, this);
    	this.__lastAtomPathShownInPropertiesView=atom.treePath;
    }  
    
    setFocus(atom){
    	var propertiesView = this.__treez.dTreez.select('#treez-properties');
    	atom.createControlAdaption(propertiesView, this);
    }  

	get editor(){
		return this.__treez.editor;
	}

	get monitorView(){
		return this.__treez.monitorView;
	}

	get graphicsView(){
		return this.__treez.graphicsView;
	}

	get propertiesView(){
		return this.__treez.dTreez.select('#treez-properties');
	}

}
