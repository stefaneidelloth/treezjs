import DTreez from '../core/dtreez/dTreez.js';

export default class TreeView {

	constructor(){
		this.dTreez = undefined;
		this.content = undefined;
		this.provideEditorView = undefined;	
		this.provideMonitorView = undefined;	
		this.model = undefined;		
	}

	buildView(element, mainViewModel, dTreez){

        var self = this;
        self.dTreez = dTreez;
		self.provideEditorView = mainViewModel.getEditorView;
		self.provideMonitorView = mainViewModel.getMonitorView;

		var parentSelection = self.dTreez.select(element);
		self.buildToolBar(parentSelection);
		self.buildContent(parentSelection);
	}

    buildToolBar(parentSelection){
		var toolbar = parentSelection.append("div");

		this.createButton(
			toolbar, 
			"root.png",
			"Create an empty root atom.\n"+
			"The current content of the tree viewer will be overwridden.", 
			()=>this.createRoot()
		);

		this.createButton(
			toolbar, 
			"toTree.png",
			"Build a tree from the code document that is currently opened in the text editor.\n" +
			"The current content of the tree viewer will be overwritten.", 
			()=>this.toTree()
		);

		this.createButton(
			toolbar, 
			"fromTree.png",
			"Build code from the tree.\n" +
			"The code will be written to currently opend document in the text editor.\n" +
			"The currently opened document will be overwritten.", 
			()=>this.fromTree()
		);

		this.createButton(
			toolbar, 
			"help.png",
			"Show the Treez help.", 
			()=>this.showHelp()
		);	
    }

    createButton(parent, imageName, tooltip, action){
    	parent
		.append("img")
		.className("treez-tool-icon")				
		.src("./icons/" + imageName)
		.title(tooltip)
		.onClick(action);
    }

    buildContent(parentSelection){       

 		var content = parentSelection.append("div")
 			.className("treez-tree-content");
 		this.content = content;
    }

    createRoot(){
    	console.log("create root");
    }

    toTree(){

        var self = this;
    	var editor = self.provideEditorView();    		   	
        var sourceCode =  editor.getText(); 

        window.scriptLoadedHook = function(){
        	window.scriptLoadedHook = undefined;
			self.model = window.createModel();
			self.refresh(); 			
		};

		var body = document.getElementsByTagName('body')[0];
		var script = document.createElement('script');
		script.type = 'module';
		script.innerHTML = sourceCode + "\n" + 
						   "if(window.scriptLoadedHook){window.scriptLoadedHook();}"; 			
		body.appendChild(script); 

		this.clearPropertiesView();
    }

    clearPropertiesView(){
    	var propertiesView = this.dTreez.select('#properties');
    	propertiesView.selectAll('treez-tab-folder').remove();	
		propertiesView.selectAll('div').remove();
    };  

    refresh(){
    	this.content.selectAll("div").remove(); 
    	this.content.selectAll("details").remove();   	
    	this.model.createTreeNodeAdaption(this.content, this);
    }

     fromTree(){
    	console.log("from tree");
    }

     showHelp(){
    	console.log("show help");
    }

}
