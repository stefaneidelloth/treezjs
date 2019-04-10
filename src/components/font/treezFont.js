import TreezComboBox from './../comboBox/treezComboBox.js';

export default class TreezFont extends TreezComboBox {     
				
    constructor(){
        super();                   
    } 

    connectedCallback() {
    	 this.options=this.getAvailableFonts();
    	super.connectedCallback();
    }
    
    getAvailableFonts(){
    	return 'serif,sans-serif,cursive,fantasy,monospace';                   
    }
    
    __createOptionTag(option){
		var optionTag = document.createElement('option')
	 	optionTag.innerText=option;
		optionTag.style.fontFamily=option;
		return optionTag;
	}  
                         
}

window.customElements.define('treez-font', TreezFont);