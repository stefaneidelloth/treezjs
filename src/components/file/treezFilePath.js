import TreezAbstractPath from './treezAbstractPath.js';

export default class TreezFilePath extends TreezAbstractPath {
            	
    constructor(){
        super(); 
    }            	

    connectedCallback() {
    	
        if(!this.__label){  

            let label = document.createElement('label');  
            this.__label = label;                     
            label.innerText = this.label;  
            label.className = 'treez-file-path-label';                     
            this.appendChild(label);  

            let container = document.createElement('div');
            this.__container = container;
            container.className= 'treez-file-path-container';                       
            this.appendChild(container);  

            let leftSpan = document.createElement('span');
            container.appendChild(leftSpan);                    

            let textField = document.createElement('input');
            this.__textField = textField;                                            
            textField.type='text' 
            textField.className='treez-file-path-text-field'; 
            textField.onchange = ()=>this.textFieldChanged();  
            textField.title = this.fullPath;
            leftSpan.appendChild(textField);

            let rightSpan = document.createElement('span');
            container.appendChild(rightSpan);                    

		    let browseButton = document.createElement('input');
		    this.__browseButton = browseButton;	
		    browseButton.className='treez-file-path-browse-button';					   
		    browseButton.type='button';
		    browseButton.title='Select file path';
		    browseButton.style.background = 'url("' + this.__urlPrefix + '/icons/browse.png")';
		    browseButton.style.backgroundRepeat = 'no-repeat';
		    browseButton.onclick = ()=>this.__browseFilePath();				   
            rightSpan.appendChild(browseButton);   

            let executeButton = document.createElement('input');
            this.__executeButton = executeButton;
            executeButton.className = 'treez-file-path-play-button';	
            executeButton.type = 'button';
            executeButton.title = 'Open (or execute) file';
            executeButton.style.background = 'url("' + this.__urlPrefix + '/icons/run_triangle.png")';
            executeButton.style.backgroundRepeat = 'no-repeat';
            executeButton.onclick = ()=>this.execute();   
            rightSpan.appendChild(executeButton);                    		
        }

        this.update();
    }    
   
    __browseFilePath(){    
       window.treezTerminal.browseFilePath(this.fullDirectory).then((filePath)=>{
       	 if(filePath){	
       	    let pathWithForwardSlashes = TreezAbstractPath.replacePathSeparators(filePath.trim());		
			this.value = this.injectPathMap(pathWithForwardSlashes);
			this.dispatchChangeEvent();	
       	 }  
       }); 
    }   
   
}

window.customElements.define('treez-file-path', TreezFilePath);                    

       