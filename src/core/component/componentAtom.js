import Atom from './../atom/atom.js';
import ComponentAtomCodeAdaption from './componentAtomCodeAdaption.js';
import ActionSeparator from './../actionSeparator.js';
import TreeViewAction from './../treeView/treeViewAction.js';
import Monitor from './../monitor/monitor.js';
import Treez from './../../treez.js';

import TreezAbstractPath from './../../components/file/treezAbstractPath.js';
import TreezCheckBox from './../../components/checkBox/treezCheckBox.js';

import TreezColor from './../../components/color/treezColor.js';
import Color from './../../components/color/color.js';

import TreezColorMap from './../../components/colorMap/treezColorMap.js';
import ColorMap from './../../components/colorMap/colorMap.js';

import TreezComboBox from './../../components/comboBox/treezComboBox.js';
import TreezEnumComboBox from './../../components/comboBox/treezEnumComboBox.js';

import TreezDirectoryPath from './../../components/file/treezDirectoryPath.js';
import TreezDirectoryPathList from './../../components/list/treezDirectoryPathList.js';
import TreezDouble from './../../components/number/treezDouble.js';

import TreezErrorBarStyle from './../../components/errorBarStyle/treezErrorBarStyle.js';
import ErrorBarStyle from './../../components/errorBarStyle/errorBarStyle.js';

import TreezFileOrDirectoryPath from './../../components/file/treezFileOrDirectoryPath.js';
import TreezFilePath from './../../components/file/treezFilePath.js';
import TreezFilePathList from './../../components/list/treezFilePathList.js';

import TreezFillStyle from './../../components/fillStyle/treezFillStyle.js';
import FillStyle from './../../components/fillStyle/fillStyle.js';

import TreezFont from './../../components/font/treezFont.js';

import TreezImageComboBox from '../../components/comboBox/treezImageComboBox.js';
import TreezInteger from './../../components/number/treezInteger.js';

import TreezLineStyle from './../../components/lineStyle/treezLineStyle.js';
import LineStyle from './../../components/lineStyle/lineStyle.js';

import TreezModelPath from './../../components/modelPath/treezModelPath.js';

import TreezSection from './../../components/section/treezSection.js';
import TreezSize from './../../components/size/treezSize.js';  
import TreezStringList from './../../components/list/treezStringList.js';
import TreezStringItemList from './../../components/list/treezStringItemList.js';
import TreezSvgComboBox from '../../components/comboBox/treezSvgComboBox.js';

import TreezSymbolStyle from './../../components/symbolStyle/treezSymbolStyle.js';
import SymbolStyle from './../../components/symbolStyle/symbolStyle.js';;

import TreezTabFolder from './../../components/tabs/treezTabFolder.js';

import TreezCodeArea from './../../components/text/code/treezCodeArea.js';
import TreezSvg from './../../components/text/code/treezSvg.js';
import TreezTextArea from './../../components/text/area/treezTextArea.js';
import TreezTextField from './../../components/text/field/treezTextField.js';
import TreezTextLabel from './../../components/text/label/treezTextLabel.js';

import TreezUnitInterval from './../../components/number/treezUnitInterval.js';


export default class ComponentAtom extends Atom {

	constructor(name) {
		super(name);	
		this.__treeView = undefined;
		this.__isDisableable = false;
		this.__isEnabled = true;
        ComponentAtom.initializeComponentsIfRequired();
	}

	static initializeComponentsIfRequired(){
	    if(!ComponentAtom.componentsAreInitialized){
	        ComponentAtom.initializeComponents();
        }
        ComponentAtom.componentsAreInitialized = true;
    }

    static initializeComponents(){    	
    	Treez.importCssStyleSheet('/src/components/checkBox/treezCheckBox.css');    	
    	Treez.importCssStyleSheet('/src/components/color/treezColor.css'); 		
    	Treez.importCssStyleSheet('/src/components/comboBox/treezComboBox.css'); 

    	Treez.importCssStyleSheet('/src/components/file/treezDirectoryPath.css');  
    	Treez.importCssStyleSheet('/src/components/file/treezFileOrDirectoryPath.css');
    	Treez.importCssStyleSheet('/src/components/file/treezFilePath.css');  
	    
    	Treez.importCssStyleSheet('/src/components/comboBox/treezImageComboBox.css');

    	
    	Treez.importCssStyleSheet('/src/components/list/treezStringList.css');
    	Treez.importCssStyleSheet('/src/components/comboBox/treezSvgComboBox.css');
		
		Treez.importCssStyleSheet('/src/components/modelPath/treezModelPath.css');

		Treez.importCssStyleSheet('/src/components/number/treezNumber.css');
       
    	Treez.importCssStyleSheet('/src/components/section/treezSection.css');
      
    	Treez.importCssStyleSheet('/src/components/tabs/treezTabFolder.css');
    	Treez.importCssStyleSheet('/src/components/text/code/treezCodeArea.css');
    	Treez.importCssStyleSheet('/src/components/text/area/treezTextArea.css');
    	Treez.importCssStyleSheet('/src/components/text/field/treezTextField.css');
    	Treez.importCssStyleSheet('/src/components/text/label/treezTextLabel.css');      
    }
	
