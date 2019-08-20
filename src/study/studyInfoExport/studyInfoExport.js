import Model from './../../model/model.js';
import StudyInfoExportType from './studyInfoExportType.js';

export default class StudyInfoExport extends Model {

	constructor(name){
		super(name);
		this.image = 'studyInfoExport.png';
		this.isRunnable = true;

		this.targetType = StudyInfoExportType.textFile;
		this.filePath = '';
		this.host = '';
		this.port = '';
		this.user = '';
		this.password = '';
		this.schema = '';

		this.__studyInfoTableName = 'study_info';
		this.__jobInfoTableName = 'job_info';
		this.__filePathSelection = undefined;	
		this.__hostSelection = undefined;		
		this.__portSelection = undefined;		
		this.__userSelection = undefined;		
		this.__passwordSelection = undefined;		
		this.__schemaSelection = undefined;	
	}

	createComponentControl(tabFolder){    
     
		const page = tabFolder.append('treez-tab')
            .label('Data');

		this.__createStudyInfoSection(page); 
		
	}

	async doRunModel(treeView, monitor) {
    	    	    	
		const startMessage = 'Running ' + this.constructor.name + ' "' + this.name + '".';
		monitor.info(startMessage);	
		
		monitor.totalWork = 1;	
		
		var study = this.parent;
	    var inputGenerator = study.inputGenerator;
		await this.__exportStudyInfo(inputGenerator, monitor);
	
		monitor.done();
		
    }  
	
	__createStudyInfoSection(tab) {


		const section = tab.append('treez-section')
            .label('Study info export'); 

        this.createHelpAction(section, 'study/studyInfoExport/studyInfoExport.md');
		
        section.append('treez-section-action')
            .image('run.png')
            .label('Export study info')
            .addAction(()=>this.execute(this.__treeView)
            				   .catch(error => {
            					   	console.error('Could not execute  ' + this.constructor.name + ' "' + this.name + '"!', error);            					   
            				   })
            );  

        const sectionContent = section.append('div'); 

        sectionContent.append('treez-enum-combo-box')
            .label('Type')           
            .onChange(() => this.__showAndHideDependentComponents())	            
            .nodeAttr('options', StudyInfoExportType)
            .bindValue(this,()=>this.targetType);

        this.__filePathSelection = sectionContent.append('treez-file-path')
            .label('File path')  
            .nodeAttr('pathMapProvider', this)
            .bindValue(this,()=>this.filePath);  

        this.__hostSelection = sectionContent.append('treez-text-field')
			.label('Host')
			.bindValue(this, ()=>this.host);
		
		this.__portSelection = sectionContent.append('treez-text-field')
			.label('Port')
			.bindValue(this, ()=>this.port);

		this.__schemaSelection = sectionContent.append('treez-text-field')
			.label('Schema name')
			.bindValue(this, ()=>this.schema); 
		
		this.__userSelection = sectionContent.append('treez-text-field')
			.label('User')
			.bindValue(this, ()=>this.user);
		
		this.__passwordSelection = sectionContent.append('treez-text-field')
			.label('Password')
			.bindValue(this, ()=>this.password);
		
		 

		this.__showAndHideDependentComponents();			
	}


	__showAndHideDependentComponents(){

		switch (this.targetType) {
			case StudyInfoExportType.textFile:
				this.__filePathSelection.show();
				this.__hostSelection.hide();
				this.__portSelection.hide();
				this.__userSelection.hide();
				this.__passwordSelection.hide();
				this.__schemaSelection.hide();				
				break;
			case StudyInfoExportType.sqLite:
				this.__filePathSelection.show();
				this.__hostSelection.hide();
				this.__portSelection.hide();
				this.__userSelection.hide();
				this.__passwordSelection.show();
				this.__schemaSelection.hide();
				break;
			case StudyInfoExportType.mySql:
				this.__filePathSelection.hide();
				this.__hostSelection.show();
				this.__portSelection.show();
				this.__userSelection.show();
				this.__passwordSelection.show();
				this.__schemaSelection.show();
				break;
			default:
				throw new Error('The export type "' + this.targetType + '" has not yet been implemented.');
			}

		
	}

