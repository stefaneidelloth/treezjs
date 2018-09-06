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
		    .attr('class','treezDetails');		
			
		if(atom.parent){
			expandableNode.classed('treezIndent',true);
		}
			
		var summary = expandableNode.append('summary')
			.attr('class','treezSummary');

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
			.attr('class', 'treezLeafNode');

		leafNode.on('click', ()=>{
			this.showProperties(d3,treeViewerRefreshable,atom);
		})				

		this.createIconAndLabel(leafNode, atom);
		this.createContextMenu(leafNode, d3, treeViewerRefreshable,atom);			
	}

	static createIconAndLabel(parent, atom){

		parent.style('white-space','nowrap');
		var icon = parent.append('img')	
			.attr('class','treezNodeIcon')		
			.attr('src','./icons/' + atom.provideImage());

		var label = parent.append('label')
			.attr('class','treezNodeLabel')								
			.text(atom.name);		
	}

	static createContextMenu(parent, d3, treeViewerRefreshable,atom){

          var menu = parent.append('div')
          	.attr('class','treezContextMenu');

          var menuItems = atom.createContextMenuActions(treeViewerRefreshable);
          var self=this;
          menuItems.forEach(function(item){
          	self.createContextMenuItem(parent, d3, menu,item);
          });
         

		d3.select('body')
		  .on('mousedown', function () {
				 var target = d3.select(d3.event.target);
				 if (!target.classed('treezContextMenu')){
					d3.selectAll('.treezContextMenu').style('display','none');			 	
				 }
		    });	
    
    }

    static createContextMenuItem(parent, d3, menu, item){
    	 var button = menu.append('div')    	 
    	     .append('button')
    	     .attr('class','treezMenuButton') 
          	 .on('mousedown', item.action) ;                   
          
          var imageName = item.imageName? item.imageName: 'error.png';
          
          button.append('img')
          	.attr('class','treezMenuButtonIcon')          	
          	.attr('src','./icons/' + imageName);

          button.append('label')
          	.attr('class','treezMenuButtonLabel')          	
          	.text(item.label);

           parent.on('contextmenu', function () {
               d3.event.preventDefault();   	      
			   menu.style('display', 'block'); 
			});
    }   

    static showProperties(d3,treeViewerRefreshable,atom){
    	var propertiesView = d3.select('#properties');
    	atom.createControlAdaption(propertiesView, d3, treeViewerRefreshable);
    }
     
}