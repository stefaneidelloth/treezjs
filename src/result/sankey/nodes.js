import GraphicsAtom from './../graphics/graphicsAtom.js';
import Length from './../graphics/length.js';
import Color from './../../components/color/color.js';
import ColorMap from './../../components/colorMap/colorMap.js';
import LineStyle from './../../components/lineStyle/lineStyle.js';
import SankeyNode from './sankeyNode.js';
import SankeyAlignment from './sankeyAlignment.js';

export default class Nodes extends GraphicsAtom {
	
	constructor(){
		super();
		
		this.margin = '10 px';
		this.nodeWidth = '20 px';		
        this.nodePadding = '50 px';
        this.alignment = SankeyAlignment.Justify;
       
        this.colorMap = ColorMap.Turbo;
        this.fillTransparency = 0.2;
        this.strokeWidth = 1;       
	}
	
	createPage(root) {
		
		var tab = root.append('treez-tab')
			.label('Nodes');

        this.__createLayoutSection(tab);
        this.__createFillSection(tab);
        this.__createStrokeSection(tab);	
		
	}

	__createLayoutSection(tab){
		var section = tab.append('treez-section')
			.label('Layout');	
		
		var sectionContent = section.append('div');	

		sectionContent.append('treez-text-field')
			.label('Margin')
			.bindValue(this, ()=>this.margin);	

		sectionContent.append('treez-text-field')
			.label('Node width')
			.bindValue(this, ()=>this.nodeWidth);

		sectionContent.append('treez-text-field')
			.label('Node padding')
			.bindValue(this, ()=>this.nodePadding);

		sectionContent.append('treez-enum-combo-box')
			.label('Alignment')			
			.nodeAttr('enum', SankeyAlignment)
			.bindValue(this, ()=>this.alignment);
		
	}

	__createFillSection(tab){
		var section = tab.append('treez-section')
			.label('Fill');	
		
		var sectionContent = section.append('div');

		sectionContent.append('treez-color-map')
			.label('Color map')
			.bindValue(this, ()=>this.colorMap);

		sectionContent.append('treez-unit-interval')
			.label('Transparency')
			.bindValue(this, ()=>this.fillTransparency);
	}

	__createStrokeSection(tab){
		var section = tab.append('treez-section')
			.label('Stroke');	
		
		var sectionContent = section.append('div');

		sectionContent.append('treez-double')
			.label('Width')
			.min('0')
			.bindValue(this, ()=>this.strokeWidth);		
	}

	plot(dTreez, sankeyContainer, rectSelection, sankey) {	

	    this.__dTreez = dTreez;		         	

		var colors = this.nodeColors;	   	    		

		var nodeSelection = sankeyContainer.append("g")		    
		    .selectAll("rect")
		    .data(sankey.nodeData)
		    .join("rect")
		    .attr('id', node => node.id)
		    .attr("x", node => node.x0)
		    .attr("y", node => node.y0)
		    .attr("height", node => node.y1 - node.y0)
		    .attr("width", node => node.x1 - node.x0)
		    .attr("fill", (node, index) => colors[index])
		    .attr('stroke', 'black');

		this.__enableDragAndDrop(dTreez, nodeSelection, sankey);	     

        nodeSelection.append("title")
		    .text(node => this.nodeTitle(node));
	
        this.bindTransparency(()=>this.fillTransparency, nodeSelection);
				
       
        this.addListener(()=>this.margin, ()=>this.__layoutChanged(dTreez, sankey));
        this.addListener(()=>this.nodeWidth, ()=>this.__layoutChanged(dTreez, sankey));
		this.addListener(()=>this.nodePadding, ()=>this.__layoutChanged(dTreez, sankey));
        this.addListener(()=>this.alignment, ()=>this.__layoutChanged(dTreez, sankey));

		this.addListener(()=>this.colorMap, ()=>sankey.updatePlot(dTreez));
        this.bindDouble(()=>this.strokeWidth, nodeSelection, 'stroke-width');
		

		return sankeyContainer;
	}

	nodeTitle(node){
		return node.id + ': ' + node.value;
	}

	__layoutChanged(dTreez, sankey){
		sankey.resetSankeyGenerator();
		sankey.updatePlot(dTreez);
	}

	__enableDragAndDrop(dTreez, nodeSelection, sankey){
	  
	   var dragDeltaX = 0;
	   var dragDeltaY = 0;  	  

	   var drag = dTreez.drag()		              
			.on('start', (event, node) => {	 
			    dragDeltaX = node.x0 - event.x;
				dragDeltaY = node.y0 - event.y;
				var element = event.sourceEvent.srcElement;	 
				element.parentNode.appendChild(element);
			})
			.on('drag', (event, node) => {				    
			    var element = event.sourceEvent.srcElement;
			    if(element.id !== node.id){
			    	return;
			    }	
			   		   
				var x0 = event.x + dragDeltaX;
				var y0 = event.y + dragDeltaY;
				
				this.__updateLayoutForDrag(dTreez, sankey, element, node, x0, y0);
			});

	    nodeSelection.call(drag);	  
	}

	__updateLayoutForDrag(dTreez, sankey, element, node, x0, y0){ 

        var graphWidth = Length.toPx(sankey.graph.width);
        var graphHeight = Length.toPx(sankey.graph.height);
	    var margin = Length.toPx(this.margin);

	    var width = node.x1 - node.x0;
	    var height = node.y1 - node.y0;

	    var x0Max = graphWidth-margin-width;
	    var y0Max = graphHeight-margin-height;	

	    if(x0 < margin || x0 > x0Max){
	    	return;
	    }  

	    if(y0 < margin || y0 > y0Max){
	    	return;
	    }  	    
	           		
        dTreez.select(element)
            .attr('x', x0)
            .attr('y', y0);

        node.x0 = x0;
        node.x1 = x0 + width;

	    node.y0 = y0;
	    node.y1 = y0 + height;
        sankey.updateLinksAfterDrag(dTreez);
	}	

	get nodeColors(){

		var nodeIds = this.parent.nodeIds;
		var numberOfNodes = nodeIds.length;

		var colors = [];
		var sankeyNodes = this.parent.childrenByClass(SankeyNode);
		

		if(sankeyNodes.length > 0){
			for(var sankeyNode of sankeyNodes){
			    colors.push(sankeyNode.color.hexString);
		    }
		    if(colors.length < numberOfNodes){
		    	console.warn('There are less sankey node children than nodes');
		    }
		}

        var numberOfExtraColors = numberOfNodes - colors.length;
        if(numberOfExtraColors > 0){        	
            var interpolateColor = this.__dTreez['interpolate' + this.colorMap];

            var distance = 1/numberOfExtraColors;
            for(var index = 0; index < numberOfExtraColors; index++){
            	var extraColor = interpolateColor.call(this.__dTreez, index*distance);
            	colors.push(extraColor);
            }
            
        }
        

		return colors;
	}	

}
