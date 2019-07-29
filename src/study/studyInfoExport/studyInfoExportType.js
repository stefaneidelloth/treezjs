import Enum from './../../components/enum.js';

export default class StudyInfoExportType extends Enum {}    

if(window.StudyInfoExportType){
	StudyInfoExportType = window.StudyInfoExportType;
} else {
	StudyInfoExportType.textFile = new StudyInfoExportType('Text file *.txt');                    
	StudyInfoExportType.sqLite = new StudyInfoExportType('SqLite database *.sqlite');                    
	StudyInfoExportType.mySql = new StudyInfoExportType('MySQL database');  
	
	window.StudyInfoExportType = StudyInfoExportType;
}