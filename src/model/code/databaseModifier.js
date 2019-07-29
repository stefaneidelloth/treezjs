import CodeModel from './codeModel.js';
import AddChildAtomTreeViewAction from './../../core/treeview/addChildAtomTreeViewAction.js';
import TableTargetType from './../../data/table/tableTargetType.js';

export default class DatabaseModifier extends CodeModel {   

	//static variable __finishedString is defined below class definition

	constructor(name) {		
		super(name);
		this.image = 'databaseModifier.png';
				
		this.targetType = TableTargetType.sqLite;

		this.targetFilePath = 'C:/data.sqlite';
        
        this.host = 'host';
        this.port = '3128';
        this.user = 'user';
        this.password = ''; 
        
        this.code = "UPDATE 'my_table' SET 'my_column'= {$jobId$} WHERE name='Fred'";

        this.__targetTypeSelection = undefined;			
		this.__targetFilePathSelection = undefined;		
		
		this.__hostSelection = undefined;		
		this.__portSelection = undefined;		
		this.__userSelection = undefined;		
		this.__passwordSelection = undefined;         
	}	

	get mode(){
		return 'sql';
	}

    createComponentControl(tabFolder){    
     
		const page = tabFolder.append('treez-tab')
            .label('Data');

		this.createSourceModelSection(page); 
		this.__createTargetDatabaseSection(page); 
		this.__showAndHideComponents();
		this.createCodeSection(page);		
        this.createStatusSection(page);
	}

	extendContextMenuActions(actions, parentSelection, treeView) {
		return actions;
	}

	   
    
    async executeCode(query, monitor){
    	
    	switch(this.targetType){
    		case TableTargetType.sqLite:
    			var connectionString = this.fullPath(this.targetFilePath);
    			var query = this.buildCode();
    			await window.treezTerminal.sqLiteQuery(connectionString, query, false)
    				.catch((error)=>{
    					monitor.error(error);
    					monitor.cancel();
    				});
    			break;
    		case TableTargetType.mySql:
    			throw new Error('Not yet implemented');
    		default:
    			throw new Error('Not yet implemented');    		
    	}    	
    }   

   
    __createTargetDatabaseSection(page) {

		const section = page.append('treez-section')
            .label('Target database'); 

        this.createHelpAction(section, 'model/code/databaseModifier.md#target-database');  

        const sectionContent = section.append('div'); 
        
        sectionContent.append('treez-enum-combo-box')
        	.label('Type')
        	.nodeAttr('options', TableTargetType)
        	.onChange(() => this.__showAndHideComponents())
        	.bindValue(this, ()=>this.targetType);

        this.__targetFilePathSelection = sectionContent.append('treez-file-path')
            .label('Database file')           
            .onChange(()=>this.refreshStatus())  
            .nodeAttr('pathMapProvider', this)
            .bindValue(this,()=>this.targetFilePath);  
        
        this.__hostSelection = sectionContent.append('treez-text-field')
        	.label('Host')
        	.bindValue(this,()=>this.host);
        
        this.__portSelection = sectionContent.append('treez-text-field')
	    	.label('Port')
	    	.bindValue(this,()=>this.port);
        
        this.__userSelection = sectionContent.append('treez-text-field')
	    	.label('User')
	    	.bindValue(this,()=>this.user);
        
        this.__passwordSelection = sectionContent.append('treez-text-field')
	    	.label('Password')
	    	.bindValue(this,()=>this.password);
                  
	}  

	__showAndHideComponents(){
		switch(this.targetType){
			case TableTargetType.sqLite:
				this.__showAndHideComponentsForSqLite();
				break;
			case TableTargetType.mySql:
			this.__showAndHideComponentsForMySql();
				break;
			default:
				throw new Error('Not yet implemented');
		}
	}

	__showAndHideComponentsForSqLite(){		
		this.__hostSelection.hide();		
		this.__portSelection.hide();	
		this.__userSelection.hide();	
		this.__passwordSelection.show();	
		this.__targetFilePathSelection.show();	
	}

	__showAndHideComponentsForMySql(){
		this.__hostSelection.show();		
		this.__portSelection.show();	
		this.__userSelection.show();	
		this.__passwordSelection.show();	
		this.__targetFilePathSelection.hide();	
	} 	

}
