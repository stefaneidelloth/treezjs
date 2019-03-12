import GraphicsAtom from './../graphics/graphicsAtom.js';

export default class Data extends GraphicsAtom {

	constructor(){
		super('data');
		this.leftMargin = '2.5 cm';
		this.topMargin = '0.5 cm';
		this.width = '12 cm';
		this.height = '12 cm';
		this.isHidden = false;
	}
	
	createPage(tabFolder, parent) {

		var page = tabFolder.append('treez-tab')
			.label('Data');

		var section = page.append('treez-section')
			.label('Data');

		var sectionContent = section.append('div');

		sectionContent.append('treez-text-field')
			.label('Left margin')
			.bindValue(this, ()=>this.leftMargin);
		
		sectionContent.append('treez-text-field')
			.label('Top margin')
			.bindValue(this, ()=>this.topMargin);
		
		sectionContent.append('treez-text-field')
			.label('Width')
			.bindValue(this, ()=>this.width);
		
		sectionContent.append('treez-text-field')
			.label('Height')
			.bindValue(this, ()=>this.height);
		
		sectionContent.append('treez-check-box')
			.label('IsHidden')
			.bindValue(this, ()=>this.isHidden);

	}

	 plot(dTreez, graphSelection, rectSelection, parent) {

		this.bindTranslation(()=>this.leftMargin, ()=>this.topMargin, graphSelection);
		this.bindString(()=>this.width, rectSelection, 'width');
		this.bindString(()=>this.height, rectSelection, 'height');
		this.bindBooleanToNegatingDisplay(()=>this.isHidden, graphSelection);

		var replotGraph = () => parent.updatePlot(dTreez);
		
		this.addListener(()=>this.width, replotGraph);
		this.addListener(()=>this.height, replotGraph);		

		return graphSelection;
	}

	
}
