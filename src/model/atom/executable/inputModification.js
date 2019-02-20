import Utils from './../../../core/utils/utils.js';
import ComponentAtom from './../../../core/component/componentAtom.js';

export default class InputModification extends ComponentAtom {

	constructor(name) {		
	    super(name);
		this.image = 'inputModification.png';
		
        this.isIncludingDateInInputFile = undefined;
        this.isIncludingDateInInputFolder = undefined;
        this.isIncludingDateInInputSubFolder = undefined;
        this.isIncludingJobIndexInInputFile = undefined;
        this.isIncludingJobIndexInInputFolder = undefined;
        this.isIncludingJobIndexInInputSubFolder = undefined;
       
	}

	copy() {
		//TODO
	}	

    createComponentControl(tabFolder, dTreez){  
		const page = tabFolder.append('treez-tab')
            .title('Data');
		
        this.createInputModificationSection(page); 
	}	

   createInputModificationSection(page) {

       const section = page.append('treez-section')
           .title('Input modification')
           .attr('expanded','false');

       const sectionContent = section.append('div'); 

       sectionContent.append('treez-text-label')
       	   .value('Include date in:')

       sectionContent.append('treez-check-box')
		   .label('Folder name')
		   .value(false)
		   .onChange(this.refreshStatus)		  
		   .bindValue(this,()=>this.isIncludingDateInInputFolder);

	    sectionContent.append('treez-check-box')
		   .label('Extra folder')
		   .value(false)		   
		   .onChange(this.refreshStatus)		  
		   .bindValue(this,()=>this.isIncludingDateInInputSubFolder);

	   	sectionContent.append('treez-check-box')
		   .label('File name')
		   .value(false)
		   .onChange(this.refreshStatus)		  
		   .bindValue(this,()=>this.isIncludingDateInInputFile);

      	sectionContent.append('treez-text-label')
       	   .value('Include job index in:') 
       	   
		sectionContent.append('treez-check-box')
		   .label('Folder name')
		   .value(false)
		   .onChange(this.refreshStatus)		 
		   .bindValue(this,()=>this.isIncludingJobIndexInInputFolder);

	    sectionContent.append('treez-check-box')
		   .label('Extra folder')
		   .value(false)
		   .onChange(this.refreshStatus)		  
		   .bindValue(this,()=>this.isIncludingJobIndexInInputSubFolder);

	   sectionContent.append('treez-check-box')
		   .label('File name')
		   .value(false)
		   .onChange(this.refreshStatus)		  
		   .bindValue(this,()=>this.isIncludingJobIndexInInputFile);  
   }	

	extendContextMenuActions(actions, treeViewer) {		

		return actions;
	}	
	
	getModifiedPath(executable){	

		let inputPath = executable.inputPath;

		//split path with point to determine file extension if one exists
		const subStrings = inputPath.split("\\.");

		let pathBase = subStrings[0];
		let fileNameWithoutExtension = "";
        let pathPostFix = "";
        const hasFileExtension = subStrings.length > 1;
		if (hasFileExtension) {
			pathPostFix = "." + subStrings[1];
			fileNameWithoutExtension = Utils.extractFileName(pathBase);
			pathBase = Utils.extractParentFolder(pathBase);
		}

		let inputPathExpression = pathBase;

		inputPathExpression = this.__includeDateInFolder(inputPathExpression, executable);

		inputPathExpression = this.__includeJobIndexInFolder(inputPathExpression, executable);

		inputPathExpression = this.__includeSubFolder(inputPathExpression, executable);

		if (hasFileExtension) {
			inputPathExpression = this.__includeFileNameAndExtension(fileNameWithoutExtension, pathPostFix,
					inputPathExpression, executable);
		}

		return inputPathExpression;
	}

	__includeDateInFolder(inputPathExpression, executable) {

		let newInputPath = inputPathExpression;

		const doIncludeDateInFolder = this.isIncludingDateInInputFolder;
		if (doIncludeDateInFolder) {
			newInputPath += "_" + Utils.getDateString();
		}
		return newInputPath;
	}

	 __includeJobIndexInFolder(inputPathExpression, executable) {

		let newInputPath = inputPathExpression;

		const doIncludejobIndexInFolder = this.isIncludingJobIndexInInputFolder;
		if (doIncludejobIndexInFolder) {
			newInputPath += "#" + executable.getJobIndex();
		}
		return newInputPath;
	}

	includeSubFolder(inputPathExpression, executable) {

		let newInputPath = inputPathExpression;

		const isIncludingDateInSubFolder = this.isIncludingDateInInputSubFolder;
        const isIncludingJobIndexInSubFolder = this.isIncludingJobIndexInInputSubFolder;
        const doIncludeSubFolder = isIncludingDateInSubFolder || isIncludingJobIndexInSubFolder;

		if (doIncludeSubFolder) {
			newInputPath += "/";
		}

		if (isIncludingDateInSubFolder) {
			newInputPath += Utils.getDateString();
		}

		if (isIncludingJobIndexInSubFolder) {
			newInputPath += "#" + executable.getJobIndex();
		}
		return newInputPath;
	}

	includeFileNameAndExtension(fileNameWithoutExtension, pathPostFix, inputPathExpression, executable) {

		let newInputPath = inputPathExpression;

		newInputPath += "/";

		newInputPath += fileNameWithoutExtension; //is empty for directories

		if (this.isIncludingDateInFile) {
			newInputPath += "_" + Utils.getDateString();
		}

		if (this.isIncludingJobIndexInInputFile) {
			newInputPath += "#" + executable.getJobIndex();
		}
		newInputPath += pathPostFix; //is empty for directories
		return newInputPath;
	}

}
