import Utils from './../../core/utils/utils.js';
import ComponentAtom from './../../core/component/componentAtom.js';

export default class LoggingArguments extends ComponentAtom {

	constructor(name) {		
	    super(name);
		this.image = 'loggingArguments.png';
		
		this.logArguments = '';
	    this.logFileOrDirectoryPath = '';       
	}

    createComponentControl(tabFolder){  
		const page = tabFolder.append('treez-tab')
            .label('Data');
		
		this.__createLoggingSection(page);
	}	
    
    addLoggingArguments(commandToExtend){
		let command = commandToExtend;
		if (this.logArguments) {
			command += " " + this.logArguments;
		}

		if (this.logFileOrDirectoryPath) {
			command += " " + this.logFileOrDirectoryPath;
		}
		return command;
	}

    __createLoggingSection(page) {
        const section = page.append('treez-section')
            .label('Logging')
            .attr('expanded','false');

        const sectionContent = section.append('div'); 

        sectionContent.append('treez-text-area')
             .label('Log arguments') 
             .bindValue(this,()=>this.logArguments); 

        sectionContent.append('treez-file-or-directory-path')
             .label('Log file or directory') 
             .nodeAttr('pathMapProvider', this)
             .bindValue(this,() => this.logFileOrDirectoryPath);       
    }   

}
