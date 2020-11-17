import DTreez from './../dTreez/dTreez.js';
import ActionSeparator from './../actionSeparator.js';
import Treez from './../../treez.js';

export default class AtomTreeNodeAdapter {

	static createTreeNode(parentSelection,treeView,atom){

		if(atom.hasChildren){
            return this.createExpandableNodeWithChildren(parentSelection,treeView,atom);
		} else {
			return this.crateLeafeNode(parentSelection,treeView,atom);
		}
	}

	static createExpandableNodeWithChildren(parentSelection,treeView,atom){
		var expandableNode = parentSelection.append('details')
		    					.className('treez-details')
		    					.attr('id', atom.treePath)
		    					.title(atom.constructor.name);

		if(atom.isExpanded){
			expandableNode.attr('open','');
		} else {
			expandableNode.attr('open', null);
		}

		expandableNode.onDoubleClick((event)=>{

			event.stopPropagation();

			var isOpen = expandableNode.attr('open') === '';
			if(isOpen){
				atom.collapseAll();
			} else {
				atom.expandAll();
			}
			treeView.refresh();

		});

		expandableNode.onToggle(()=>{
			var isExpanded = expandableNode.attr('open') === '';
			atom.isExpanded=isExpanded;
		})

		if(atom.parent){
			expandableNode.classed('treez-indent',true);
		}

		var summary = expandableNode.append('summary')
			.className('treez-summary')
			.on('dragover', event => event.preventDefault())
		    .on('drop', event => atom.handleDrop(event, treeView)) //allows to drop files
		    .on('paste', event => atom.handlePaste(event, treeView)) //allows to paste files
		    .on('dragenter', event => event.preventDefault())
			.onClick(()=>{
				this.showProperties(treeView,atom);
			});

		this.createIconAndLabel(summary, atom);
		this.createContextMenu(summary, parentSelection, atom, treeView);

		atom.children.forEach(child=>{
			child.createTreeNodeAdaption(expandableNode, treeView);
		});

		return expandableNode;
	}

	static crateLeafeNode(parentSelection,treeView,atom){
		var leafNode = parentSelection.append('div')
			.className('treez-leaf-node')
			.attr('id', atom.treePath)
			.title(atom.constructor.name);

		leafNode.onClick(()=>{
			this.showProperties(treeView,atom);
		});

		this.createIconAndLabel(leafNode, atom);
		this.createContextMenu(leafNode, parentSelection, atom, treeView);
		return leafNode;
	}

	static createIconAndLabel(parentSelection, atom){

		parentSelection.style('white-space','nowrap');

		var iconFolder = parentSelection.append('span')
							.className('treez-node-icon-folder');

		iconFolder.append('img')
			.className('treez-node-icon')
			.attr('src', Treez.imagePath(atom.image));

		if(atom.overlayImage){
			iconFolder.append('img')
			.className('treez-node-overlay-icon')
			.attr('src', Treez.imagePath(atom.overlayImage));
		}

		var label = parentSelection.append('label')
			.className('treez-node-label')
			.text(atom.name);
	}

	static createContextMenu(selection, parentSelection, atom, treeView){

		var dTreez = treeView.dTreez;

        var menu = selection.append('div')
          	.className('treez-context-menu');

        var menuItems = atom.createContextMenuActions(selection, parentSelection, treeView);
        var self=this;
        menuItems.forEach(function(item){
        	self.createContextMenuItemOrSeparator(selection, dTreez, menu,item);
        });


		// hide context menu when clicking outside context menu
        dTreez.select('body')
		  .onMouseDown(function (event) {
				 var target = dTreez.select(event.target);
				 if (!target.classed('treez-context-menu')){
					 dTreez.selectAll('.treez-context-menu') //
					       .style('display','none');
				 }
		    });

    }

    static createContextMenuItemOrSeparator(parentSelection, dTreez, menu, item){

    	 if (item instanceof ActionSeparator){
             this.createContextMenuSeparator(menu);
    	 } else {
    	 	this.createContextMenuItem(parentSelection, dTreez, menu, item)
    	 }
    }

    static createContextMenuSeparator(menu){
    	menu.append('div')
    	.className('treez-menu-separator');
    }

    static createContextMenuItem(parentSelection, dTreez, menu, item){

    	 var button = menu.append('div')
    	     .append('button')
    	     .className('treez-menu-button')
          	 .onMouseDown(() => item.action());

    	 var iconFolder = button.append('span')
			.className('treez-node-icon-folder');

          var imageName = item.image? item.image: 'error.png';

          iconFolder.append('img')
          	.className('treez-menu-button-icon')
          	.src(Treez.imagePath(imageName));

          if(item.overlayImage){
        	  iconFolder.append('img')
            	.className('treez-menu-button-overlay-icon')
            	.src(Treez.imagePath(item.overlayImage));
          }

          button.append('label')
          	.className('treez-menu-button-label')
          	.text(item.label);

          parentSelection.onContextMenu(function (event) {
        	   event.preventDefault();
			   menu.style('display', 'block');
			});
    }

    static showProperties(treeView,atom){
    	treeView.showProperties(atom);
    }

}