import ComponentAtom from './../../core/component/componentAtom.js';
import TableSourceType from './tableSourceType.js';

export default class TableSource extends ComponentAtom  {

	constructor(name) {		
		super(name);
		this.__isRunnable=true;
		this.image = 'source.png';
		
		this.type = TableSourceType.sqLite;
		this.filePath = 'C:\database.sqlite';
		this.columnSeparator = ';';
		this.host = 'localhost';
		this.port = '8080';
		this.user = 'user';
		this.password = 'password';
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
	
	copy() {
		//TODO
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
		
		section.append('treez-section-action')
			.label('Import data')
			.action(()=>this.execute(this.__treeView));
			
		var sectionContent = section.append('div');
		
		sectionContent.append('treez-combo-box')
			.label('Source type')
			.values(TableSourceType.values)
			.onChange(()=> this.showAndHideDependentComponents())
			.bindValue(this, ()=>this.type);		

	}

	__createSourceDataSection(page) {
		
		var section = page.append('treez-section')
			.label('Source data');	
		
		var sectionContent = section.append('div');
		
		this.__filePathSelection = sectionContent.append('treez-file-path')
										.label('File path')
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
			.onChange(()=>this.showAndHideJobComponents())
			.bindValue(this, this.isFilteringForJob);
		
		this.__jobIdSelection = sectionContent.append('treez-text-field')
			.label('JobId')
			.bindValue(this,()=>this.jobId);
	
		this.__isUsingCustomQuerySelection = sectionContent.append('treez-check-box')
			.label('Use custom query')
			.onChange(()=>this.showAndHideJobComponents())
			.bindValue(this, this.isUsingCustomQuery);		
			
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
			this.__jobIdSelection.enable();
		} else {
			this.__jobIdSelection.disable();
		}
	}

	__showAndHideQueryComponents() {
		
		if (this.isUsingCustomQuery) {
			this.__customQuerySelection.enable();
			this.__tableNameSelection.disable();
			this.__filterForJobSelection.disable();
			this.__jobIdSelection.enable();
		} else {
			this.__customQuerySelection.disable();
			this.__tableNameSelection.enable();
			this.__filterForJobSelection.enable();
			showAndHideJobComponents();
		}
	}

	__showAndHideElementsForCsv() {

		this.__hostSelection.disable();
		this.__portSelection.disable();
		this.__userSelection.disable();
		this.__passwordSelection.disable();
		this.__schemaSelection.disable();
		this.__tableNameSelection.disable();
		this.__filterForJobSelection.disable();
		this.__jobIdSelection.disable();
		this.__useCustomQuerySelection.disable();
		this.__customQuerySelection.disable();
	}

	__showAndHideElementsForSqLite() {

		this.__columnSeparatorSelection.disable();
		this.__hostSelection.disable();
		this.__portSelection.disable();
		this.__userSelection.disable();
		this.__passwordSelection.enable();
		this.__schemaSelection.disable();
		this.__tableNameSelection.enable();
		this.__filterForJobSelection.enable();
		this.__useCustomQuerySelection.enable();
		showAndHideQueryComponents();
	}

	__showAndHideElementsForMySql() {

		this.__filePathSelection.disable();
		this.__columnSeparatoSelectionr.disable();
		this.__hostSelection.enable();
		this.__portSelection.enable();
		this.__userSelection.enable();
		this.__passwordSelection.enable();
		this.__schemaSelection.enable();
		this.__tableNameSelection.enable();
		this.__filterForJobSelection.enable();
		this.__useCustomQuerySelection.enable();
		showAndHideQueryComponents();
	}

	

}
