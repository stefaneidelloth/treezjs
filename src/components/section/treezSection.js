import TreezSectionHeader from './treezSectionHeader.js';
import TreezSectionAction from './treezSectionAction.js';

export default class TreezSection extends HTMLElement {

    static get observedAttributes() {
        return ['label','collapsed','actions'];
    }
    
    get label() {
	  return this.getAttribute('label');
	}

	set label(newValue) {
	  this.setAttribute('label', newValue);	  

	}  

    get actions(){
		return this.__actionArray;
	}

	set actions(actions){
		this.__actionArray=actions;
	}                  

    set children(children){
        super.children=children;
	}
	
	get children(){
        return super.children;
	}

    constructor(){
        super();
        this.__sectionHeader=undefined;
        this.__isInitiallyExpanded=true;
        this.__actionArray=[];
    }            	

    connectedCallback() {
        if(!this.__sectionHeader){
        	this.className='treez-section'; 
        	
        	let sectionHeader = document.createElement('treez-section-header');
            this.__sectionHeader = sectionHeader;

            let label = document.createElement('span');
            label.classList.add('treez-section-header-label');
            label.innerText = this.label;        
            sectionHeader.appendChild(label);

            let toolbar = document.createElement('span')
            toolbar.classList.add('treez-section-action-toolbar');
            sectionHeader.appendChild(toolbar);
            this.__processSectionActions(toolbar);
                          
            sectionHeader.onclick = () => this.__toggleExpansion();
            this.insertBefore(sectionHeader, this.firstChild); 

            if(!this.__isInitiallyExpanded){
            	this.__toggleExpansion();
            }                       
        }
    }
    
    expand(){                	
        let header = this.children[0];
    	let content = this.__getSectionContentDiv()
    	let style = content.style;
    	
		style.display='block';
		header.classList.remove('collapsed');                  	
    }

    collapse(){
    	
        let header = this.children[0];
    	let content = this.__getSectionContentDiv()
    	let style = content.style;
    	
		style.display='none';
    	header.classList.add('collapsed'); 
    	
    }

    __toggleExpansion(){ 
       
    	let content = this.__getSectionContentDiv()
    	let style = content.style;
    	if(style['display']==='none'){
			this.expand();
    	} else {
    		this.collapse();
    	}                 	
    }  
    
    __getSectionContentDiv(){

        for(let child of this.children){
			if(child.tagName ==='DIV'){
				return child;
			}
		  } 
		  return this.children[1]; 
      }

    __processSectionActions(toolbar){ 

    	for(let index=0; index < this.children.length;index++){
    		let child = this.children[index];
    		if(child instanceof TreezSectionAction){
    			this.__processSectionAction(child, toolbar);                			
    		}
    	}                	
    }

    __processSectionAction(sectionAction, toolbar){
    	
    	let img = document.createElement('img');
    	img.classList.add('treez-section-action');
    	img.title = sectionAction.label;                	
    	img.onclick = (event)=> {
    		event.stopPropagation();
    		sectionAction.actions.forEach(
    			(action)=>action()
    		);
    		
    	};  
    	
    	var urlPrefix = window.treezConfig
    						?window.treezConfig.home
    						:'';
    	
    	if(sectionAction.image){
    		img.src= urlPrefix + '/icons/' + sectionAction.image;
    	} else {
    		img.src= urlPrefix + '/icons/root.png';
    		console.warn('Section action has no image! (label: "'+ sectionAction.label +'")')
    	}             	
    	
    	toolbar.appendChild(img);
    	
    }

    disconnectedCallback(){
    	while (this.firstChild) {
			this.removeChild(this.firstChild);
		}
    }

    attributeChangedCallback(attr, oldValue, newValue) {
        if(attr==='label'){
        	if(this.__sectionHeader){
        		 this.__sectionHeader.innerText= newValue;   
        	}                                           
        } else if(attr==='collapsed'){
			this.__isInitiallyExpanded = (newValue === null);
        }
    }

    observeChildren(){
    	//also see documentation at https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
		var observer = new MutationObserver(this.__childrenChanged);
		var config = { 					              
		               childList: true 
		             };
		observer.observe(this, config);
    }

    __childrenChanged(mutations){
    	mutations.forEach((mutation)=>{
    		console.log('A child node has been added or removed.');
    		if(this.__isInitiallyExpanded){
    			this.children[1].style.display="block";
    		} else {
    			this.children[1].style.display="none";
    		}
    	});						
    } 
	
}

window.customElements.define('treez-section', TreezSection);