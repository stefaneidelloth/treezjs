import TreezComboBox from './treezComboBox.js';

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
			
			var label = document.createElement('label');
			this.__label = label;
			container.appendChild(label);   
			label.innerText = this.label;   
			label.setAttribute('class','treez-image-combo-box-label');							          

			var comboBox = document.createElement('div');                       
			this.__comboBox = comboBox;	
			container.appendChild(comboBox);
			comboBox.setAttribute('class','treez-image-combo-box');	
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
            this.__comboButton = comboButton;
            comboBoxDisplay.appendChild(comboButton);						
			comboButton.setAttribute('class','treez-image-combo-box-button');	
			comboButton.innerText = '▾';
			comboButton.onclick = ()=>this.__expandComboBox();

			let optionPanel = document.createElement('div');
			this.__optionPanel = optionPanel;						
			comboBox.appendChild(optionPanel);
			optionPanel.setAttribute('class','treez-image-combo-box-option-panel');	

			this.__recreateOptionTags();
			this.__collapseComboBox();                                                              		
        }
        
        this.update();
        
    }  
	
	//can be overridden by inheriting classes
	beforeConnectedCallbackHook(){
		
	}

    updateElements(newValue){                 	
    	if(this.__imageLabel){                    	
			this.__updateImageLabel(); 			
    	}					    
    }
       
    disableElements(booleanValue){
		if(booleanValue === undefined){
			throw Error('This method expects a boolean argument');
		}
    	if(this.__comboButton){                   		
    		this.__comboButton.disabled = booleanValue;                		
    	}
    }	
   
    hideElements(booleanValue){
		if(booleanValue === undefined){
			throw Error('This method expects a boolean argument');
		}
    	if(this.__container){                 		
    		TreezComboBox.hide(this.__container, booleanValue); 
    	}
	}	
	
	__comboBoxChanged(option){
    	this.value = option;    		
    }

    __updateImageLabel(){
    	let imageUrl = this.__selectedImageUrl;
    	
		if(imageUrl){
			this.__imageLabel.setAttribute('src', imageUrl);							
		}
    }

	__expandComboBox(){
		this.__optionPanel.style.display = 'block';
	}	

	__collapseComboBox(){
		this.__optionPanel.style.display = 'none';
	}

	__nameToImageUrl(name){

        var trimmedName = this.constructor.name.substring(5);       
        
        var urlPrefix = window.treezConfig
	        				?window.treezConfig.home
	        				:'';

		return urlPrefix + '/src/components/' + this.imageFolderPath + '/' + name + this.__imageFormat
	}	

	__recreateOptionTags(){

		var self = this;				   			    

		this.__clearOptionPanel();					

		this.options.forEach(option=>{
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

	__refreshSelectedValue(){
		if (!this.hasOption(this.value)){
			this.__tryToSelectFirstOption();
		}
	}

	__tryToSelectFirstOption(){
		if (this.hasOptions){
			this.setAttribute('value', this.options[0]);
		}	
	}  

	get __selectedImageUrl(){
		let value = this.getAttribute('value');

		if(value === null || value === undefined || value === 'undefined' || value === 'null'){
			if (this.hasOptions){
				return this.__nameToImageUrl(this.options[0]);
			}
			return undefined;
		}

		return this.__nameToImageUrl(value);

	}
	
	get __imageFormat(){
		return '.png';
	}

	get imageFolderPath(){
		return 'comboBox';
	}	

}

window.customElements.define('treez-image-combo-box', TreezImageComboBox);    