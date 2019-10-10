import TreezComboBox from './../comboBox/treezComboBox.js';

export default class TreezFont extends TreezComboBox {     
				
    constructor(){
        super();                   
    } 

    connectedCallback() {
    	this.options = this.__availableFonts;
    	super.connectedCallback();
    }

    __comboBoxChanged(){
        let index = this.__comboBox.selectedIndex;
        let newInputValue = this.__comboBox.options[index].value;
        this.value =  this.convertFromStringValue(newInputValue);
        this.__comboBox.style.fontFamily = this.value;
    }
    
    __createOptionTag(option){
		var optionTag = super.__createOptionTag(option);	 	
		optionTag.style.fontFamily = option;
		return optionTag;
	}

    get __availableFonts(){
        return [
            'serif',
            'sans-serif',
            'cursive',
            'fantasy',
            'monospace'
        ];
    }
                         
}

window.customElements.define('treez-font', TreezFont);