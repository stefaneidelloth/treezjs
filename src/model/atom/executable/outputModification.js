import Utils from './../../../core/utils/utils.js';
import ComponentAtom from './../../../core/component/componentAtom.js';

export default class OutputModification extends ComponentAtom {

    static get LOG() {
        return new Log4js.getLogger(Executable.constructor.name);
    }

	constructor(name) {		
	    super(name);
		this.image = 'outputModification.png';
		
        this.isIncludingDateInOutputFile = undefined;
        this.isIncludingDateInOutputFolder = undefined;
        this.isIncludingDateInOutputSubFolder = undefined;
        this.isIncludingJobIndexInOutputFile = undefined;
        this.isIncludingJobIndexInOutputFolder = undefined;
        this.isIncludingJobIndexInOutputSubFolder = undefined;      
	}

	copy() {
		//TODO
	}	

    createComponentControl(tabFolder, dTreez){    
     
		const page = tabFolder.append('treez-tab')
            .title('Data');
		
        this.createOutputModificationSection(page);       
	     
	}	  

   createOutputModificationSection(page) {       

       const section = page.append('treez-section')
           .title('Output modification')
           .attr('expanded','false');

       const sectionContent = section.append('div'); 

       sectionContent.append('treez-text-label')
       	   .value('Include date in:')

       sectionContent.append('treez-check-box')
		   .label('Folder name')
		   .value(false)
		   .onChange(this.refreshStatus)		 
		   .bindValue(this,()=>this.isIncludingDateInOutputFolder);

	    sectionContent.append('treez-check-box')
		   .label('Extra folder')
		   .value(false)		   
		   .onChange(this.refreshStatus)		  
		   .bindValue(this,()=>this.isIncludingDateInOutputSubFolder);

	   	sectionContent.append('treez-check-box')
		   .label('File name')
		   .value(false)
		   .onChange(this.refreshStatus)		 
		   .bindValue(this,()=>this.isIncludingDateInOutputFile);

      	sectionContent.append('treez-text-label')
       	   .value('Include job index in:') 
       	   
		sectionContent.append('treez-check-box')
		   .label('Folder name')
		   .value(false)
		   .onChange(this.refreshStatus)		  
		   .bindValue(this,()=>this.isIncludingJobIndexInOutputFolder);

	    sectionContent.append('treez-check-box')
		   .label('Extra folder')
		   .value(false)
		   .onChange(this.refreshStatus)		  
		   .bindValue(this,()=>this.isIncludingJobIndexInOutputSubFolder);

	   sectionContent.append('treez-check-box')
		   .label('File name')
		   .value(false)
		   .onChange(this.refreshStatus)		  
		   .bindValue(this,()=>this.isIncludingJobIndexInOutputFile);           
    
   }  
   
   getModifiedPath(executable) {
		
		//split path with point to determine file extension if one exists
       const subStrings = executable.outputPath.split("\\.");

       let pathBase = subStrings[0];
       let fileNameWithoutExtension = "";
       let pathPostFix = "";
       const hasFileExtension = subStrings.length > 1;
		if (hasFileExtension) {
			pathPostFix = "." + subStrings[1];
			fileNameWithoutExtension = Utils.extractFileName(pathBase);
			pathBase = Utils.extractParentFolder(pathBase);
		}

		let outputPathExpression = pathBase;

		outputPathExpression = this.__includeDateInFolder(outputPathExpression, executable);

		outputPathExpression = this.__includeJobIndexInFolder(outputPathExpression, executable);

		outputPathExpression = this.__includeSubFolder(outputPathExpression, executable);

		if (hasFileExtension) {
			//append file name and extension
			outputPathExpression = this.__includeFileNameAndExtension(fileNameWithoutExtension, pathPostFix,
					outputPathExpression, executable);
		}

		return outputPathExpression;
	}

   __includeDateInFolder(outputPathExpression, executable) {
		let newOutputPath = outputPathExpression;
		if (this.isIncludingDateInOutputFolder) {
			newOutputPath += "_" + Utils.getDateString();
		}
		return newOutputPath;
	}

   __includeJobIndexInFolder(outputPathExpression, executable) {
		let newOutputPath = outputPathExpression;
		if (this.isIncludingJobIndexInOutputFolder) {
			newOutputPath += "#" + executable.getJobIndex();
		}
		return newOutputPath;
	}

   __includeSubFolder(outputPathExpression, executable) {

		let newOutputPath = outputPathExpression;

		const isIncludingDateInSubFolder = this.isIncludingDateInOutputSubFolder;
       const isIncludingJobIndexInSubFolder = this.isIncludingJobIndexInOutputSubFolder;
       const doIncludeSubFolder = isIncludingDateInSubFolder || isIncludingJobIndexInSubFolder;

		if (doIncludeSubFolder) {
			newOutputPath += "/";
		}

		if (isIncludingDateInSubFolder) {
			newOutputPath += Utils.getDateString();
		}

		if (isIncludingJobIndexInSubFolder) {
			newOutputPath += "#" + executable.getJobIndex();
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

		if (this.isIncludingJobIndexInOutputFile) {
			newOutputPath += "#" + executable.getJobIndex();
		}
		newOutputPath += pathPostFix; //is empty for directories
		return newOutputPath;
	}

}
