export default class EditorView {

	constructor(){
		this.d3 = undefined;
		this.content = undefined;
		this.provideEditor = undefined;	
		this.model = undefined;	
		this.fileInput = undefined;	
	}

	buildView(element, mainViewModel, d3){

        var self = this;
        self.d3=d3;
        self.mainViewModel = mainViewModel;

		var parentSelection = d3.select(element);

		var toolbar = parentSelection.append('div')
			.attr('id','editor-toolbar')
			.attr('class','treez-editor-toolbar');

       	var content = parentSelection.append('div')
			.attr('id','editorContent')
			.attr('class','treez-editor-content');	

		
		this.fileInput =this.createHiddenFileInputElement();
			
		require(['orion/codeEdit', 'orion/Deferred'], function(CodeEdit, Deferred) {

			var code = "import Atom from './src/core/atom/atom.js';\n"+		
				"import ComponentAtom from './src/core/component/componentAtom.js';\n"+
				"\n"+
				"window.createModel = function(){\n"+
				"\n"+
				"	var root = new ComponentAtom('root');\n"+
				"	var firstChild = new Atom('firstChild');\n"+
				"	root.addChild(firstChild);\n"+
				"	var secondChild = new Atom('secondChild');\n"+
				"	root.addChild(secondChild);\n"+
				"	var grandChild = new Atom('grandChild');\n"+
				"	secondChild.addChild(grandChild);\n"+
				"	return root;\n"+
				"};\n";

			var codeEdit = new CodeEdit();			
			codeEdit.create({parent: 'editorContent'}).then(function(editorViewer) {
					editorViewer.setContents(code, 'application/javascript');
					mainViewModel.editorViewer = editorViewer;					
					self.fillEditorToolbar(toolbar, editorViewer);
				});
		});       

	}

    fillEditorToolbar(toolbar, editorViewer){

		this.createButton(
			toolbar, 
			'browse.png',
			'Open from ...', 
			()=>{this.fileInput.click();}
		);

		this.createButton(
			toolbar, 
			'save.png',
			'Save as ...', 
			()=>{this.save(editorViewer);}
		);

		this.createButton(
			toolbar, 
			'openFromLocalStorage.png',
			'Open from local storage', 
			()=>{this.openFromLocalStorage(editorViewer);}
		);

		this.createButton(
			toolbar, 
			'saveToLocalStorage.png',
			'Save to local storage', 
			()=>{this.saveToLocalStorage(editorViewer);}
		);

	}

	createButton(parent, imageName, tooltip, action){
			parent
			.append("img")
			.attr("class","treez-editor-tool-icon")				
			.attr("src","./icons/" + imageName)
			.attr("title", tooltip)
			.on("click", action);
    }  

    openFromLocalStorage(editorViewer){
		var code = localStorage.getItem('treezEditorContent');
		if(code){
				this.setEditorContentAndUpdateTree(code);		
		} else {
			alert('Local storage does not yet contain code.')
		}	

    }

    setEditorContentAndUpdateTree(code){
    	this.mainViewModel.editorViewer.setContents(code, 'application/javascript').then(()=>{
				this.mainViewModel.treeView.toTree();
			});
    }

    saveToLocalStorage(editorViewer){
    	var self = this;
    	var editor = editorViewer.editor;
    	var editorContext = editor.getEditorContext();
    	editorContext.getText().then(function(text){    		
    		localStorage.setItem('treezEditorContent', text);			
    	}); 
    }

    save(editorViewer){
    	var self = this;
    	var editor = editorViewer.editor;
    	var editorContext = editor.getEditorContext();
    	editorContext.getText().then(function(text){    		
    		self.download(text, 'treezEditorContent.js');			
    	});    	
    }



    download(text, filename) {
		var file = new Blob([text], {type: 'text/javascript'});				
		var a = document.createElement("a");
		var url = URL.createObjectURL(file);
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		setTimeout(function() {
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);  
		}, 0);
				
	}

	createHiddenFileInputElement(){
		var input = document.createElement('input');		
		input.setAttribute('type','file');
		input.onchange = (event)=>{	
							
				var files = input.files;
				if(files.length>0){
					var file = files[0]; 	
					var fileReader = new FileReader();
					fileReader.onloadend = ()=>{
						this.setEditorContentAndUpdateTree(fileReader.result);						
					}; 									      
					fileReader.readAsText(file);
				}
			}		
		return input;
	}
}
