import TreezComboBox from './../comboBox/treezComboBox.js';

export default class TreezFont extends TreezComboBox {     
				
    constructor(){
        super();                   
    } 

    connectedCallback() {
    	this.options = this.__availableFonts;
    	super.connectedCallback();
    }
    
    get __availableFonts(){
    	return 'serif,sans-serif,cursive,fantasy,monospace';                   
    }
    
    static __createOptionTag(option){
		var optionTag = TreezComboBox.__createOptionTag(option);	 	
		optionTag.style.fontFamily = option;
		return optionTag;
	}  
                         
}

window.customElements.define('treez-font', TreezFont);