export default class GraphicsView {

	constructor(treez){
		this.__treez = treez;		
		this.__svgSelection = undefined;		
	}

	buildView(){
		
		var graphicsPanel = this.__treez.dTreez.select('#treez-graphics')
								.onDoubleClick(() => this.saveSvg());
		
		this.__svgSelection = graphicsPanel.append('svg')
						.className('treez-svg')
						.attr('id','treez-svg'); 
	}

	clear(){
		this.__svgSelection.selectAll('g').remove();			
	}

	setFocus(){
		this.__treez.focusGraphicsView();		
	}
	
	async saveSvg(){
		var svgElement = this.__svgSelection.node();		
		var svgXml = (new XMLSerializer).serializeToString(svgElement);		
		await window.treezTerminal.downloadTextFile('treez.svg', svgXml);
	}
}
