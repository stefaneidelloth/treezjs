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
		    browseButton.title=' ';
		    browseButton.style.background = 'url("' + urlPrefix + '/icons/browseDirectory.png")';
		    browseButton.style.backgroundRepeat = 'no-repeat';
		    browseButton.onclick = ()=>this.__browseDirectoryPath();				   
            rightSpan.appendChild(browseButton);   

            var executeButton = document.createElement('input');
            this.__executeButton = executeButton;
            executeButton.className='treez-directory-path-play-button';	
            executeButton.type='button';
            executeButton.title='execute';
            executeButton.style.background = 'url("' + urlPrefix + '/icons/run_triangle.png")';
            executeButton.style.backgroundRepeat = 'no-repeat';
            executeButton.onclick = ()=>this.execute();   
            rightSpan.appendChild(executeButton);                    		
        }
        
        this.updateElements(this.value);	
        this.disableElements(this.disabled)
		this.hideElements(this.hidden); 
    }
    
   
    __browseDirectoryPath(){                  
        window.treezTerminal.browseDirectoryPath(this.parentDirectory).then((result)=>{
            if(result){
                this.value = result;
        	    this.__textField.value = result;
        	    this.dispatchEvent(new Event('change'));
            }                    	
        }); 
    }

    set pathMapProvider(provider){
    	this.__pathMapProvider = provider;
    	if(this.__textField){
    	    this.__textField.title = this.fullPath;
    	}
    }
    
    get fullPath(){
    	
    	var fullPath = this.value;
    	
    	var pathMap = this.__pathMapProvider
    							?this.__pathMapProvider.pathMap
    							:[];
    							
    	for(var entry of pathMap.reverse()){
    		var placeHolder = '{$' + entry.name + '$}';
    		var path = entry.value;
    		fullPath = fullPath.replace(placeHolder, path);
    	}
    	
    	if(fullPath.includes('{$')){
    		console.warn('File path including unknown path variable: "' + fullPath + '"');
    	}
    	
    	return fullPath;
    }
    
                           
   
}
window.customElements.define('treez-directory-path', TreezDirectoryPath);                    

       