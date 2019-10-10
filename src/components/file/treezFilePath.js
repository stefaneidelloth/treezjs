import TreezAbstractPath from './treezAbstractPath.js';

export default class TreezFilePath extends TreezAbstractPath {
            	
    constructor(){
        super(); 
    }            	

    connectedCallback() {
    	
        if(!this.__label){  

            var label = document.createElement('label');  
            this.__label = label;                     
            label.innerText = this.label;  
            label.className = 'treez-file-path-label';                     
            this.appendChild(label);  

            var container = document.createElement('div');
            this.__container = container;
            container.className= 'treez-file-path-container';                       
            this.appendChild(container);  

            var leftSpan = document.createElement('span');
            container.appendChild(leftSpan);                    

            var textField = document.createElement('input');
            this.__textField = textField;                                            
            textField.type='text' 
            textField.className='treez-file-path-text-field'; 
            textField.onchange = ()=>this.textFieldChanged();  
            textField.title = this.fullPath;
            leftSpan.appendChild(textField);

            var rightSpan = document.createElement('span');
            container.appendChild(rightSpan);
            
            var urlPrefix = window.treezConfig
								?window.treezConfig.home
								:'';

		    var browseButton = document.createElement('input');
		    this.__browseButton = browseButton;	
		    browseButton.className='treez-file-path-browse-button';					   
		    browseButton.type='button';
		    browseButton.title='Select file path';
		    browseButton.style.background = 'url("' + urlPrefix + '/icons/browse.png")';
		    browseButton.style.backgroundRepeat = 'no-repeat';
		    browseButton.onclick = ()=>this.__browseFilePath();				   
            rightSpan.appendChild(browseButton);   

            var executeButton = document.createElement('input');
            this.__executeButton = executeButton;
            executeButton.className = 'treez-file-path-play-button';	
            executeButton.type = 'button';
            executeButton.title = 'Open (or execute) file';
            executeButton.style.background = 'url("' + urlPrefix + '/icons/run_triangle.png")';
            executeButton.style.backgroundRepeat = 'no-repeat';
            executeButton.onclick = ()=>this.execute();   
            rightSpan.appendChild(executeButton);                    		
        }

        this.update();
    }    
   
    __browseFilePath(){    
       window.treezTerminal.browseFilePath(this.fullDirectory).then((filePath)=>{
       	 if(filePath){			
			this.value = this.injectPathMap(filePath.trim());
			this.dispatchChangeEvent();	
       	 }  
       }); 
    }   
   
}

window.customElements.define('treez-file-path', TreezFilePath);                    

       