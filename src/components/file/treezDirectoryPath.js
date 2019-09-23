import TreezAbstractPath from './treezAbstractPath.js';

export default class TreezDirectoryPath extends TreezAbstractPath {            	

    constructor(){
        super(); 
    }            	

    connectedCallback() {    	
    	
        if(!this.__label){  

            var label = document.createElement('label');  
            this.__label = label;                     
            label.innerText = this.label;                       
            this.appendChild(label);  

            var container = document.createElement('div');
            this.__container = container;
            container.className ='treez-directory-path-container';                       
            this.appendChild(container);  

            var leftSpan = document.createElement('span');
            container.appendChild(leftSpan);                    

            var textField = document.createElement('input');
            this.__textField = textField; 
            textField.type='text' 
            textField.className='treez-directory-path-text-field' 
            textField.title = this.fullPath;
            textField.onchange = ()=>this.textFieldChanged();             
            
            leftSpan.appendChild(textField);

            var rightSpan = document.createElement('span');
            container.appendChild(rightSpan); 
            
            var urlPrefix = window.treezConfig
            					?window.treezConfig.home
            					:'';

		    var browseButton = document.createElement('input');
		    this.__browseButton = browseButton;	
		    browseButton.className='treez-directory-path-browse-button';					   
		    browseButton.type='button';
		    browseButton.title='Select directory';
		    browseButton.style.background = 'url("' + urlPrefix + '/icons/browseDirectory.png")';
		    browseButton.style.backgroundRepeat = 'no-repeat';
		    browseButton.onclick = ()=>this.__browseDirectoryPath();				   
            rightSpan.appendChild(browseButton);   

            var executeButton = document.createElement('input');
            this.__executeButton = executeButton;
            executeButton.className='treez-directory-path-play-button';	
            executeButton.type='button';
            executeButton.title='Open directory';
            executeButton.style.background = 'url("' + urlPrefix + '/icons/run_triangle.png")';
            executeButton.style.backgroundRepeat = 'no-repeat';
            executeButton.onclick = ()=>this.execute();   
            rightSpan.appendChild(executeButton);                    		
        }
        
        this.updateElements(this.value);	
        this.disableElements(this.disabled)
		this.hideElements(this.hidden); 
    }

    execute(){    	
    	window.treezTerminal.openDirectory(this.fullPath, (message) => {
    			console.error(message);
    			alert(message);
    		}
    	);
    		                     
    }     
   
    __browseDirectoryPath(){                  
        window.treezTerminal.browseDirectoryPath(this.fullParentDirectory).then((result)=>{
            if(result){
                this.value = this.injectPathMap(result.trim());               
            }                    	
        }); 
    }   
                           
   
}
window.customElements.define('treez-directory-path', TreezDirectoryPath);                    

       