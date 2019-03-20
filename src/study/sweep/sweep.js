import Study from './../study.js';
import SweepOutput from './sweepOutput.js';
import SweepModelInputGenerator from './sweepModelInputGenerator.js';
import AddChildAtomTreeViewAction from './../../core/treeview/addChildAtomTreeViewAction.js';
import DoubleRange from './../range/doubleRange.js';

export default class Sweep extends Study {	
		
	constructor(name) {		
		super(name);
		this.isCanceled = false;
		this.inputGenerator = new SweepModelInputGenerator(this);
		this.image = 'sweep.png';
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

	

	createDoubleRange(name) {
		return this.createChild(DoubleRange, name);		
	}

	createIntegerRange(name) {
		return this.createChild(IntegerRange, name);	
	}

	createBooleanRange(name) {
		return this.createChild(BooleanRange, name);	
	}

	createStringRange(name) {
		return this.createChild(StringRange, name);	
	}

	createStringItemRange(name) {
		return this.createChild(StringItemRange, name);	
	}

	createFilePathRange(name) {
		return this.createChild(FilePathRange, name);	
	}

	createDirectoryPathRange(name) {
		return this.createChild(DirectoryPathRange, name);	
	}

	createQuantityRange(name) {
		return this.createChild(QuantityRange, name);	
	}

	createStudyInfoExport(name) {
		return this.createChild(StudyInfoExport, name);	
	}	

}
