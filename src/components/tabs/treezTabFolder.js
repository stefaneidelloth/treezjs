import TreezTabFolderHeader from './treezTabFolderHeader.js';
import TreezTabHeader from './treezTabHeader.js';
import TreezTab from './treezTab.js';

export default class TreezTabFolder extends HTMLElement {            	       	

    constructor(){
        super();
        this.__tabFolderHeader=undefined;
    }

    connectedCallback() {
    	
        if(!this.__tabFolderHeader){
            this.style.display='block';   
            var tabfolderHeader =  document.createElement('treez-tab-folder-header');
            this.__tabFolderHeader = tabfolderHeader;
            this.insertBefore(tabfolderHeader, this.firstChild);																	            
        }                    
    }               

    createTabHeaderForTabIfNotExists(tab){
    	if(!tab.tabHeader){
    		let tabFolderHeader = this.children[0]; 
			let newTabHeader = document.createElement('treez-tab-header');  
        	newTabHeader.innerText = tab.label;
        	newTabHeader.onclick=()=>{                    	
                this.__hideAllTabs(); 
                tab.style.display='block';
                newTabHeader.classList.add('selected')                        
            };
        	tab.tabHeader = newTabHeader;
        	tabFolderHeader.appendChild(newTabHeader);
        	this.__showFirstTab();
    	} 					 
    }

    __hideAllTabs(){
    	let children = this.children;
    	let tabFolderHeader = children[0];
    	let tabHeaders = tabFolderHeader.children;
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
    	let children = this.children;
    	let tabFolderHeader = children[0];

		let firstTabHeader = tabFolderHeader.children[0];
		firstTabHeader.classList.add('selected')
        tabFolderHeader.style.display="block"                    
        for(let index=1;index<children.length;index++){                            
            children[index].style.display="none";
        }   
        children[1].style.display="block";                      
    }               

    disconnectedCallback(){
        while (this.firstChild) {
			this.removeChild(this.firstChild);
		}
    }
}

window.customElements.define('treez-tab-folder', TreezTabFolder);