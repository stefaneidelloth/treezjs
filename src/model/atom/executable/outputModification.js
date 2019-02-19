import Model from './../model.js';
import AddChildAtomTreeViewerAction from '../../../core/treeview/addChildAtomTreeViewerAction.js';
import InputFileGenerator from './../inputFileGenerator/inputFileGenerator.js';
import TableImport from './../tableImport/tableImport.js';

export default class Executable extends Model {

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

}
