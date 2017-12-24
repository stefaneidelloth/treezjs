
var self = {
	d3: undefined,
	content: undefined,
	provideEditor: undefined
};

export function build(element, provideEditor){

	self.provideEditor = provideEditor;

    require(['d3'], function(d3){
    	self.d3=d3;
    	console.log("building tree view");
    	var parentSelection = d3.select(element);
    	buildToolBar(parentSelection);
    	buildContent(parentSelection);
    });
}

    function buildToolBar(parentSelection){
		var toolbar = parentSelection.append("div");

		createButton(
			toolbar, 
			"root.png",
			"Create an empty root atom.\n"+
			"The current content of the tree viewer will be overwridden.", 
			createRoot
		);

		createButton(
			toolbar, 
			"toTree.png",
			"Build a tree from the code document that is currently opened in the text editor.\n" +
			"The current content of the tree viewer will be overwritten.", 
			toTree
		);

		createButton(
			toolbar, 
			"fromTree.png",
			"Build code from the tree.\n" +
			"The code will be written to currently opend document in the text editor.\n" +
			"The currently opened document will be overwritten.", 
			fromTree
		);

		createButton(
			toolbar, 
			"help.png",
			"Show the Treez help.", 
			showHelp
		);	
    }

    function createButton(parent, imageName, tooltip, action){
    	parent
		.append("img")
		.style("margin","5px")		
		.attr("src","./icons/" + imageName)
		.attr("title", tooltip)
		.on("click", action);
    }

    function buildContent(parentSelection){
 		var content = parentSelection.append("div");

 		content.style("background-color","white")
 		.style("position","absolute")
 		.style("top","25px")
 		.style("bottom","0") 		
 		.style("width","100%");

 		self.content = content;
    }

    function createRoot(){
    	console.log("create root");
    }

    function toTree(){
    	 var editor = self.provideEditor();     	   	
         var sourceCode = editor.getText();
         //console.log(sourceCode);

         eval(sourceCode);
         var model = window.createModel(); 
         setModel(model);         
    }

     function fromTree(){
    	console.log("from tree");
    }

     function showHelp(){
    	console.log("show help");
    }

    function setModel(model){
    	self.content.html(model.id);
    }
