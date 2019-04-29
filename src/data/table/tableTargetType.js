import Enum from './../../components/enum.js';

export default class TableTargetType extends Enum {}

if(window.TableTargetType){
	TableTargetType = window.TableTargetType;
} else {
	TableTargetType.sqLite = new TableTargetType('sqLite');
	TableTargetType.mySql = new TableTargetType('mySql');
    
    window.TableTargetType = TableTargetType;
}