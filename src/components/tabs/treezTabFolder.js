import TreezTabFolderHeader from './treezTabFolderHeader.js';
import TreezTabHeader from './treezTabHeader.js';
import TreezTab from './treezTab.js';

export default class TreezTabFolder extends HTMLElement {            	       	

    constructor(){
        super();
        this.__tabFolderHeader = undefined;
    }

    connectedCallback() {
    	
        if(!this.__tabFolderHeader){
            this.style.display='block';

            var tabfolderHeader =  document.createElement('treez-tab-folder-header');
           

            this.__tabFolderHeader = tabfolderHeader;
            this.insertBefore(tabfolderHeader, this.firstChild);																	            
        }                    
    }

    disconnectedCallback(){
        while (this.firstChild) {
            this.removeChild(this.firstChild);
        }
    }

    createTabHeaderForTabIfNotExists(tab){
    	if(!tab.tabHeader){

			let newTabHeader = document.createElement('treez-tab-header');  
        	newTabHeader.innerText = tab.label;
        	newTabHeader.onclick=()=>{                    	
                this.__hideAllTabs(); 
                tab.style.display='block';
                newTabHeader.classList.add('selected')                        
            };
        	tab.tabHeader = newTabHeader;
            this.__tabFolderHeader.appendChild(newTabHeader);
        	this.__showFirstTab();
    	} 					 
    }

    __hideAllTabs(){
    	let children = this.children;
    	let tabHeaders = this.__tabFolderHeader.children;
    	for(let index=1;index<children.length;index++){ 
			let tab = children[index];                        
			tab.style.display='none';
			let tabHeader = tabHeaders[index-1];
			if(tabHeader){
				tabHeader.classList.remove('selected');
			}						
        }   
    }

    __showFirstTab(){

        this.__hideAllTabs();

        let firstTabHeader = this.__tabFolderHeader.firstChild;
		firstTabHeader.classList.add('selected');

		let firstTab = this.children[1];
		firstTab.style.display = 'block';
    }               


}

window.customElements.define('treez-tab-folder', TreezTabFolder);