import GraphicsAtom from './../graphics/graphicsAtom.js';
import Column from './../../data/column/column.js';

export default class Data extends GraphicsAtom {
	
	constructor(chord){
		super(chord);		
		this.sourceData = 'root.data.table.columns.source';	
		this.targetData = 'root.data.table.columns.target';	
		this.valueData = 'root.data.table.columns.value';	
		this.legendText = '';	
		this.outerRadius = '4 cm';	
		this.innerRadius = '3.8 cm';	
	}

	 createPage(root, xy) {

		let tab = root.append('treez-tab')
			.label('Data');

		let section = tab.append('treez-section')
			.label('Data');

		xy.createHelpAction(section, 'result/chord/chord.md');		
	
		let sectionContent = section.append('div');
		
		sectionContent.append('treez-model-path')
			.label('Source data')
			.nodeAttr('atomClasses',[Column])
			.bindValue(this, ()=>this.sourceData);
		
		sectionContent.append('treez-model-path')
			.label('Target data')
			.nodeAttr('atomClasses',[Column])
			.bindValue(this, ()=>this.targetData);
		
		sectionContent.append('treez-model-path')
			.label('Value data')
			.nodeAttr('atomClasses',[Column])
			.bindValue(this, ()=>this.valueData);
		
		sectionContent.append('treez-text-field')
			.label('Legend text')
			.bindValue(this, ()=>this.legendText);	

		sectionContent.append('treez-text-field')
			.label('Outer radius')
			.bindValue(this, ()=>this.outerRadius);

		sectionContent.append('treez-text-field')
			.label('Inner radius')
			.bindValue(this, ()=>this.innerRadius);
		

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

}