	async __exportStudyInfo(inputGenerator, monitor) {		

		switch (this.targetType) {
		
			case StudyInfoExportType.textFile:
				if (!this.filePath) {
					var message = 'Export of study info to text file is enabled but no file path '
							+ '(e.g. C:/studyInfo.txt) has been specified. The xxport is cancled.';
					monitor.warn(message);
					return;
				}
				inputGenerator.exportStudyInfoToTextFile(this.filePath);
				monitor.info('Exported study info totextfile: ' + this.filePath);
				return;
			case StudyInfoExportType.sqLite:
				if (!this.filePath) {
					var message = 'Export of study info to sqLite is enabled but no database file '
							+ '(e.g. c:/studyInfo.sqlite) has been specified. The export is cancled.';
					monitor.warn(message);
					return;
				}
				await this.__exportStudyInfoToSqLiteDatabase(inputGenerator)
				.catch(error=>{
					console.log(error);
				});
				monitor.info('Exported study info to SqLite database: ' + this.filePath);
				return;
			case StudyInfoExportType.mySql:
				await this.__exportStudyInfoToMySqlDatabase(inputGenerator);
				var message = 'Exported study info to MySql database: ' + this.host + ':' + this.port + '/' + this.schema;
				monitor.info(message);
				break;
			default:
				var message = 'The export type "' + this.exportType + '" has not yet been implemented.';
				throw new Error(message);
		}

	}

	async __exportStudyInfoToSqLiteDatabase(inputGenerator) {	
	    var a=1;		
		await this.__writeSqLiteStudyInfo(inputGenerator);
		await this.__writeSqLiteJobInfo(inputGenerator);
	}

	async __exportStudyInfoToMySqlDatabase(inputGenerator) {		
		await this.__writeMySqlStudyInfo(inputGenerator);
		await this.__writeMySqlJobInfo(inputGenerator);
	}

	async __writeSqLiteStudyInfo(inputGenerator) {		
		await this.__createSqLiteStudyInfoTableIfNotExists(this.connectionString, this.__studyInfoTableName);
		await this.__deleteOldSqLiteEntriesForStudyIfExist(this.connectionString, this.__studyInfoTableName);
		await inputGenerator.fillSqLiteStudyInfo(this.connectionString, this.__studyInfoTableName);
	}	

	async __writeMySqlStudyInfo(inputGenerator) {		
		await this.__createMySqlStudyInfoTableIfNotExists(this.connectionString, this.__studyInfoTableName);
		await this.__deleteOldMySqlEntriesForStudyIfExist(this.connectionString, this.__studyInfoTableName);
		await inputGenerator.fillMySqlStudyInfo(this.connectionString, this.schema, this.__studyInfoTableName);
	}

	async __createSqLiteStudyInfoTableIfNotExists(connectionString, tableName) {
		var query = "CREATE TABLE IF NOT EXISTS '" + tableName
				+ "' (id INTEGER PRIMARY KEY NOT NULL, study TEXT, variable TEXT, value TEXT);";
		await window.treezTerminal.sqLiteQuery(connectionString, query, false)
		.catch((error)=>{
					console.log(error);
				});
	}

	async __createMySqlStudyInfoTableIfNotExists(connectionString, schema, tableName) {
		var query = "CREATE TABLE IF NOT EXISTS `" + schema + "`.`" + tableName
				+ "` (id int NOT NULL AUTO_INCREMENT, study TEXT, variable TEXT, value TEXT, PRIMARY KEY(id));";
		await database.mySqLQuery(connectionString, query, false)
		.catch((error)=>{
					console.log(error);
				});
	}

