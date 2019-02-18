import DTreez from "../dTreez/dTreez.js";

export default class AtomTreeNodeAdapter {	

	static createTreeNode(parent,d3,treeViewerRefreshable,atom){
		if(atom.hasChildren()){
            this.createExpandableNodeWithChildren(parent,d3,treeViewerRefreshable,atom);
		} else {
			this.crateLeafeNode(parent,d3,treeViewerRefreshable,atom);
		}
	}

	static createExpandableNodeWithChildren(parent,d3,treeViewerRefreshable,atom){
		var expandableNode = parent.append('details')
		    .attr('class','treez-details');		
			
		if(atom.parent){
			expandableNode.classed('treezIndent',true);
		}
			
		var summary = expandableNode.append('summary')
			.attr('class','treez-summary');

		summary.on('click', ()=>{
			this.showProperties(d3,treeViewerRefreshable,atom);
		})				

		this.createIconAndLabel(summary, atom);	
		this.createContextMenu(summary, d3, treeViewerRefreshable,atom);			

		atom.children.forEach(child=>{				
			child.createTreeNodeAdaption(expandableNode, d3, treeViewerRefreshable);
		});
	}

	static crateLeafeNode(parent,d3,treeViewerRefreshable,atom){
		var leafNode = parent.append('div')			
			.attr('class', 'treez-leaf-node');

		leafNode.on('click', ()=>{
			this.showProperties(d3,treeViewerRefreshable,atom);
		})				

		this.createIconAndLabel(leafNode, atom);
		this.createContextMenu(leafNode, d3, treeViewerRefreshable,atom);			
	}

	static createIconAndLabel(parent, atom){

		parent.style('white-space','nowrap');
		var icon = parent.append('img')	
			.attr('class','treez-node-icon')		
			.attr('src','./icons/' + atom.provideImage());

		var label = parent.append('label')
			.attr('class','treez-node-label')								
			.text(atom.name);		
	}

	static createContextMenu(parent, d3, treeViewerRefreshable,atom){

          var menu = parent.append('div')
          	.attr('class','treez-context-menu');          	

          var menuItems = atom.createContextMenuActions(treeViewerRefreshable);
          var self=this;
          menuItems.forEach(function(item){
          	self.createContextMenuItem(parent, d3, menu,item);
          });
         

		//hide context menu when clicking outside context menu
		d3.select('body')
		  .on('mousedown', function () {
				 var target = d3.select(d3.event.target);
				 if (!target.classed('treez-context-menu')){
					d3.selectAll('.treez-context-menu').style('display','none');			 	
				 }
		    });	
    
    }

    static createContextMenuItem(parent, d3, menu, item){
    	 var button = menu.append('div')    	 
    	     .append('button')
    	     .attr('class','treez-menu-button') 
          	 .on('mousedown', item.action) ;                   
          
          var imageName = item.imageName? item.imageName: 'error.png';
          
          button.append('img')
          	.attr('class','treez-menu-button-icon')          	
          	.attr('src','./icons/' + imageName);

          button.append('label')
          	.attr('class','treez-menu-button-label')          	
          	.text(item.label);

           parent.on('contextmenu', function () {
               d3.event.preventDefault();   	      
			   menu.style('display', 'block'); 
			});
    }   

    static showProperties(d3,treeViewerRefreshable,atom){
    	let dTreez = new DTreez(d3);
    	var propertiesView = dTreez.select('#properties');
    	atom.createControlAdaption(propertiesView, dTreez, treeViewerRefreshable);
    }
     
}