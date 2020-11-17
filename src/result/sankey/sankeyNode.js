import GraphicsAtom from './../graphics/graphicsAtom.js';

export default class SankeyNode extends GraphicsAtom {

	constructor(name){
		super(name);
		this.image = 'sankeyNode.png';
		this.description = '';
		this.color = 'red';
		this.x = NaN;
		this.y = NaN;
		this.svg = '<svg width="16" height="16">\n</svg>';		
	}
	

	createComponentControl(tabFolder){  

	    this.__isInitializing = true;	

		const tab = tabFolder.append('treez-tab')
	            .label('Data');

		let section = tab.append('treez-section')
			.label('Data');

		this.createHelpAction(section, 'result/sankey/sankeyNode.md');		
	
		let sectionContent = section.append('div');

		sectionContent.append('treez-text-field')
			.label('Name')						
			.bindValue(this, ()=>this.name)
			.onActualChange(()=>this.__nameChanged());
		
		sectionContent.append('treez-text-field')
			.label('Description')						
			.bindValue(this, ()=>this.description)
			.onActualChange(()=>this.__optionChanged());

		sectionContent.append('treez-color')
			.label('Color')	
			.bindValue(this, ()=>this.color)
			.onActualChange(()=>this.__optionChanged());

		sectionContent.append('treez-integer')
			.label('X')				
			.bindValue(this, ()=>this.x)
			.onActualChange(()=>this.__optionChanged());

		sectionContent.append('treez-integer')
			.label('Y')				
			.bindValue(this, ()=>this.y)
			.onActualChange(()=>this.__optionChanged());

		sectionContent.append('treez-svg')
			.label('Svg image')				
			.bindValue(this, ()=>this.svg)
			.onActualChange(()=>this.__optionChanged());
	}
		

	__nameChanged(){		
		this.treeView.refresh(this);
		this.__optionChanged();				
	}

	__optionChanged(){		
		this.parent.sankeyNodeChanged(this);
	}

}
