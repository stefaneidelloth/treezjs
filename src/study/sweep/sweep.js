import Study from './../study.js';
import SweepOutput from './sweepOutput.js';
import SweepModelInputGenerator from './sweepModelInputGenerator.js';
import AddChildAtomTreeViewAction from './../../core/treeview/addChildAtomTreeViewAction.js';
import DoubleRange from './../range/doubleRange.js';
import IntegerRange from './../range/integerRange.js';
import BooleanRange from './../range/booleanRange.js';
import QuantityRange from './../range/quantityRange.js';
import StringRange from './../range/stringRange.js';
import StringItemRange from './../range/stringItemRange.js';
import FilePathRange from './../range/filePathRange.js';
import DirectoryPathRange from './../range/directoryPathRange.js';

export default class Sweep extends Study {	
		
	constructor(name) {		
		super(name);		
		this.image = 'sweep.png';
		this.inputGenerator = new SweepModelInputGenerator(this);		
	}	

	extendContextMenuActions(actions, parentSelection, treeView) {
		
		actions = super.extendContextMenuActions(actions, parentSelection, treeView);
	
		
		
		actions.push(
			new AddChildAtomTreeViewAction(
				DoubleRange,
				'doubleRange',
				'doubleRange.png',
				parentSelection,
				this,
				treeView
			)
		);		
		
		actions.push(
			new AddChildAtomTreeViewAction(
				IntegerRange,
				'integerrange',
				'integerrange.png',
				parentSelection,
				this,
				treeView
			)
		);
		
		actions.push(
			new AddChildAtomTreeViewAction(
				QuantityRange,
				'quantityRange',
				'quantityRange.png',
				parentSelection,
				this,
				treeView
			)
		);	
		
		actions.push(
			new AddChildAtomTreeViewAction(
				BooleanRange,
				'booleanRange',
				'booleanRange.png',
				parentSelection,
				this,
				treeView
			)
		);		
		
		actions.push(
			new AddChildAtomTreeViewAction(
				StringRange,
				'stringRange',
				'stringRange.png',
				parentSelection,
				this,
				treeView
			)
		);		
		
		actions.push(
			new AddChildAtomTreeViewAction(
				StringItemRange,
				'stringItemRange',
				'stringItemRange.png',
				parentSelection,
				this,
				treeView
			)
		);		
		
		actions.push(
			new AddChildAtomTreeViewAction(
				FilePathRange,
				'filePathRange',
				'filePathRange.png',
				parentSelection,
				this,
				treeView
			)
		);		
		
		actions.push(
			new AddChildAtomTreeViewAction(
				DirectoryPathRange,
				'directoryPathRange',
				'directoryPathRange.png',
				parentSelection,
				this,
				treeView
			)
		);	
		
/*
		
		actions.push(
			new AddChildAtomTreeViewAction(
				StudyInfoExport,
				'studyInfoExport',
				'studyInfoExport.png',
				parentSelection,
				this,
				treeView
			)
		);		
		
		 */
		
		

		return actions;
	}
	
	createStudyOutputAtom(name){
		return new SweepOutput(name);
	}	

	createDoubleRange(name, values) {
		return this.createChild(DoubleRange, name, values);		
	}

	createIntegerRange(name, values) {
		return this.createChild(IntegerRange, name, values);	
	}

	createBooleanRange(name, values) {
		return this.createChild(BooleanRange, name, values);	
	}

	createStringRange(name, values) {
		return this.createChild(StringRange, name, values);	
	}

	createStringItemRange(name, values) {
		return this.createChild(StringItemRange, name, values);	
	}

	createFilePathRange(name, values) {
		return this.createChild(FilePathRange, name, values);	
	}

	createDirectoryPathRange(name, values) {
		return this.createChild(DirectoryPathRange, name, values);	
	}

	createQuantityRange(name, values) {
		return this.createChild(QuantityRange, name, values);	
	}

	createStudyInfoExport(name) {
		return this.createChild(StudyInfoExport, name);	
	}	

}
