export default class EditorView {

	constructor(mainViewModel, dTreez){	
		this.__mainViewModel = mainViewModel;
		this.__dTreez = dTreez;
			
		this.content = undefined;		
		this.model = undefined;	
		this.fileInput = undefined;	
		
	}

	buildView(){

        var self = this;

		var parentSelection = this.__dTreez.select('#treez-editor');

		var toolbar = parentSelection.append('div')
			.attr('id','editor-toolbar')
			.attr('class','treez-editor-toolbar');

       	var content = parentSelection.append('div')
			.attr('id','editorContent')
			.attr('class','treez-editor-content');	

		
		
			
		require(['orion/codeEdit', 'orion/Deferred'], function(CodeEdit, Deferred) {

			var code = "import Root from './src/root/root.js';\n"+		
				
				"\n"+
				"window.createModel = function(){\n"+
				"\n"+
				"	var root = new Root();\n"+	
				"	var models = root.createModels();\n"+
				"	var genericInput = models.createGenericInput();\n"+
				"	return root;\n"+
				"};\n";

			var codeEdit = new CodeEdit();			
			codeEdit.create({parent: 'editorContent'}).then(function(editorViewer) {
					editorViewer.setContents(code, 'application/javascript');
					self.__mainViewModel.setEditorViewer(editorViewer);					
					
					self.fileInput =self.createHiddenFileInputElement(editorViewer);
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
			.className('treez-editor-tool-icon')				
			.src('./icons/' + imageName)
			.title(tooltip)
			.onClick(action);
    }  

    openFromLocalStorage(editorViewer){
		var code = localStorage.getItem('treezEditorContent');
		if(code){
				this.setEditorContentAndUpdateTree(code, editorViewer);		
		} else {
			alert('Local storage does not yet contain code.')
		}	

    }

    setEditorContentAndUpdateTree(code, editorViewer){
    	editorViewer.setContents(code, 'application/javascript').then(()=>{
				this.__mainViewModel.getTreeView().toTree();
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

	createHiddenFileInputElement(editorViewer){
		var input = document.createElement('input');		
		input.setAttribute('type','file');
		input.onchange = (event)=>{	
							
				var files = input.files;
				if(files.length>0){
					var file = files[0]; 	
					var fileReader = new FileReader();
					fileReader.onloadend = ()=>{
						this.setEditorContentAndUpdateTree(fileReader.result, editorViewer);						
					}; 									      
					fileReader.readAsText(file);
				}
			}		
		return input;
	}
}
