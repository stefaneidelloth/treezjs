import Model from './../../model/model.js';
import StudyInfoExportType from './studyInfoExportType.js';

export default class StudyInfoExport extends Model {

	constructor(name){
		super(name);
		this.image = 'studyInfoExport.png';
		this.isRunnable = true;

		this.type = StudyInfoExportType.textFile;
		this.filePath = '';
		this.host = '';
		this.port = '';
		this.user = '';
		this.password = '';
		this.schema = '';

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
	    var inputGenerator = study.modelInputGenerator;
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
            .bindValue(this,()=>this.type);

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

		switch (this.type) {
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
				throw new Error('The export type "' + this.type + '" has not yet been implemented.');
			}

		
	}

	__exportStudyInfo(modelInputGenerator, monitor) {		

		switch (this.type) {
		
			case StudyInfoExportType.textFile:
				if (!this.filePath) {
					var message = 'Export of study info to text file is enabled but no file path '
							+ '(e.g. C:/studyInfo.txt) has been specified. The xxport is cancled.';
					monitor.warn(message);
					return;
				}
				modelInputGenerator.exportStudyInfoToTextFile(filePath);
				monitor.info('Exported study info totextfile: ' + this.filePath);
				return;
			case StudyInfoExportType.sqLite:
				if (!this.filePath) {
					var message = 'Export of study info to sqLite is enabled but no database file '
							+ '(e.g. c:/studyInfo.sqlite) has been specified. The export is cancled.';
					monitor.warn(message);
					return;
				}
				this.__exportStudyInfoToSqLiteDatabase(modelInputGenerator, this.filePath);
				monitor.info('Exported study info to SqLite database: ' + filePath);
				return;
			case StudyInfoExportType.mySql:
				this.__exportStudyInfoToMySqlDatabase(modelInputGenerator);
				var message = 'Exported study info to MySql database: ' + this.host + ':' + this.port + '/' + this.schema;
				monitor.info(message);
				break;
			default:
				var message = 'The export type "' + exportType + '" has not yet been implemented.';
				throw new Error(message);
		}

	}

	__exportStudyInfoToSqLiteDatabase(modelInputGenerator, filePath) {
		var database = new SqLiteDatabase(filePath);
		this.__writeStudyInfo(modelInputGenerator, database);
		this.__writeJobInfo(modelInputGenerator, database);

	}

	__exportStudyInfoToMySqlDatabase(inputGenerator) {
		var url = this.host + ':' + this.port;
		var database = new MySqlDatabase(url, this.user, this.password);
		this.__writeStudyInfo(inputGenerator, database, this.schema);
		this.__writeJobInfo(inputGenerator, database, this.schema);
	}

	__writeStudyInfo(inputGenerator, database) {
		var studyInfoTableName = "study_info";
		createStudyInfoTableIfNotExists(database, studyInfoTableName);
		deleteOldEntriesForStudyIfExist(database, studyInfoTableName);
		inputGenerator.fillStudyInfo(database, studyInfoTableName, getStudyIdFromParent());
	}

	__writeStudyInfo(inputGenerator, database, schema) {
		var studyInfoTableName = "study_info";
		createStudyInfoTableIfNotExists(database, schema, studyInfoTableName);
		deleteOldEntriesForStudyIfExist(database, schema, studyInfoTableName);
		inputGenerator.fillStudyInfo(database, schema, studyInfoTableName, getStudyIdFromParent());
	}

	__createStudyInfoTableIfNotExists(database, tableName) {
		var query = 'CREATE TABLE IF NOT EXISTS ´' + tableName
				+ '´ (id INTEGER PRIMARY KEY NOT NULL, study TEXT, variable TEXT, value TEXT);';
		database.execute(query);
	}

	__createStudyInfoTableIfNotExists(database, schema, tableName) {
		var query = "CREATE TABLE IF NOT EXISTS `" + schema + "`.`" + tableName
				+ "` (id int NOT NULL AUTO_INCREMENT, study TEXT, variable TEXT, value TEXT, PRIMARY KEY(id));";
		database.execute(query);
	}

	__deleteOldEntriesForStudyIfExist(database, tableName) {
		var query = "DELETE FROM '" + tableName + "' WHERE study = '" + getStudyIdFromParent() + "';";
		database.execute(query);
	}

	__deleteOldEntriesForStudyIfExist(database, schema, tableName) {
		var query = "DELETE FROM `" + schema + "`.`" + tableName + "` WHERE study = '" + getStudyIdFromParent()
				+ "';";
		database.execute(query);
	}

	__writeJobInfo(inputGenerator, database) {
		var jobInfoTableName = "job_info";
		createJobInfoTableIfNotExists(database, jobInfoTableName);
		deleteOldEntriesForStudyIfExist(database, jobInfoTableName);
		var studyId = getStudyIdFromParent();

		for (var modelInput of inputGenerator.createModelInputs()) {
			var jobId = modelInput.getJobId();
			varvariablePaths = modelInput.all;
			for (var variablePath of variablePaths) {
				var value = modelInput.getVariableValue(variablePath);
				var query = "INSERT INTO '" + jobInfoTableName + "' VALUES(null, '" + studyId + "', '" + jobId
						+ "', '" + variablePath + "','" + value + "')";
				database.execute(query);
			}
		}
	}

	__writeJobInfo(inputGenerator, database, schema) {
		var jobInfoTableName = "job_info";
		createJobInfoTableIfNotExists(database, schema, jobInfoTableName);
		deleteOldEntriesForStudyIfExist(database, schema, jobInfoTableName);
		var studyId = getStudyIdFromParent();
		for (var modelInput of inputGenerator.createModelInputs()) {
			var jobId = modelInput.getJobId();
			var variablePaths = modelInput.all;
			for (var variablePath of variablePaths) {
				var value = modelInput.getVariableValue(variablePath);
				var query = "INSERT INTO `" + schema + "`.`" + jobInfoTableName + "` VALUES(null, '" + studyId
						+ "', '" + jobId + "', '" + variablePath + "','" + value + "')";
				database.execute(query);
			}
		}
	}

	__createJobInfoTableIfNotExists(database, tableName) {
		var query = "CREATE TABLE IF NOT EXISTS '" + tableName
				+ "' (id INTEGER PRIMARY KEY NOT NULL, study TEXT, job TEXT, variable TEXT, value TEXT);";
		database.execute(query);
	}

	__createJobInfoTableIfNotExists(database, schema, tableName) {
		var query = "CREATE TABLE IF NOT EXISTS `" + schema + "`.`" + tableName
				+ "` (id int NOT NULL AUTO_INCREMENT, study TEXT, job TEXT, variable TEXT, value TEXT, PRIMARY KEY(id));";
		database.execute(query);
	}	

}
