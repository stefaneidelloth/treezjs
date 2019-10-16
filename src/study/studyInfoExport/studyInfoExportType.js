import Enum from './../../components/enum.js';

export default class StudyInfoExportType extends Enum {

}

if(window.StudyInfoExportType){
	StudyInfoExportType = window.StudyInfoExportType;
} else {
	StudyInfoExportType.textFile = new StudyInfoExportType('textFile');
	StudyInfoExportType.sqLite = new StudyInfoExportType('sqLite');
	StudyInfoExportType.mySql = new StudyInfoExportType('mySql');
	
	window.StudyInfoExportType = StudyInfoExportType;
}