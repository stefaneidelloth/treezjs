import Utils from './../../core/utils/utils.js';
import ComponentAtom from './../../core/component/componentAtom.js';

export default class LoggingArguments extends ComponentAtom {

	constructor(name) {		
	    super(name);
		this.image = 'loggingArguments.png';
		
		this.logArguments = undefined;
	    this.logFilePath = undefined;       
	}

    createComponentControl(tabFolder){  
		const page = tabFolder.append('treez-tab')
            .title('Data');
		
		this.__createLoggingSection(page);
	}	
    
    addLoggingArguments(commandToExtend){
		let command = commandToExtend;
		if (this.logArguments) {
			command += " " + logArguments;
		}

		if (this.logFilePath) {
			command += " " + logFilePath;
		}
		return command;
	}

    __createLoggingSection(page) {
        const section = page.append('treez-section')
            .title('Logging')
            .attr('expanded','false');

        const sectionContent = section.append('div'); 

        sectionContent.append('treez-text-area')
             .title('Log arguments')           
             .onChange(()=>this.refreshStatus())          
             .bindValue(this,()=>this.logArguments); 

        sectionContent.append('treez-file-path')
             .title('Log file')            
             .onChange(()=>this.refreshStatus())  
             .nodeAttr('pathMapProvider', this)
             .bindValue(this,()=>this.logFilePath);       
    }   

}
