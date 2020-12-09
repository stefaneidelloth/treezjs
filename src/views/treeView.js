import DTreez from './../core/dTreez/dTreez.js';
import Root from './../root/root.js';

import Treez from './../treez.js'

export default class TreeView {

	constructor(treez){
		this.__treez = treez;	
		this.dTreez = treez.dTreez;
		this.content = undefined;	
		this.__lastAtomPathShownInPropertiesView = undefined;
		this.__isRefreshing = false;
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
		this.clearGraphicsView();	

		window.scriptLoadedHook = ()=>{
				window.scriptLoadedHook = undefined;
				if(window.createModel){
					this.model = window.createModel();
				}				
				this.refresh(); 			
		}; 

		var self = this;
    	 		   	
        this.editor.processText(async (sourceCode)=>{

        	await new Promise((resolve, reject)=>{               

				var script = document.createElement('script');
				script.type = 'module';
				script.innerHTML = sourceCode + '\n' + 
								   'if(window.scriptLoadedHook){window.scriptLoadedHook();}'; 

				var windowErrorHandler = (event) =>{
					event.preventDefault();
					var error = event.error;
					error.stack = error.stack + '\n\n' + sourceCode;					
					window.removeEventListener('error', windowErrorHandler);
					reject(error);
				};

				window.addEventListener('error', windowErrorHandler);  

				var rejectHandler = (event) =>{
					console.log(event);
					window.removeEventListener('error', windowErrorHandler);
					var message = 'Please check the import statements:\n'+sourceCode;
					reject(message);						
				};				

				script.addEventListener('error', rejectHandler);				

				script.addEventListener('abort', rejectHandler);			
				             

				var loadedHandler = ()=>{
					window.removeEventListener('error', windowErrorHandler);
					resolve();
				};

                script.addEventListener('load', loadedHandler);
				script.onload = loadedHandler;

				var body = document.getElementsByTagName('body')[0];
				try {
					body.appendChild(script); 
				} catch(error){
					reject(error);
				}				

			})
			.catch(error => {
				console.warn('[Treez]: Could not process JavaScript code:\n', error);
			})
			.then(()=>{
				self.refreshPropertiesView();
			});        			
			
        });        
        	
    }
    

    clearGraphicsView(){
   		this.graphicsView.clear();   	
    };

    clearMonitoringView(){
    	var progressView = this.__treez.dTreez.select('#treez-progress');    	
		progressView.selectAll('div').remove();

		var logView = this.__treez.dTreez.select('#treez-log');    	
		logView.selectAll('div').remove();
    };

    clearPropertiesView(){
    	var propertiesView = this.propertiesView;
    	propertiesView.selectAll('treez-tab-folder').remove();	
		propertiesView.selectAll('div').remove();
    };  

   
    
    fromTree(){    	
    	var sourceCode = this.model.createCode();    		
    	this.editor.setText(sourceCode);    	    	
    }

    refresh(atom){
    	if(this.__isRefreshing){
    		return;
    	}

    	this.__isRefreshing = true;
    	this.content.selectAll('div').remove(); 
    	this.content.selectAll('details').remove();  
    	if(!this.model){
    		this.__isRefreshing = false;
    		return;
    	} 	
    	this.model.createTreeNodeAdaption(this.content, this);

		if(atom){
			this.__lastAtomPathShownInPropertiesView = atom.treePath;
		}
		
    	this.refreshPropertiesView();
    	this.__isRefreshing = false;
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