	async __deleteOldSqLiteEntriesForStudyIfExist(connectionString, tableName) {
		var query = "DELETE FROM '" + tableName + "' WHERE study = '" + this.studyId + "';";
		await window.treezTerminal.sqLiteQuery(connectionString, query, false)
		.catch((error)=>{
					console.log(error);
				});
	}

	async __deleteOldMySqlEntriesForStudyIfExist(connectionString, schema, tableName) {
		var query = "DELETE FROM `" + schema + "`.`" + tableName + "` WHERE study = '" + getStudyIdFromParent()
				+ "';";
		await window.treezTerminal.mySqlQuery(connectionString, query, false)
		.catch((error)=>{
					console.log(error);
				});
	}

	async __writeSqLiteJobInfo(inputGenerator) {
		
		await this.__createSqLiteJobInfoTableIfNotExists(this.connectionString, this.__jobInfoTableName);
		await this.__deleteOldSqLiteEntriesForStudyIfExist(this.connectionString, this.__jobInfoTableName);
		
		var studyId = this.studyId;
		for (var modelInput of inputGenerator.modelInputs) {
			var jobId = modelInput.jobId;
			var variablePaths = modelInput.all;
			for (var variablePath of variablePaths) {
				var value = modelInput.get(variablePath);
				var query = "INSERT INTO '" + this.__jobInfoTableName + "' VALUES(null, '" + studyId + "', '" + jobId
						+ "', '" + variablePath + "','" + value + "')";
				await window.treezTerminal.sqLiteQuery(this.connectionString, query, false)
				.catch((error)=>{
					console.log(error);
				});
			}
		}
	}

	async __writeMySqlJobInfo(inputGenerator) {
		
		await this.__createMySqlJobInfoTableIfNotExists(this.connectionString, this.schema, this.__jobInfoTableName);
		await this.__deleteOldMySqlEntriesForStudyIfExist(this.connectionString, this.schema, this.jobInfoTableName);
		var studyId = this.studyId;
		for (var modelInput of inputGenerator.createModelInputs()) {
			var jobId = modelInput.getJobId();
			var variablePaths = modelInput.all;
			for (var variablePath of variablePaths) {
				var value = modelInput.get(variablePath);
				var query = "INSERT INTO `" + this.schema + "`.`" + this.__jobInfoTableName + "` VALUES(null, '" + studyId
						+ "', '" + jobId + "', '" + variablePath + "','" + value + "')";
				await window.treezTerminal.mySqlQuery(this.connectionString, query, false)
				.catch((error)=>{
					console.log(error);
				});			
			}
		}
	}

	async __createSqLiteJobInfoTableIfNotExists(connectionString, tableName) {
		var query = "CREATE TABLE IF NOT EXISTS '" + tableName
				+ "' (id INTEGER PRIMARY KEY NOT NULL, study TEXT, job TEXT, variable TEXT, value TEXT);";
		await window.treezTerminal.sqLiteQuery(connectionString, query, false)
			.catch((error)=>{
				console.log(error);
			});
	}

	async __createMySqlJobInfoTableIfNotExists(connectionString, schema, tableName) {
		var query = "CREATE TABLE IF NOT EXISTS `" + schema + "`.`" + tableName
				+ "` (id int NOT NULL AUTO_INCREMENT, study TEXT, job TEXT, variable TEXT, value TEXT, PRIMARY KEY(id));";
		await window.treezTerminal.mySqlQuery(connectionString, query, false)
		.catch((error)=>{
					console.log(error);
				});
	}	

	get connectionString(){
		switch(this.targetType){
			case StudyInfoExportType.textFile:
				throw new Error('Text file should not need a connection string.')
			case StudyInfoExportType.sqLite:				
				return this.fullPath(this.filePath);
			case StudyInfoExportType.mySql:
				return this.host + ':' + this.port; //TODO check this
			default:
				var message = 'The export type "' + this.exportType + '" has not yet been implemented.';
				throw new Error(message);
		}
	}

	get studyId(){
		return this.parent.id;
	}

}
