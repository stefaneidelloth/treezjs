import GraphicsAtom from './graphicsAtom.js';

export default class Background extends GraphicsAtom {

	constructor(){
		super('background');
		
		this.color = 'white';
		this.transparency = 0;
		this.isHidden = false;
	}	

	createPage(tabFolder, parent) {

		var page = tabFolder.append('treez-tab')
			.label('Background');

		var section = page.append('treez-section')
			.label('Data');

		var sectionContent = section.append('div');

		sectionContent.append('treez-color')
			.label('Color')
			.bindValue(this, ()=>this.color);

		//sectionContent.append('treez-fill-style')
		//	.label('Style');

		sectionContent.append('treez-text-field')
			.label('Transparency')
			.bindValue(this, ()=>this.transparency);

		sectionContent.append('treez-check-box')
			.label('IsHidden')
			.bindValue(this, ()=>this.isHidden);
		
	}

	plot(dTreez, parentSelection, rectSelection, parent) {

		this.bindString(()=>this.color, rectSelection, 'fill');
		
		this.addListenerAndRun(()=>this.transparency, () => {
			try {
				var fillTransparency = parseFloat(this.transparency);
				var opacity = 1 - fillTransparency;
				rectSelection.attr('fill-opacity', '' + opacity);
			} catch (error) {
				//sometimes values can not be parsed while entering them
			}
		})

		this.addListenerAndRun(()=>this.idHidden, () => {
						
				if (this.isHidden) {
					rectSelection.attr('fill-opacity', '0');
				} else {
					try {	
						var fillTransparency = parseFloat(this.transparency);
						var opacity = 1 - fillTransparency;
						rectSelection.attr('fill-opacity', '' + opacity);
					} catch (error) {
						//sometimes values can not be parsed while entering them
					}
				}			
		});
		

		return parentSelection;
	}	

}
