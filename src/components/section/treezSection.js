import TreezSectionHeader from './treezSectionHeader.js';
import TreezSectionAction from './treezSectionAction.js';

export default class TreezSection extends HTMLElement {

    static get observedAttributes() {
        return ['label','collapsed'];
    }

    constructor(){
        super();
        this.__sectionHeader = undefined;
        this.__isCollapsed = false;
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
            this.insertBefore(sectionHeader, this.firstChild); //first child/content is not created here but must come from
			                                                  //constructing code; header is just inserted above
			this.__updateCollapsedState();
                                  
        }
    }

	attributeChangedCallback(attr, oldValue, newValue) {
		if(attr==='label'){
			if(this.__sectionHeader){
				this.__sectionHeader.innerText= newValue;
			}
		} else if(attr==='collapsed'){
			this.__isCollapsed = (newValue !== null);
			this.__updateCollapsedState();
		}
	}

	disconnectedCallback(){
		while (this.firstChild) {
			this.removeChild(this.firstChild);
		}
	}

    expand(){
    	this.__isCollapsed = false;
    	if(this.__sectionContent){
    		this.__sectionContent.style.display='block';		
    	}    	
    	if(this.__sectionHeader){
    		this.__sectionHeader.classList.remove('collapsed');
    	}
    }

    collapse(){
    	this.__isCollapsed = true;
    	if(this.__sectionContent){
    		this.__sectionContent.style.display='none';
    	}
    	if(this.__sectionHeader){
    		this.__sectionHeader.classList.add('collapsed');
    	}
    	
    }

    __updateCollapsedState(){
    	if(this.isCollapsed){
            this.collapse();
        } else {
        	this.expand();
        } 
    }

    __toggleExpansion(){
    	if(this.isCollapsed){
			this.expand();
    	} else {
    		this.collapse();
    	}                 	
    }

    __processSectionActions(toolbar){ 

    	for(let child of this.children){
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
    	

    	
    	if(sectionAction.image){
    		img.src = this.__urlPrefix + '/icons/' + sectionAction.image;
    	} else {
    		img.src = this.__urlPrefix + '/icons/root.png';
    		console.warn('Section action has no image! (label: "'+ sectionAction.label +'")')
    	}             	
    	
    	toolbar.appendChild(img);
    	
    }

	get __sectionContent(){

		for(let child of this.children){
			let isContent = child.constructor.name !=='TreezSectionHeader' &&
				child.constructor.name !=='TreezSectionAction';
			if(isContent){
				return child;
			}
		}

		return null;
	}

	get __urlPrefix(){
		return window.treezConfig
			?window.treezConfig.home
			:'';
	}

	get label() {
		return this.getAttribute('label');
	}

	set label(newValue) {
		this.setAttribute('label', newValue);
	}

	get isCollapsed(){
		return this.__isCollapsed;
	}


	
}

window.customElements.define('treez-section', TreezSection);