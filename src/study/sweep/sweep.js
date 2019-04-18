import Study from './../study.js';
import SweepOutput from './sweepOutput.js';
import SweepModelInputGenerator from './sweepModelInputGenerator.js';
import AddChildAtomTreeViewAction from './../../core/treeview/addChildAtomTreeViewAction.js';
import DoubleRange from './../range/doubleRange.js';

export default class Sweep extends Study {	
		
	constructor(name) {		
		super(name);		
		this.image = 'sweep.png';
		this.inputGenerator = new SweepModelInputGenerator(this);		
	}	

	extendContextMenuActions(actions, parentSelection, treeView) {

		/*
		const addQuantityRange = new AddChildAtomTreeViewAction(
				QuantityRange,
				"quantityRange",
				"quantityRange.png",
				parentSelection,
				this,
				treeView);
		actions.push(addQuantityRange);
		*/
		
		const addDoubleRange = new AddChildAtomTreeViewAction(
				DoubleRange,
				"doubleRange",
				"doubleRange.png",
				parentSelection,
				this,
				treeView);
		actions.push(addDoubleRange);
		
		/*
		const addIntegerRange = new AddChildAtomTreeViewAction(
				IntegerRange,
				"integerrange",
				"integerrange.png",
				parentSelection,
				this,
				treeView);
		actions.push(addIntegerRange);
		
		const addBooleanRange = new AddChildAtomTreeViewAction(
				BooleanRange,
				"booleanRange",
				"booleanRange.png",
				parentSelection,
				this,
				treeView);
		actions.push(addBooleanRange);
		
		const addStringRange = new AddChildAtomTreeViewAction(
				StringRange,
				"stringRange",
				"stringRange.png",
				parentSelection,
				this,
				treeView);
		actions.push(addStringRange);

		const addStringItemRange = new AddChildAtomTreeViewAction(
				StringItemRange,
				"stringItemRange",
				"stringItemRange.png",
				parentSelection,
				this,
				treeView);
		actions.push(addStringItemRange);
		
		const addFilePathRange = new AddChildAtomTreeViewAction(
				FilePathRange,
				"filePathRange",
				"filePathRange.png",
				parentSelection,
				this,
				treeView);
		actions.push(addFilePathRange);
		
		const addDirectoryPathRange = new AddChildAtomTreeViewAction(
				DirectoryPathRange,
				"directoryPathRange",
				"directoryPathRange.png",
				parentSelection,
				this,
				treeView);
		actions.push(addDirectoryPathRange);
		
		const addStudyInfoExport = new AddChildAtomTreeViewAction(
				StudyInfoExport,
				"studyInfoExport",
				"studyInfoExport.png",
				parentSelection,
				this,
				treeView);
		actions.push(addStudyInfoExport);

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
