import GraphicsAtom from './../graphics/graphicsAtom.js';

export default class ChordNode extends GraphicsAtom {

	constructor(name){
		super(name);
		this.image = 'chordNode.png';
		this.description = '';
		this.color = 'red';
		this.svg = '<svg><circle r="10" fill="red"/></svg>';
		this.__chordNodeSelection = undefined;		
	}
	

	createComponentControl(tabFolder){  

		const tab = tabFolder.append('treez-tab')
	            .label('Data');

		let section = tab.append('treez-section')
			.label('Data');

		this.createHelpAction(section, 'result/chord/chordNode.md');		
	
		let sectionContent = section.append('div');

		sectionContent.append('treez-text-field')
			.label('name')		
			.onChange(()=>this.__nameChanged())	
			.bindValue(this, ()=>this.name);
		
		sectionContent.append('treez-text-field')
			.label('Description')			
			.bindValue(this, ()=>this.description);

		sectionContent.append('treez-color')
			.label('Color')			
			.bindValue(this, ()=>this.color);

		sectionContent.append('treez-text-area')
			.label('Svg image')			
			.bindValue(this, ()=>this.svg);		

	}

	plot(dTreez, chordSelection, rectSelection, chord) {

		//this page factory does create an own d3 group; the work will be
		//done by the other property page factories

		let dataChangedConsumer = () => chord.updatePlot(d3);
		
		this.addListener(()=>this.sourceData, dataChangedConsumer)
		this.addListener(()=>this.targetData, dataChangedConsumer)
		this.addListener(()=>this.valueData, dataChangedConsumer)

		return chordSelection;
	}	

	__nameChanged(){		
		this.treeView.refresh(this);				
	}

}
