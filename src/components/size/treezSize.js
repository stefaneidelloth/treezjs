import TreezComboBox from './../comboBox/treezComboBox.js';

export default class TreezSize extends TreezComboBox {     
				
    constructor(){
        super();
    }

    connectedCallback() {
        this.options=['0pt','0.25pt','0.5pt','1pt',
                      '1.5pt','2pt','3pt','4pt','5pt','6pt','8pt','10pt',
                      '12pt','14pt','16pt','18pt','20pt',
                      '22pt','24pt','26pt','28pt','30pt',
                      '34pt','40pt','44pt','50pt','60pt','70pt'
                     ];

        super.connectedCallback();
    }
                         
}

window.customElements.define('treez-size', TreezSize);