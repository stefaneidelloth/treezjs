import TreezAbstractPath from './treezAbstractPath.js';

export default class TreezFileOrDirectoryPath extends TreezAbstractPath {
	   
    constructor(){
        super();           
        this.__isFileMode = true;
        this.__isFileButton = undefined;
    }            	

    connectedCallback() {
    	
        if(!this.__label){                       

            let label = document.createElement('label');  
            this.__label = label;                     
            label.innerText = this.label;
            label.className = 'treez-file-or-directory-path-label';                     
            this.appendChild(label);  

            let container = document.createElement('div');
            this.__container = container;
            container.className ='treez-file-or-directory-path-container';                       
            this.appendChild(container);  

            let leftSpan = document.createElement('span');
            leftSpan.className = 'treez-file-or-directory-path-left-span';
            container.appendChild(leftSpan);
          
            let textField = document.createElement('input');
            this.__textField = textField; 
            textField.type='text'  
            textField.className='treez-file-or-directory-path-text-field';
            textField.onchange = () => this.textFieldChanged();
            textField.title = this.fullPath;
            leftSpan.appendChild(textField);

            let rightSpan = document.createElement('span');
            rightSpan.style.verticalAlign = 'middle';
            container.appendChild(rightSpan); 

            let isFileButton = document.createElement('input');
            this.__isFileButton = isFileButton;
			isFileButton.type='button';
			isFileButton.onclick = () => this.__isFileChanged();
			isFileButton.title='toggle file <=> directory';
			isFileButton.className='treez-file-or-directory-path-is-file-button';	
			isFileButton.style.background = 'url("' + this.__urlPrefix + '/icons/fileToggle.png")';
			isFileButton.style.backgroundRepeat = 'no-repeat';
			rightSpan.appendChild(isFileButton);

		    let browseButton = document.createElement('input');
		    this.__browseButton = browseButton;						   
		    browseButton.type='button';
		    browseButton.className='treez-file-or-directory-path-browse-button';	
		    browseButton.title='Select file- or directory path';
		    browseButton.style.background = 'url("' + this.__urlPrefix + '/icons/browse.png")';
		    browseButton.style.backgroundRepeat = 'no-repeat';
		    browseButton.onclick = ()=>this.__browseFileOrDirectoryPath();				   
            rightSpan.appendChild(browseButton);   
            
            let executeButton = document.createElement('input');
            this.__executeButton = executeButton;
            executeButton.type = 'button';
            executeButton.className='treez-file-or-directory-path-play-button';	
            executeButton.title = 'Open (or execute) file or directory';
            executeButton.style.background = 'url("' + this.__urlPrefix + '/icons/run_triangle.png")';
            executeButton.style.backgroundRepeat = 'no-repeat';
            executeButton.onclick = ()=>this.execute();   
            rightSpan.appendChild(executeButton); 
        }

        this.update();
    } 

    disableElements(booleanValue){
    	super.disableElements(booleanValue);
        TreezAbstractPath.hide(this.__isFileButton, booleanValue);
    }

    __browseFileOrDirectoryPath(){  

       if(this.__isFileMode){
			window.treezTerminal.browseFilePath(this.fullDirectory).then((newValue)=>{
				if(newValue){
					let pathWithForwardSlashes = TreezAbstractPath.replacePathSeparators(newValue.trim());					  
					this.value = this.injectPathMap(pathWithForwardSlashes);
				}                    	
			}); 
       } else {
			window.treezTerminal.browseDirectoryPath(this.fullParentDirectory).then((newValue)=>{
				if(newValue){
					let pathWithForwardSlashes = TreezAbstractPath.replacePathSeparators(newValue.trim());		
					this.value = this.injectPathMap(pathWithForwardSlashes);	
				}                    	
			}); 
       }               
        
    }

    __isFileChanged(){
        if(this.__isFileMode){
            this.__isFileMode = false;
            this.__isFileButton.style.background = 'url("' + this.__urlPrefix + '/icons/directoryToggle.png")';
            this.__isFileButton.style.backgroundRepeat = 'no-repeat';
            this.__browseButton.style.background = 'url("' + this.__urlPrefix + '/icons/browseDirectory.png")';
            this.__browseButton.style.backgroundRepeat = 'no-repeat';
            this.__browseButton.title='Browse directory path';
        } else {
            this.__isFileMode = true;
            this.__isFileButton.style.background = 'url("' + this.__urlPrefix + '/icons/fileToggle.png")';
            this.__isFileButton.style.backgroundRepeat = 'no-repeat';
            this.__browseButton.style.background = 'url("' + this.__urlPrefix + '/icons/browse.png")';
            this.__browseButton.style.backgroundRepeat = 'no-repeat';
            this.__browseButton.title='Browse file path';
        }
    }
   
}

window.customElements.define('treez-file-or-directory-path', TreezFileOrDirectoryPath); 