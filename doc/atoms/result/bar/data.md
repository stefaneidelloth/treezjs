import GraphicsAtom from './../graphics/graphicsAtom.js';
import Column from './../../data/column/column.js';
import Axis from './../axis/axis.js';
import Direction from './../axis/direction.js';

export default class Data extends GraphicsAtom {
	
	constructor(){
		super();
		
		this.barPositions = 'root.data.table.columns.x';	
		this.barLengths = 'root.data.table.columns.y';	
		
		this.barDirection = Direction.vertical;	
		this.barFillRatio = '0.75';	
		
		this.legendText = '';	
		
		this.horizontalAxis = '';	
		this.verticalAxis = '';
	}

	createPage(root) {

		var page = root.append('treez-tab')
			.label('Data');
	
		var section = page.append('treez-section')
			.label('Data');	
		
		var sectionContent = section.append('div');

		sectionContent.append('treez-model-path')
			.label('Bar positions')
			.nodeAttr('atomClasses',[Column])
			.bindValue(this, ()=>this.barPositions);
		
		sectionContent.append('treez-model-path')
			.label('Bar lengths')
			.nodeAttr('atomClasses',[Column])
			.bindValue(this, ()=>this.barLengths);
		
		sectionContent.append('treez-enum-combo-box')
			.label('Bar direction')
			.nodeAttr('options',Direction)
			.bindValue(this, ()=>this.barDirection);

		sectionContent.append('treez-text-field')
			.label('Bar fill rato')			
			.bindValue(this, ()=>this.barFillRatio);
		
		sectionContent.append('treez-text-field')
			.label('Legend text')			
			.bindValue(this, ()=>this.legendText);
	
		var horizontalAxisFilterDelegate = (axis) => {
			return axis.data.direction.isHorizontal;
		}; //TODO
		
		sectionContent.append('treez-model-path')
			.label('Horizontal axis')
			.nodeAttr('atomClasses',[Axis])
			.bindValue(this, ()=>this.horizontalAxis);
		
		var verticalAxisFilterDelegate = (axis) => {
			return axis.data.direction.isVertical;
		}; //TODO
		
		sectionContent.append('treez-model-path')
			.label('Vertical axis')
			.nodeAttr('atomClasses',[Axis])
			.bindValue(this, ()=>this.verticalAxis);		

	}

	plot(dTreez, xySelection, rectSelection, bar) {

		var dataChangedConsumer = () => bar.__updatePlot(dTreez);
		
		this.addListener(()=>this.barLengths, dataChangedConsumer);
		this.addListener(()=>this.barPositions, dataChangedConsumer);
		this.addListener(()=>this.barDirection, dataChangedConsumer);
		this.addListener(()=>this.barFillRatio, dataChangedConsumer);
		this.addListener(()=>this.horizontalAxis, dataChangedConsumer);
		this.addListener(()=>this.verticalAxis, dataChangedConsumer);		

		return xySelection;
	}	

}