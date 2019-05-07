import LabeledTreezElement from './../labeledTreezElement.js';

export default class TreezFileOrDirectoryPath extends LabeledTreezElement {

    constructor(){
        super();    
        this.__container = undefined;
        this.__label = undefined;   
        this.__textField = undefined;
        this.__browseButton = undefined;
        this.__executeButton = undefined;
        this.__isFile = true;
    }            	

    connectedCallback() {
    	
        if(!this.__label){                       

            var label = document.createElement('label');  
            this.__label = label;                     
            label.innerText = this.label;                       
            this.appendChild(label);  

            var container = document.createElement('div');
            this.__container = container;
            container.className ='treez-file-or-directory-path-container';                       
            this.appendChild(container);  

            var leftSpan = document.createElement('span');
            leftSpan.className = 'treez-file-or-directory-path-left-span';
            container.appendChild(leftSpan);     

             var urlPrefix = window.treezConfig
								?window.treezConfig.home
								:'';

          
            var textField = document.createElement('input');
            this.__textField = textField; 
            textField.type='text'  
            textField.className='treez-file-or-directory-path-text-field';
            textField.onchange = ()=>this.__textFieldChanged();                                              
            leftSpan.appendChild(textField);

            var rightSpan = document.createElement('span');
            rightSpan.style.verticalAlign = 'middle';
            container.appendChild(rightSpan); 

              var isFileButton = document.createElement('input');
			isFileButton.type='button';
			isFileButton.onclick = ()=>{
				if(this.__isFile){
					this.__isFile = false;
					isFileButton.style.background = 'url("' + urlPrefix + '/icons/directoryToggle.png")';
					 this.__browseButton.style.background = 'url("' + urlPrefix + '/icons/browseDirectory.png")';
					  this.__browseButton.title='browse directory path';	
				} else {
					this.__isFile = true;
					isFileButton.style.background = 'url("' + urlPrefix + '/icons/fileToggle.png")';
					 this.__browseButton.style.background = 'url("' + urlPrefix + '/icons/browse.png")';		
					 this.__browseButton.title='browse file path';			
				}
				isFileButton.style.backgroundRepeat = 'no-repeat';
				this.__browseButton.style.backgroundRepeat = 'no-repeat';
				
			};
			isFileButton.title='toggle file <=> directory';
			isFileButton.className='treez-file-or-directory-path-is-file-button';	
			isFileButton.style.background = 'url("' + urlPrefix + '/icons/fileToggle.png")';
			isFileButton.style.backgroundRepeat = 'no-repeat';
			
			rightSpan.appendChild(isFileButton);                


		    var browseButton = document.createElement('input');
		    this.__browseButton = browseButton;						   
		    browseButton.type='button';
		    browseButton.className='treez-file-or-directory-path-browse-button';	
		    browseButton.title='browse file path';
		    browseButton.style.background = 'url("' + urlPrefix + '/icons/browse.png")';
		    browseButton.style.backgroundRepeat = 'no-repeat';
		    browseButton.onclick = ()=>this.__browseFileOrDirectoryPath();				   
            rightSpan.appendChild(browseButton);   
            
            var executeButton = document.createElement('input');
            this.__executeButton = executeButton;
            executeButton.type = 'button';
            executeButton.className='treez-file-or-directory-path-play-button';	
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

    __browseFileOrDirectoryPath(){  

       if(this.__isFile){
			window.treezTerminal.browseFilePath(this.directory).then((newValue)=>{
				if(newValue){
				   var oldValue = this.value;
					this.value = newValue;
					this.__textField.value = newValue;	
					this.dispatchEvent(new Event('change'));                	                	   
				}                    	
			}); 
       } else {
			window.treezTerminal.browseDirectoryPath(this.directory).then((newValue)=>{
				if(newValue){
				   var oldValue = this.value;
					this.value = newValue;
					this.__textField.value = newValue;	
					this.dispatchEvent(new Event('change'));                	                	   
				}                    	
			}); 
       }               
        
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

window.customElements.define('treez-file-or-directory-path', TreezFileOrDirectoryPath); 