    createControlAdaption(parent, treeView) {
		
		this.treeView = treeView;
		parent.selectAll('treez-tab-folder').remove();	
		parent.selectAll('div').remove();
		
		const pathInfo = parent.append('div')
			.className('treez-properties-path-info')
			.text(this.treePath);	

		const tabFolderElement = document.createElement('treez-tab-folder');
		const tabFolder = treeView.dTreez.select(tabFolderElement);
		this.createComponentControl(tabFolder);				
		parent.appendChild(tabFolderElement);					
	
        this.afterCreateControlAdaptionHook();
 		
	}	

	/*
	 * Should be overridden by inheriting classes
	 */
	createComponentControl(tabFolder){
        tabFolder.append('treez-tab')
        	.label(this.constructor.name)
        	.append('div')
        	.style('margin','5px')
            .text(this.name);
	}

	/**
	 * Method that might perform some additional actions after creating the control adaption. Can be overridden by
	 * inheriting classes. This default implementation does nothing.
	 */
	afterCreateControlAdaptionHook() {
		//nothing to do here
	}

	createCodeAdaption() {
		return new ComponentAtomCodeAdaption(this);
	}

	createContextMenuActions(selection, parentSelection, treeView) {

        let actions = [];

        if (this.isRunnable) {
			actions.push(new TreeViewAction(
								'Run', 
								'run.png',
								this,
								treeView,
								() => this.execute(treeView)
										  .catch(error => {
											  console.error('Could not execute  ' + this.constructor.name + ' "' + this.name + '"!', error);											 
										  })
							)
			);
		}
        
        if (this.isDisableable) {        	
        	if(this.isEnabled){
        		actions.push(
        			new TreeViewAction(
						'Disable', 
						'disable.png',
						this,
						treeView,
						() => this.disable()								  
					)
        		);
        	} else {
        		actions.push(
        			new TreeViewAction(
						'Enable', 
						'enable.png',
						this,
						treeView,
						() => this.enable()								 
					)
        		);
        	}			
		}
		
		actions.push(new ActionSeparator());
		
		actions = this.extendContextMenuActions(actions, parentSelection, treeView);

		actions = this.appendContextMenuActions(actions, parentSelection, treeView);
		
		actions.push(new ActionSeparator());

        const superActions = super.createContextMenuActions(selection, parentSelection, treeView);
        actions = actions.concat(superActions);

		return actions;
	}

	//can be overridden by inheriting classes
	extendContextMenuActions(actions, parentSelection, treeView) {
		return actions;
	}

	//can be overridden by inheriting classes
	appendContextMenuActions(actions, parentSelection, treeView) {
		return actions;
	}

	async execute(treeView, monitor) {
		this.treeView = treeView;
		
		var hasMainMonitor = false;		
		if(!monitor){
			var monitorTitle = this.constructor.name + ' "' + this.name + '"';
			monitor = new Monitor(monitorTitle, treeView);
			monitor.showInMonitorView();
			monitor.clear();
			hasMainMonitor = true;
		}

		monitor.totalWork = this.numberOfRunnableChildren;		
		for(const child of this.children){			
			if (child.isRunnable) {
				var subMonitor = monitor.createChild(child.name, treeView, child.name, 1);
				await child.execute(treeView, subMonitor);				
			}
		}

		if(hasMainMonitor){
			monitor.done();	
		}		
		
	}
	
	enable(){
		this.__isEnabled=true;
		this.__overlayImage = undefined;
		if(this.__treeView){
			this.__treeView.refresh(this);
		}
	}
	
	disable(){
		if(!this.__isDisableable){
			throw new Error('This atom is not disableable');
		}
		if(this.__overlayImage){
			throw new Error('Currently only atoms without overlay image can be disabled. Otherwise the original overlay image would be removed.');
		}		
		
		this.__isEnabled=false;
		this.__overlayImage = 'disabled.png';
		if(this.treeView){
			this.treeView.refresh(this);
		}
	}
	
	fullPath(pathIncludingVariables){
		return  TreezAbstractPath.replacePathVariables(pathIncludingVariables, this.pathMap);		
	}

	absolutePath(relativeOrAbsolutePath){
		return TreezAbstractPath.convertToAbsolutePathIfRelative(relativeOrAbsolutePath);
	}
	
	get isEnabled(){
		return this.__isEnabled;
	}
	
	get isDisableable(){
		return this.__isDisableable;
	}
	
	set isDisableable(isDisableable){
		this.__isDisableable = isDisableable;
	}

	get treeView(){
		return this.__treeView;
	}

	set treeView(treeView){
		this.__treeView = treeView;
	}
	
	get pathMap(){	
		
		var pathVariables = [];
		
		var models = undefined;
		try {
			models = this.childFromRoot('root.models');
		} catch(error){
			
		}
		
		if(models){			
			for(var child of models.children){
				
				if(child === this){
					continue;
				}
				
				if(child.providePathMap){
					pathVariables = pathVariables.concat(child.providePathMap());
				}				
			}
		}
		
		return pathVariables;
	}

}