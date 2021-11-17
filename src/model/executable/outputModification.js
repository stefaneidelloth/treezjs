import Utils from './../../core/utils/utils.js';
import ComponentAtom from './../../core/component/componentAtom.js';

export default class OutputModification extends ComponentAtom {
    
	constructor(name) {		
	    super(name);
		this.image = 'outputModification.png';
		
        this.isIncludingDateInOutputFile = false;
        this.isIncludingDateInOutputDirectory = false;
        this.isIncludingDateInOutputSubDirectory = false;
        this.isIncludingjobIdInOutputFile = false;
        this.isIncludingjobIdInOutputDirectory = false;
        this.isIncludingjobIdInOutputSubDirectory = false;      
	}

    createComponentControl(tabFolder){    
		const page = tabFolder.append('treez-tab')
            .label('Data');
        this.createOutputModificationSection(page);   
	}	  

	createOutputModificationSection(page) {       

		const section = page.append('treez-section')
           .label('Output modification')
           .attr('expanded','false');

		this.createHelpAction(section, 'model/executable/outputModification.md');

        const sectionContent = section.append('div'); 

        sectionContent.append('treez-text-label')
       	   .value('Include date in name of:')

        sectionContent.append('treez-check-box')
		   .label('Directory')
		   .value(false)
		   .onChange(this.refreshStatus)		 
		   .bindValue(this,()=>this.isIncludingDateInOutputDirectory);

	    sectionContent.append('treez-check-box')
		   .label('Extra directory')
		   .value(false)		   
		   .onChange(this.refreshStatus)		  
		   .bindValue(this,()=>this.isIncludingDateInOutputSubDirectory);

	   	sectionContent.append('treez-check-box')
		   .label('File')
		   .value(false)
		   .onChange(this.refreshStatus)		 
		   .bindValue(this,()=>this.isIncludingDateInOutputFile);

      	sectionContent.append('treez-text-label')
       	   .value('Include jobId in name of:') 
       	   
		sectionContent.append('treez-check-box')
		   .label('Directory')
		   .value(false)
		   .onChange(this.refreshStatus)		  
		   .bindValue(this,()=>this.isIncludingjobIdInOutputDirectory);

	    sectionContent.append('treez-check-box')
		   .label('Extra directory')
		   .value(false)
		   .onChange(this.refreshStatus)		  
		   .bindValue(this,()=>this.isIncludingjobIdInOutputSubDirectory);

	   sectionContent.append('treez-check-box')
		   .label('File')
		   .value(false)
		   .onChange(this.refreshStatus)		  
		   .bindValue(this,()=>this.isIncludingjobIdInOutputFile);
   }  
   
   getModifiedPath(executable) {

   		let outputPath = executable.resolvedPath(executable.outputPath);
		
		let items = outputPath.split('/');

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
		

		let outputPathExpression = pathBase;

		outputPathExpression = this.__includeDirectory(outputPathExpression, executable);		

		outputPathExpression = this.__includeSubDirectory(outputPathExpression, executable);

		if (hasFileExtension) {
			//append file name and extension
			outputPathExpression = this.__includeFileNameAndExtension(fileNameWithoutExtension, pathPostFix,
					outputPathExpression, executable);
		}

		return outputPathExpression;
	}

	__includeDirectory(inputPathExpression, executable){
		var newExpression = this.__includeDateInDirectory(inputPathExpression, executable);
		newExpression = this.__includejobIdInDirectory(newExpression, executable);
		return newExpression;
	}

   __includeDateInDirectory(outputPathExpression, executable) {
		let newOutputPath = outputPathExpression;
		if (this.isIncludingDateInOutputDirectory) {
			newOutputPath += "_" + Utils.getDateString();
		}
		return newOutputPath;
	}

   __includejobIdInDirectory(outputPathExpression, executable) {
		let newOutputPath = outputPathExpression;
		if (this.isIncludingjobIdInOutputDirectory) {
			newOutputPath += "#" + executable.jobId;
		}
		return newOutputPath;
	}

   __includeSubDirectory(outputPathExpression, executable) {

		let newOutputPath = outputPathExpression;

		const isIncludingDateInSubDirectory = this.isIncludingDateInOutputSubDirectory;
       const isIncludingjobIdInSubDirectory = this.isIncludingjobIdInOutputSubDirectory;
       const doIncludeSubDirectory = isIncludingDateInSubDirectory || isIncludingjobIdInSubDirectory;

		if (doIncludeSubDirectory) {
			newOutputPath += "/";
		}

		if (isIncludingDateInSubDirectory) {
			newOutputPath += Utils.getDateString();
		}

		if (isIncludingjobIdInSubDirectory) {
			newOutputPath += "#" + executable.jobId;
		}
		return newOutputPath;
	}

   __includeFileNameAndExtension(fileNameWithoutExtension, pathPostFix, outputPathExpression, executable) {

		let newOutputPath = outputPathExpression;

		newOutputPath += "/";

		newOutputPath += fileNameWithoutExtension; //is empty for directories

		if (this.isIncludingDateInOutputFile) {
			newOutputPath += "_" + Utils.getDateString();
		}

		if (this.isIncludingjobIdInOutputFile) {
			newOutputPath += "#" + executable.jobId;
		}
		newOutputPath += pathPostFix; //is empty for directories
		return newOutputPath;
	}

}
