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
            label.className = 'treez-directory-path-label';
            this.appendChild(label);  

            var container = document.createElement('div');
            this.__container = container;
            container.className = 'treez-directory-path-container';
            this.appendChild(container);  

            var leftSpan = document.createElement('span');
            container.appendChild(leftSpan);                    

            var textField = document.createElement('input');
            this.__textField = textField; 
            textField.type='text' 
            textField.className='treez-directory-path-text-field'             
            textField.onchange = ()=>this.textFieldChanged();    
            textField.title = this.fullPath;   
            leftSpan.appendChild(textField);

            var rightSpan = document.createElement('span');
            container.appendChild(rightSpan);

		    var browseButton = document.createElement('input');
		    this.__browseButton = browseButton;	
		    browseButton.className='treez-directory-path-browse-button';					   
		    browseButton.type='button';
		    browseButton.title='Select directory';
		    browseButton.style.background = 'url("' + this.__urlPrefix + '/icons/browseDirectory.png")';
		    browseButton.style.backgroundRepeat = 'no-repeat';
		    browseButton.onclick = ()=>this.__browseDirectoryPath();				   
            rightSpan.appendChild(browseButton);   

            var executeButton = document.createElement('input');
            this.__executeButton = executeButton;
            executeButton.className = 'treez-directory-path-play-button';	
            executeButton.type = 'button';
            executeButton.title = 'Open directory';
            executeButton.style.background = 'url("' + this.__urlPrefix + '/icons/run_triangle.png")';
            executeButton.style.backgroundRepeat = 'no-repeat';
            executeButton.onclick = ()=>this.execute();   
            rightSpan.appendChild(executeButton);                    		
        }
        
        this.update();

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
            	let pathWithForwardSlashes = TreezAbstractPath.replacePathSeparators(result.trim());		
                this.value = this.injectPathMap(pathWithForwardSlashes);               
            }                    	
        }); 
    }   
                           
   
}
window.customElements.define('treez-directory-path', TreezDirectoryPath);                    

       