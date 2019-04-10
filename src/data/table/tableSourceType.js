import Enum from './../../components/enum.js';

export default class TableSourceType extends Enum {}

TableSourceType.csv = new TableSourceType('csv');
TableSourceType.sqLite = new TableSourceType('sqLite');
TableSourceType.mySql = new TableSourceType('mySql');