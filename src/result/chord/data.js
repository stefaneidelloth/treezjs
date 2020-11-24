import GraphicsAtom from './../graphics/graphicsAtom.js';
import Column from './../../data/column/column.js';

export default class Data extends GraphicsAtom {
	
	constructor(chord){
		super(chord);		
		this.sourceData = 'root.data.table.columns.source';	
		this.targetData = 'root.data.table.columns.target';	
		this.valueData = 'root.data.table.columns.value';	
		this.legendText = '';			
	}

	 createPage(root, chord) {

		let tab = root.append('treez-tab')
			.label('Data');

		let section = tab.append('treez-section')
			.label('Data');

		chord.createHelpAction(section, 'result/chord/chord.md');		
	
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

	assignTableAsSource(table){		
		var columns = table.columns;
		if(columns.length>2){
			this.sourceData = columns[0].treePath;
			this.targetData = columns[1].treePath;
			this.valueData = columns[2].treePath;
		}		
	}	

}
