export default class GraphicsView {

	constructor(mainViewModel, dTreez){
		this.__mainViewModel = mainViewModel;	
		this.__dTreez = dTreez;			
		this.__svgSelection = undefined;
		
	}

	buildView(){
		
		var graphicsPanel = this.__dTreez.select('#treez-graphics')
								.onDoubleClick(() => this.saveSvg());
		
		this.__svgSelection = graphicsPanel.append('svg')
						.className('treez-svg')
						.attr('id','treez-svg');    
			
	}

	setFocus(){
		this.__mainViewModel.focusGraphicsView();		
	}
	
	async saveSvg(){
		var svgElement = this.__svgSelection.node();
		
		var svgXml = (new XMLSerializer).serializeToString(svgElement);
		
		var filePath = await window.treezTerminal.browseFilePath('./treez.svg');
		await window.treezTerminal.writeTextFile(filePath, svgXml);
	}

}
