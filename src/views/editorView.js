export default class EditorView {

	constructor(mainViewModel, dTreez){	
		this.__mainViewModel = mainViewModel;	
		this.__dTreez = dTreez;
			
		this.content = undefined;		
		this.model = undefined;	
		this.fileInput = undefined;			
	}

	buildView(editorFactory){

        var self = this;

		var parentSelection = this.__dTreez.select('#treez-editor');

		var toolbar = parentSelection.append('div')
			.attr('id','treez-editor-toolbar')
			.attr('class','treez-editor-toolbar');

       	var content = parentSelection.append('div')
			.attr('id','treez-editor-content')
			.attr('class','treez-editor-content');	

		editorFactory((editor)=>{
			this.__mainViewModel.editor = editor;	
			this.fileInput = this.createHiddenFileInputElement(editor);
			this.fillEditorToolbar(toolbar, editor);
		});	   

	}

    fillEditorToolbar(toolbar, editor){

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
			()=>{this.save(editor);}
		);

		this.createButton(
			toolbar, 
			'openFromLocalStorage.png',
			'Open from local storage', 
			()=>{this.openFromLocalStorage(editor);}
		);

		this.createButton(
			toolbar, 
			'saveToLocalStorage.png',
			'Save to local storage', 
			()=>{this.saveToLocalStorage(editor);}
		);

	}

	createButton(parent, imageName, tooltip, action){
			parent
			.append("img")
			.className('treez-editor-tool-icon')				
			.src(window.treezHome + '/icons/' + imageName)
			.title(tooltip)
			.onClick(action);
    }  

    openFromLocalStorage(editor){
		var code = localStorage.getItem('treezEditorContent');
		if(code){
				this.setEditorContentAndUpdateTree(code, editor);		
		} else {
			alert('Local storage does not yet contain code.')
		}	

    }

    setEditorContentAndUpdateTree(code, editor){
    	editor.setText(code, ()=>{
    		this.__mainViewModel.treeView.toTree();
    	});
    }

    saveToLocalStorage(editor){    	
    	editor.processText((text)=>localStorage.setItem('treezEditorContent', text));    	
    }

    save(editor){
    	editor.processText((text)=>this.download(text, 'treezEditorContent.js'));    	
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

	createHiddenFileInputElement(editor){
		var input = document.createElement('input');		
		input.setAttribute('type','file');
		input.onchange = (event)=>{	
							
				var files = input.files;
				if(files.length>0){
					var file = files[0]; 	
					var fileReader = new FileReader();
					fileReader.onloadend = ()=>{
						this.setEditorContentAndUpdateTree(fileReader.result, editor);						
					}; 									      
					fileReader.readAsText(file);
				}
			}		
		return input;
	}
}
