import Utils from './../../core/utils/utils.js';
import ComponentAtom from './../../core/component/componentAtom.js';

export default class InputModification extends ComponentAtom {

	constructor(name) {		
	    super(name);
		this.image = 'inputModification.png';
		        
        this.isIncludingDateInInputDirectory = false;
        this.isIncludingDateInInputSubDirectory = false;
        this.isIncludingDateInInputFile = false;
               
        this.isIncludingjobIdInInputDirectory = false;
        this.isIncludingjobIdInInputSubDirectory = false;  
        this.isIncludingjobIdInInputFile = false;     
	}	

    createComponentControl(tabFolder){  
		const page = tabFolder.append('treez-tab')
            .label('Data');
		
        this.createInputModificationSection(page); 
	}	

   createInputModificationSection(page) {

		const section = page.append('treez-section')
           .label('Input modification');

		this.createHelpAction(section, 'model/executable/inputModification.md'); 

        const sectionContent = section.append('div'); 

        sectionContent.append('treez-text-label')
       	   .value('Include date in name of:')

        sectionContent.append('treez-check-box')
		   .label('Directory')
		   .value(false)
		   .onChange(this.refreshStatus)		  
		   .bindValue(this,()=>this.isIncludingDateInInputDirectory);

	    sectionContent.append('treez-check-box')
		   .label('Extra directory')
		   .value(false)		   
		   .onChange(this.refreshStatus)		  
		   .bindValue(this,()=>this.isIncludingDateInInputSubDirectory);

	   	sectionContent.append('treez-check-box')
		   .label('File')
		   .value(false)
		   .onChange(this.refreshStatus)		  
		   .bindValue(this,()=>this.isIncludingDateInInputFile);

      	sectionContent.append('treez-text-label')
       	   .value('Include jobId in name of:') 
       	   
		sectionContent.append('treez-check-box')
		   .label('Directory')
		   .value(false)
		   .onChange(this.refreshStatus)		 
		   .bindValue(this,()=>this.isIncludingjobIdInInputDirectory);

	    sectionContent.append('treez-check-box')
		   .label('Extra directory')
		   .value(false)
		   .onChange(this.refreshStatus)		  
		   .bindValue(this,()=>this.isIncludingjobIdInInputSubDirectory);

	   sectionContent.append('treez-check-box')
		   .label('File')
		   .value(false)
		   .onChange(this.refreshStatus)		  
		   .bindValue(this,()=>this.isIncludingjobIdInInputFile);  
   }	

	extendContextMenuActions(actions, treeViewer) {		

		return actions;
	}	
	
	getModifiedPath(executable){	

		let inputPath = executable.fullPath(executable.inputPath);
		
		let items = inputPath.split('/');

		let parentItemArray = items.slice(0, items.length-1);
       	let parentPath = parentItemArray.join('/');       	
		
		let lastItem = items[items.length-1];

		const subStrings = lastItem.split('.');

		let pathBase = parentPath + '/' + subStrings[0];
		let fileNameWithoutExtension = "";
        let pathPostFix = "";
        const hasFileExtension = subStrings.length > 1;
		if (hasFileExtension) {
			pathPostFix = "." + subStrings[1];
			fileNameWithoutExtension = subStrings[0];
			pathBase = parentPath;
		}

		let inputPathExpression = pathBase;

		inputPathExpression = this.__includeDirectory(inputPathExpression, executable);
		
		inputPathExpression = this.__includeSubDirectory(inputPathExpression, executable);

		if (hasFileExtension) {
			inputPathExpression = this.__includeFileNameAndExtension(fileNameWithoutExtension, pathPostFix,
					inputPathExpression, executable);
		}

		return inputPathExpression;
	}

	__includeDirectory(inputPathExpression, executable){
		var newExpression = this.__includeDateInDirectory(inputPathExpression, executable);
		newExpression = this.__includejobIdInDirectory(newExpression, executable);
		return newExpression;
	}

	__includeDateInDirectory(inputPathExpression, executable) {

		let newInputPath = inputPathExpression;

		const doIncludeDateInDirectory = this.isIncludingDateInInputDirectory;
		if (doIncludeDateInDirectory) {
			newInputPath += "_" + Utils.getDateString();
		}
		return newInputPath;
	}

	 __includejobIdInDirectory(inputPathExpression, executable) {

		let newInputPath = inputPathExpression;

		const doIncludejobIdInDirectory = this.isIncludingjobIdInInputDirectory;
		if (doIncludejobIdInDirectory) {
			newInputPath += "#" + executable.jobId;
		}
		return newInputPath;
	}

	__includeSubDirectory(inputPathExpression, executable) {

		let newInputPath = inputPathExpression;

		const isIncludingDateInSubDirectory = this.isIncludingDateInInputSubDirectory;
        const isIncludingjobIdInSubDirectory = this.isIncludingjobIdInInputSubDirectory;
        const doIncludeSubDirectory = isIncludingDateInSubDirectory || isIncludingjobIdInSubDirectory;

		if (doIncludeSubDirectory) {
			newInputPath += "/";
		}

		if (isIncludingDateInSubDirectory) {
			newInputPath += Utils.getDateString();
		}

		if (isIncludingjobIdInSubDirectory) {
			newInputPath += "#" + executable.jobId;
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
			newInputPath += "#" + executable.jobId;
		}
		newInputPath += pathPostFix; //is empty for directories
		return newInputPath;
	}

}
