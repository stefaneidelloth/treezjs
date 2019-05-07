import LabeledTreezElement from './../labeledTreezElement.js';

export default class TreezFilePath extends LabeledTreezElement {
            	
    constructor(){
        super();                  
        this.__label = undefined;   
        this.__textField = undefined;
        this.__browseButton = undefined;
        this.__executeButton = undefined;
    }            	

    connectedCallback() {
    	
        if(!this.__label){  

            var label = document.createElement('label');  
            this.__label = label;                     
            label.innerText = this.label;                       
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
            textField.onchange = ()=>this.__textFieldChanged();                                              
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
		    browseButton.title=' ';
		    browseButton.style.background = 'url("' + urlPrefix + '/icons/browse.png")';
		    browseButton.style.backgroundRepeat = 'no-repeat';
		    browseButton.onclick = ()=>this.__browseFilePath();				   
            rightSpan.appendChild(browseButton);   

            var executeButton = document.createElement('input');
            this.__executeButton = executeButton;
            executeButton.className='treez-file-path-play-button';	
            executeButton.type = 'button';
            executeButton.title = 'execute';
            executeButton.style.background = 'url("' + urlPrefix + '/icons/run_triangle.png")';
            executeButton.style.backgroundRepeat = 'no-repeat';
            executeButton.onclick = ()=>this.__execute();   
            rightSpan.appendChild(executeButton);                    		
        }
        
        this.updateElements(this.value);	
        this.disableElements(this.disabled)
		this.hideElements(this.hidden); 
    }
    
    updateElements(newValue){
    	if(this.__textField){ 
    	 	if(newValue !== undefined){
            	this.__textField.value = newValue; 
            }  else {
            	this.__textField.value = '';
            }											
		}					    
    }    
    
    __textFieldChanged(){
    	this.value = this.__textField.value;                	             	
    }
   
    disableElements(booleanValue){
    	if(this.__textField){   
    		this.__textField.disabled = booleanValue;
    		this.__browseButton.disabled = booleanValue;
    		this.__executeButton.disabled = booleanValue;
    	}
    }	
   
    hideElements(booleanValue){
    	if(this.__label){   
    		this.hide(this.__label, booleanValue);
    		this.hide(this.__container, booleanValue); 
    	}
    }	

    __execute(){
    	var command = this.__textField.value;
    	window.treezTerminal.execute(command, undefined, console.error);                     
    }  

    __browseFilePath(){    
       window.treezTerminal.browseFilePath(this.directory).then((filePath)=>{
       	 if(filePath){
			var oldValue = this.value;
			this.value = filePath;
			this.__textField.value = filePath;
			this.dispatchEvent(new Event('change'));  
       	 }  
       });              	
        
    }
    
    get directory(){
       var fullPath = this.__textField.value;
       if(!fullPath){
       		return null;
       }
       
       if(fullPath.endsWith('/')){
       		return fullPath;
       }
                                             
       var items = fullPath.split('/');
       var itemArray = items.slice(0, items.length-1);
       return itemArray.join('/');
       
    }       
   
}

window.customElements.define('treez-file-path', TreezFilePath);                    

       