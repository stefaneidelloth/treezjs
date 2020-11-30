import ComponentAtom from './../../core/component/componentAtom.js';
import TableSourceType from './tableSourceType.js';

export default class TableSource extends ComponentAtom  {

	constructor(name) {		
		super(name);
		this.__isRunnable=true;
		this.image = 'tableSource.png';
		
		this.type = TableSourceType.sqLite;
		this.filePath = 'C:\database.sqlite';
		this.columnSeparator = ';';
		this.host = 'localhost';
		this.port = '8080';
		this.user = 'user';
		this.password = '';
		this.schema = 'my_schema';
		this.tableName = 'Sheet1';
		this.isFilteringForJob = false;
		this.jobId = '';
		this.isUsingCustomQuery = false;
		this.customQuery = '';
		
		this.__filePathSelection = undefined;
		this.__columnSeperatorSelection = undefined;		
		this.__hostSelection = undefined;		
		this.__portSelection = undefined;
		this.__userSelection = undefined;		
		this.__passwordSelection = undefined;		
		this.__schemaSelection = undefined;		
		this.__tableNameSelection = undefined;		
		this.__isFilteringForJobSelection = undefined;		
		this.__jobIdSelection = undefined;		
		this.__isUsingCustomQuerySelection = undefined;			
		this.__customQuerySelection = undefined;		
	}	
	
	createComponentControl(tabFolder){    
	     
		const page = tabFolder.append('treez-tab')
            .label('Data');

		this.__createSourceTypeSection(page); 
		this.__createSourceDataSection(page);      
	}	

	__createSourceTypeSection(page) {
		
		var section = page.append('treez-section')
			.label('Source type');

	    /*
		
		section.append('treez-section-action')
		    .image('run.png')
			.label('Import data')
			.addAction(()=>this.execute(this.__treeView));

		*/
			
		var sectionContent = section.append('div');
		
		sectionContent.append('treez-enum-combo-box')
			.label('Source type')
			.nodeAttr('enum', TableSourceType)			
			.bindValue(this, ()=>this.type)
			.onChange(()=> this.__showAndHideDependentComponents());		

	}

	__createSourceDataSection(page) {
		
		var section = page.append('treez-section')
			.label('Source data');	
		
		var sectionContent = section.append('div');
		
		this.__filePathSelection = sectionContent.append('treez-file-path')
										.label('File path')
										.nodeAttr('pathMapProvider', this)
										.bindValue(this,()=>this.filePath);
		
		this.__columnSeperatorSelection = sectionContent.append('treez-text-field')
											.label('Column separator')
											.bindValue(this,()=>this.columnSeparator);
		
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
		
		this.__schemaSelection = sectionContent.append('treez-text-field')
			.label('Schema')
			.bindValue(this,()=>this.schema);
		
		this.__tableNameSelection = sectionContent.append('treez-text-field')
			.label('Table name')
			.bindValue(this,()=>this.tableName);
		
		this.__isFilteringForJobSelection = sectionContent.append('treez-check-box')
			.label('Filter rows with JobId')			
			.bindValue(this, ()=>this.isFilteringForJob)
			.onChange(()=>this.__showAndHideJobComponents());
		
		this.__jobIdSelection = sectionContent.append('treez-text-field')
			.label('JobId')
			.bindValue(this,()=>this.jobId);
	
		this.__isUsingCustomQuerySelection = sectionContent.append('treez-check-box')
			.label('Use custom query')			
			.bindValue(this, ()=>this.isUsingCustomQuery)
			.onChange(()=>this.__showAndHideQueryComponents());		
			
		this.__customQuerySelection = sectionContent.append('treez-text-area')
			.label('Custom query')
			.bindValue(this,()=>this.customQuery);

	}

	afterCreateControlAdaptionHook() {
		this.__showAndHideDependentComponents();
	}

	__showAndHideDependentComponents() {		
		switch (this.type) {
		case TableSourceType.csv:
			this.__showAndHideElementsForCsv();
			break;
		case TableSourceType.sqLite:
			this.__showAndHideElementsForSqLite();
			break;
		case TableSourceType.mySql:
			this.__showAndHideElementsForMySql();
			break;
		default:
			var message = 'The TableSourceType ' + this.type + ' is not yet implemented.';
			throw new Error(message);
		}
	}

	__showAndHideJobComponents() {	
		if (this.isFilteringForJob) {
			this.__jobIdSelection.show();
		} else {
			this.__jobIdSelection.hide();
		}
	}

	__showAndHideQueryComponents() {		
		if (this.isUsingCustomQuery) {
			this.__customQuerySelection.show();
			this.__tableNameSelection.hide();
			this.__isFilteringForJobSelection.hide();
			this.__jobIdSelection.hide();
		} else {
			this.__customQuerySelection.hide();
			this.__tableNameSelection.show();
			this.__isFilteringForJobSelection.show();
			this.__showAndHideJobComponents();
		}
	}

	__showAndHideElementsForCsv() {
		this.__filePathSelection.show();
		this.__columnSeperatorSelection.show();
		this.__hostSelection.hide();
		this.__portSelection.hide();
		this.__userSelection.hide();
		this.__passwordSelection.hide();
		this.__schemaSelection.hide();
		this.__tableNameSelection.hide();
		this.__isFilteringForJobSelection.hide();
		this.__jobIdSelection.hide();
		this.__isUsingCustomQuerySelection.hide();
		this.__customQuerySelection.hide();
	}

	__showAndHideElementsForSqLite() {
		this.__columnSeperatorSelection.hide();
		this.__hostSelection.hide();
		this.__portSelection.hide();
		this.__userSelection.hide();
		this.__passwordSelection.show();
		this.__schemaSelection.hide();
		this.__tableNameSelection.show();
		this.__isFilteringForJobSelection.show();
		this.__isUsingCustomQuerySelection.show();
		this.__showAndHideQueryComponents();
	}

	__showAndHideElementsForMySql() {
		this.__filePathSelection.hide();
		this.__columnSeperatorSelection.hide();
		this.__hostSelection.show();
		this.__portSelection.show();
		this.__userSelection.show();
		this.__passwordSelection.show();
		this.__schemaSelection.show();
		this.__tableNameSelection.show();
		this.__isFilteringForJobSelection.show();
		this.__isUsingCustomQuerySelection.show();
		this.__showAndHideQueryComponents();
	}
	

}
