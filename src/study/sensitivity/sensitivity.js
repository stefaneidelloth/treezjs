import AbstractSampleStudy from './../sample/abstractSampleStudy.js';
import SensitivityModelInputGenerator from './sensitivityModelInputGenerator.js';
import SensitivityValueFactory from './sensitivityValueFactory.js';
import VariableMap from './../../variable/variableMap.js';
import SensitivityOutput from './sensitivityOutput.js';
import SensitivityType from './sensitivityType.js';
import RelationType from './relationType.js';

export default class Sensitivity extends AbstractSampleStudy {
	
	constructor(name) {
		super(name);
		this.image = 'sensitivity.png';
		this.inputGenerator = new SensitivityModelInputGenerator(this);	
		this.type = SensitivityType.relativeDistance;		
		this.relationType = RelationType.percentage; 
		this.valuesString = '[-10, 10]';
		
		this.__variables = [];
		this.__variableListWithInfoSelection = undefined;
		this.__relationTypeSelection = undefined;
		this.__valuesStringSelection = undefined;
	}
	
	createComponentControl(tabFolder){ 
		super.createComponentControl(tabFolder);		
		
		this.__extendSensitivitySection(this.__sectionContent);		
		this.createVariableSection(this.__page);	
		this.__createValuesSection(this.__page);
		
		this.__updateVariableInfo();
	}
	
	extendContextMenuActions(actions, parentSelection, treeView) {
		return actions;
	}	
	
	createStudyOutputAtom(name){
		return new SensitivityOutput(name);
	}

	variableListChanged(){
		this.__updateVariableInfo();	
	}	
	
	__updateVariableInfo(){						
		var variableMap = new VariableMap(this.selectedVariables);		
		SensitivityValueFactory.updateVariableInfos(variableMap, this);
		for(var [variable, info] of variableMap){			
			this.__variableListSelection.node().info(variable.name, info);
		}	
	}
	
	__extendSensitivitySection(sectionContent) {	
		sectionContent.append('treez-enum-combo-box')
			.label('Type')
			.nodeAttr('enum', SensitivityType)
			.onChange(() => this.__typeChanged())
			.bindValue(this, () => this.type);
		
		this.__relationTypeSelection = sectionContent.append('treez-enum-combo-box')
			.label('Relation type')
			.nodeAttr('enum', RelationType)
			.onChange(() => this.__relationTypeChanged())
			.bindValue(this, () => this.relationType);		
		
		this.__showOrHideComponents();
	}

	__createValuesSection(page) {		
		var section = page.append('treez-section')
			.label('Values')			
		
		var sectionContent = section.append('div');
		
		this.__valuesStringSelection = sectionContent.append('treez-text-field')
			.onChange( () => this.__valuesStringChanged())			
			.bindValue(this, () => this.valuesString);
	}

	__typeChanged(){
		this.__showOrHideComponents();
		this.__updateVariableInfo();
	}

	__relationTypeChanged(){
		this.__updateVariableInfo();
	}

	__valuesStringChanged(){
		this.__updateVariableInfo();
	}

	__showOrHideComponents() {
		if(this.type.isRelative){
			this.__relationTypeSelection.show();
		} else {
			this.__relationTypeSelection.hide();
		}
	}

}
