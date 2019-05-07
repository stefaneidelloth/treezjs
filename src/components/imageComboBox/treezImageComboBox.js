import TreezComboBox from './../comboBox/treezComboBox.js';

export default class TreezImageComboBox extends TreezComboBox {                
				
    constructor(){
        super();  
        this.__comboButton = undefined;
        this.__optionPanel = undefined;
    }                

	connectedCallback() {
		
		this.beforeConnectedCallbackHook();
    	

        if(!this.__comboBox){   

			var container = document.createElement('div');    
			this.__container = container;
			container.setAttribute('class','treez-image-combo-box-container');
			this.appendChild(container);      

			var labelDiv = document.createElement('div');
			container.appendChild(labelDiv);
			
			var label = document.createElement('label');
			this.__label = label;
			container.appendChild(label);   
			label.innerText = this.label;   
			label.setAttribute('class','treez-image-combo-box-label');							          

			var comboBox = document.createElement('div');                       
			this.__comboBox = comboBox;	
			container.appendChild(comboBox);
			comboBox.setAttribute('class','treez-image-combo-box-');	
			comboBox.tabIndex=0; //required for onblur event to work
			comboBox.onblur = () => this.__collapseComboBox();
			
			
			var comboBoxDisplay = document.createElement('div');
			comboBoxDisplay.setAttribute('class','treez-image-combo-box-display');	
			comboBox.appendChild(comboBoxDisplay);

            var imageLabel = document.createElement('img');
			comboBoxDisplay.appendChild(imageLabel);
			this.__imageLabel = imageLabel;
			imageLabel.setAttribute('class','treez-image-combo-box-image-label');															
			imageLabel.onclick = ()=>this.__expandComboBox();

            var comboButton = document.createElement('span');
            this.__comboBotton = comboButton;
            comboBoxDisplay.appendChild(comboButton);						
			comboButton.setAttribute('class','treez-image-combo-box-button');	
			comboButton.innerText = '▾';
			comboButton.onclick = ()=>this.__expandComboBox();

			let optionPanel = document.createElement('div');
			this.__optionPanel = optionPanel;						
			comboBox.appendChild(optionPanel);
			optionPanel.setAttribute('class','treez-image-combo-box-option-panel');	
			
			if(this.options){
               this.__recreateOptionTags();						  
			}  
			
			this.__collapseComboBox();                                                              		
        }
        
        this.updateElements(this.value);	
        this.disableElements(this.disabled)
		this.hideElements(this.hidden); 
        
        
    }  
	
	//can be overridden by inheriting classes
	beforeConnectedCallbackHook(){
		
	}

    updateElements(newValue){                 	
    	if(this.__imageLabel){                    	
			this.__updateImageLabel(); 			
    	}					    
    } 
    
    __comboBoxChanged(option){
    	this.value = option;    		
    }
   
    disableElements(booleanValue){
    	if(this.__comboButton){                   		
    		this.__comboButton.disabled = booleanValue;                		
    	}
    }	
   
    hideElements(booleanValue){
    	if(this.__container){                 		
    		this.hide(this.__container, booleanValue); 
    	}
    }	

    __updateImageLabel(){
    	let imageUrl = this.__selectedImageUrl();
    	
		if(imageUrl){
			this.__imageLabel.setAttribute('src', imageUrl);							
		}
    }

	__expandComboBox(){
		this.__optionPanel.style='display:block;';
	}	

	__collapseComboBox(){
		this.__optionPanel.style='display:none;';
	}	

	__selectedImageUrl(){
		let val = this.getAttribute('value');
		if (val){
			return this.__nameToImageUrl(val);
		} else {
			if (this.options){
				let optionEntries = this.options.split(',')
				if(optionEntries.length>0){					
					return this.__nameToImageUrl(optionEntries[0]);
				}
			}
			return undefined;
		}
	}

	__nameToImageUrl(name){

        var trimmedName = this.constructor.name.substring(5);

        var folderName = trimmedName[0].toLowerCase() + trimmedName.substring(1);
        
        var urlPrefix = window.treezConfig
	        				?window.treezConfig.home
	        				:'';

		return urlPrefix + '/src/components/' + folderName + '/' + name + this.__imageFormat()
	}		

	__imageFormat(){
		return '.png';
	}

	__recreateOptionTags(){

		var self = this;				   			    

		this.__clearOptionPanel();					

		this.__optionItems().forEach(option=>{					
			let optionElement = document.createElement('div')
			optionElement.setAttribute('class','treez-image-combo-box-option');
			self.__optionPanel.appendChild(optionElement);
			
			let optionImage = document.createElement('img');
			optionImage.setAttribute('class','treez-image-combo-box-option-image');
			optionImage.title = option;
			optionElement.appendChild(optionImage);	

			if(option){
				let optionImageUrl = this.__nameToImageUrl(option);
		 		optionImage.src=optionImageUrl;	
			}		 					 	

		 	optionElement.onclick = ()=>{
		 		this.__comboBoxChanged(option);		 		
		 		self.__collapseComboBox();
		 	};
		   
		});
		
		this.__refreshSelectedValue();
				
	}

	__clearOptionPanel(){
		var optionPanel = this.__optionPanel;  
		while (optionPanel.hasChildNodes()) {
			optionPanel.removeChild(optionPanel.lastChild);
		}
	}

	__optionItems(){
		return this.options.split(',');
	}

	__hasOption(option){
		return this.__optionItems().indexOf(option) > -1
	}

	__refreshSelectedValue(){				
		let oldValue = this.getAttribute('value');
		if(oldValue){
			if (!this.__hasOption(oldValue)){						
				this.__tryToSelectFirstOption()
			}					
		} else {
			this.__tryToSelectFirstOption()
		}
	}

	__tryToSelectFirstOption(){
		var optionItems = this.__optionItems();
		if (optionItems.length > 0 ){								
			this.setAttribute('value_', optionItems[0]);
		}	
	}                         
}

window.customElements.define('treez-image-combo-box', TreezImageComboBox);    