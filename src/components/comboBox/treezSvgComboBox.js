import TreezComboBox from './treezComboBox.js';

export default class TreezSvgComboBox extends TreezComboBox {                
				
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
			container.setAttribute('class','treez-svg-combo-box-container');
			this.appendChild(container);      
	
			
			var label = document.createElement('label');
			this.__label = label;
			container.appendChild(label);   
			label.innerText = this.label;   
			label.setAttribute('class','treez-svg-combo-box-label');							          

			var comboBox = document.createElement('div');                       
			this.__comboBox = comboBox;	
			container.appendChild(comboBox);
			comboBox.setAttribute('class','treez-svg-combo-box');	
			comboBox.tabIndex=0; //required for onblur event to work
			comboBox.onblur = () => this.__collapseComboBox();
						
			var comboBoxDisplay = document.createElement('div');
			comboBoxDisplay.setAttribute('class','treez-svg-combo-box-display');	
			comboBox.appendChild(comboBoxDisplay);

            var imageLabel = document.createElement('div');
			comboBoxDisplay.appendChild(imageLabel);
			this.__imageLabel = imageLabel;
			imageLabel.setAttribute('class','treez-svg-combo-box-image-label');																
			imageLabel.onclick = ()=>this.__expandComboBox();

            var comboButton = document.createElement('span');
            this.__comboButton = comboButton;
            comboBoxDisplay.appendChild(comboButton);						
			comboButton.setAttribute('class','treez-svg-combo-box-button');	
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
    	let imageSvg = this.__selectedImageSvg;
    	
		if(imageSvg){
			this.__imageLabel.innerHTML = imageSvg;							
		}
    }

	__expandComboBox(){
		this.__optionPanel.style.display = 'block';
	}	

	__collapseComboBox(){
		this.__optionPanel.style.display = 'none';
	}

	
	__recreateOptionTags(){

		var self = this;				   			    

		this.__clearOptionPanel();

		for(var title of Object.keys(this.options)){
			var option = this.options[title];
			if(option){
				let optionElement = document.createElement('div')
				optionElement.setAttribute('class','treez-svg-combo-box-option');
				optionElement.innerHTML = option;
				optionElement.setAttribute('title', title);

				self.__optionPanel.appendChild(optionElement);					 					 	

				optionElement.onclick = ()=>{
					this.__comboBoxChanged(title);		 		
					self.__collapseComboBox();
				};
		 	}
		}		
		
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
			var firstTitle = Object.keys(this.options)[0];
			this.setAttribute('value', this.options[firstTitle]);
		}	
	}  

	get __selectedImageSvg(){
		let value = this.getAttribute('value');

		if(value === null || value === undefined || value === 'undefined' || value === 'null'){
			if (this.hasOptions){
				var firstTitle = Object.keys(this.options)[0];
				return this.options[firstTitle];
			}
			return '';
		}	
		return this.options[value];	

	}

	get options() {
    	let optionsString = this.getAttribute('options');
    	if(optionsString){
    		return JSON.parse(optionsString);
		} else {
    		return {};
		}
    }

    set options(optionsDict) {
    	let optionsString = JSON.stringify(optionsDict);
    	this.setAttribute('options', optionsString);
    }

    hasOption(title){
		return title in this.options;
	}

	get hasOptions(){
		return Object.keys(this.options).length > 0;
	}
	

}

window.customElements.define('treez-svg-combo-box', TreezSvgComboBox);    