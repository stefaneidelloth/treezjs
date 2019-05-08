import Utils from './../../core/utils/utils.js';
import ComponentAtom from './../../core/component/componentAtom.js';

export default class InputModification extends ComponentAtom {

	constructor(name) {		
	    super(name);
		this.image = 'inputModification.png';
		
        this.isIncludingDateInInputFile = undefined;
        this.isIncludingDateInInputFolder = undefined;
        this.isIncludingDateInInputSubFolder = undefined;
        this.isIncludingjobIdInInputFile = undefined;
        this.isIncludingjobIdInInputFolder = undefined;
        this.isIncludingjobIdInInputSubFolder = undefined;
       
	}

	

    createComponentControl(tabFolder){  
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
		   .bindValue(this,()=>this.isIncludingjobIdInInputFolder);

	    sectionContent.append('treez-check-box')
		   .label('Extra folder')
		   .value(false)
		   .onChange(this.refreshStatus)		  
		   .bindValue(this,()=>this.isIncludingjobIdInInputSubFolder);

	   sectionContent.append('treez-check-box')
		   .label('File name')
		   .value(false)
		   .onChange(this.refreshStatus)		  
		   .bindValue(this,()=>this.isIncludingjobIdInInputFile);  
   }	

	extendContextMenuActions(actions, treeViewer) {		

		return actions;
	}	
	
	getModifiedPath(executable){	

		let inputPath = executable.fullPath(executable.inputPath);

		//split path with point to determine file extension if one exists
		const subStrings = inputPath.split(".");

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

		inputPathExpression = this.__includeFolder(inputPathExpression, executable);
		
		inputPathExpression = this.__includeSubFolder(inputPathExpression, executable);

		if (hasFileExtension) {
			inputPathExpression = this.__includeFileNameAndExtension(fileNameWithoutExtension, pathPostFix,
					inputPathExpression, executable);
		}

		return inputPathExpression;
	}

	__includeFolder(inputPathExpression, executable){
		var newExpression = this.__includeDateInFolder(inputPathExpression, executable);
		newExpression = this.__includejobIdInFolder(newExpression, executable);
		return newExpression;
	}

	__includeDateInFolder(inputPathExpression, executable) {

		let newInputPath = inputPathExpression;

		const doIncludeDateInFolder = this.isIncludingDateInInputFolder;
		if (doIncludeDateInFolder) {
			newInputPath += "_" + Utils.getDateString();
		}
		return newInputPath;
	}

	 __includejobIdInFolder(inputPathExpression, executable) {

		let newInputPath = inputPathExpression;

		const doIncludejobIdInFolder = this.isIncludingjobIdInInputFolder;
		if (doIncludejobIdInFolder) {
			newInputPath += "#" + executable.getJobId();
		}
		return newInputPath;
	}

	__includeSubFolder(inputPathExpression, executable) {

		let newInputPath = inputPathExpression;

		const isIncludingDateInSubFolder = this.isIncludingDateInInputSubFolder;
        const isIncludingjobIdInSubFolder = this.isIncludingjobIdInInputSubFolder;
        const doIncludeSubFolder = isIncludingDateInSubFolder || isIncludingjobIdInSubFolder;

		if (doIncludeSubFolder) {
			newInputPath += "/";
		}

		if (isIncludingDateInSubFolder) {
			newInputPath += Utils.getDateString();
		}

		if (isIncludingjobIdInSubFolder) {
			newInputPath += "#" + executable.getJobId();
		}
		return newInputPath;
	}

	__includeFileNameAndExtension(fileNameWithoutExtension, pathPostFix, inputPathExpression, executable) {

		let newInputPath = inputPathExpression;

		newInputPath += "/";

		newInputPath += fileNameWithoutExtension; //is empty for directories

		if (this.isIncludingDateInInputFile) {
			newInputPath += "_" + Utils.getDateString();
		}

		if (this.isIncludingjobIdInInputFile) {
			newInputPath += "#" + executable.getJobId();
		}
		newInputPath += pathPostFix; //is empty for directories
		return newInputPath;
	}

}
