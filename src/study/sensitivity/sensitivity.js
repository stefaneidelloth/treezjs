import AbstractSampleStudy from './../sample/abstractSampleStudy.js';
import SensitivityModelInputGenerator from './sensitivityModelInputGenerator.js';
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
	}
	
	extendContextMenuActions(actions, parentSelection, treeView) {
		return actions;
	}	
	
	createStudyOutputAtom(name){
		return new SensitivityOutput(name);
	}	
	
	__extendSensitivitySection(sectionContent) {	
		sectionContent.append('treez-enum-combo-box')
			.label('Type')
			.nodeAttr('options', SensitivityType)
			.onChange(() => this.__showOrHideComponents())
			.bindValue(this, () => this.type);
		
		this.__relationTypeSelection = sectionContent.append('treez-enum-combo-box')
			.label('Relation type')
			.nodeAttr('options', RelationType)
			.onChange(() => this.__typeChanged())
			.bindValue(this, () => this.relationType);		
		
		this.__showOrHideComponents();
	}

	__createValuesSection(page) {		
		var section = page.append('treez-section')
			.label('Values')			
		
		var sectionContent = section.append('div');
		
		this.__valuesStringSelection = sectionContent.append('treez-text-field')			
			.bindValue(this, () => this.valuesString);
	}

	__showOrHideComponents() {
		if(this.type.isRelative){
			this.__relationTypeSelection.show();
		} else {
			this.__relationTypeSelection.hide();
		}
	}

}
