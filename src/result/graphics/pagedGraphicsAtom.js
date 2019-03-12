
import GraphicsAtom from './graphicsAtom.js';

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


}
