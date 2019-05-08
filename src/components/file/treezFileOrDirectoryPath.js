import TreezAbstractPath from './treezAbstractPath.js';

export default class TreezFileOrDirectoryPath extends TreezAbstractPath {
	   
    constructor(){
        super();           
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
            textField.onchange = ()=>this.textFieldChanged();  
            textField.title = this.fullPath;
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
            executeButton.onclick = ()=>this.execute();   
            rightSpan.appendChild(executeButton); 
        }
        
        this.updateElements(this.value);	
        this.disableElements(this.disabled)
		this.hideElements(this.hidden); 
    }  

    __browseFileOrDirectoryPath(){  

       if(this.__isFile){
			window.treezTerminal.browseFilePath(this.directory).then((newValue)=>{
				if(newValue){
				   var oldValue = this.value;
					this.value = this.injectPathMap(newValue.trim());					
					this.dispatchEvent(new Event('change'));                	                	   
				}                    	
			}); 
       } else {
			window.treezTerminal.browseDirectoryPath(this.directory).then((newValue)=>{
				if(newValue){
				   var oldValue = this.value;
					this.value = this.injectPathMap(newValue.trim());	
				}                    	
			}); 
       }               
        
    }
    
   
   
}

window.customElements.define('treez-file-or-directory-path', TreezFileOrDirectoryPath); 