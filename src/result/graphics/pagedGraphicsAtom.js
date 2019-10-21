
import GraphicsAtom from './graphicsAtom.js';
import PagedGraphicsAtomCodeAdaption from './pagedGraphicsAtomCodeAdaption.js';

export default class PagedGraphicsAtom extends GraphicsAtom {

	constructor(name) {
		super(name);
		this.__pageFactories = this.createPageFactories();	
	}
	
	createComponentControl(tabFolder){ 
		for(const pageFactory of this.__pageFactories){
			pageFactory.createPage(tabFolder, this);
		}		
	}	
	
	//should be overridden by inheriting classes
	createPageFactories(){
		return [];
	}

	createCodeAdaption(){
		return new PagedGraphicsAtomCodeAdaption(this);
	}

	__initializeProperties(){
		var propertyNames = Object.getOwnPropertyNames(this);		
		var publicPropertyNames =  propertyNames.filter((name)=>{
			return !name.startsWith('__')
		});
		
		//store initial values of treez properties to be able to know if a value 
		//has been modified from its initial state
		for(var propertyName of publicPropertyNames){
			let propertyValue = this[propertyName];
			
			this.__treezProperties[propertyName] = this[propertyName];

			if(propertyValue instanceof GraphicsAtom){
				propertyValue.__initializeProperties();				
			}
		}		
	}


}
