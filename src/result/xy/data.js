import GraphicsAtom from './../graphics/graphicsAtom.js';

export default class Data extends GraphicsAtom {
	
	constructor(){
		super();

		this.xData = 'root.data.table.columns.x';	
		this.yData = 'root.data.table.columns.y';	
		this.legendText = '';	
		//this.labels = '';
		//this.scaleMarkers = '';
		this.xAxis = '';
		this.yAxis = '';	
		//this.colorMarkers = '';	
	}

	 createPage(root) {

		 var page = root.append('treez-tab')
			.label('Data');

		 var section = page.append('treez-section')
			.label('Data');
	
		var sectionContent = section.append('div');
		
		sectionContent.append('treez-model-path')
			.label('X data')
			.nodeAttr('atomClasses',[Column])
			.bindValue(this, ()=>this.xData);
		
		sectionContent.append('treez-model-path')
			.label('Y data')
			.nodeAttr('atomClasses',[Column])
			.bindValue(this, ()=>this.yData);
		
		sectionContent.append('treez-text-field')
			.label('Legend text')
			.bindValue(this, ()=>this.legendText);
		
		//data.createTextField(labels, "labels", "Labels", "");

		//targetClass = org.treez.data.column.Column.class;
		//value = "";
		//data.createModelPath(scaleMarkers, "scaleMarkers", "Scale markers", value, targetClass, parent);
		
		sectionContent.append('treez-model-path')
			.label('X axis')
			.nodeAttr('atomClasses',[Axis])
			.bindValue(this, ()=>this.xData);
		
		sectionContent.append('treez-model-path')
			.label('Y axis')
			.nodeAttr('atomClasses',[Axis])
			.bindValue(this, ()=>this.yData);		

		//data.createTextField(colorMarkers, "colorMarkers", "Color markers", "");

	}

	plot(dTreez, xySelection, rectSelection, xy) {

		//this page factory does create an own d3 group; the work will be
		//done by the other property page factories

		var dataChangedConsumer = () => xy.updatePlot(d3);
		
		this.addListener(()=>this.xData, dataChangedConsumer)
		this.addListener(()=>this.yData, dataChangedConsumer)
				
		this.addListener(()=>this.xAxis, dataChangedConsumer)
		this.addListener(()=>this.yAxis, dataChangedConsumer)

		return xySelection;
	}	

}
