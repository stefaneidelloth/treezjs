import Enum from './../../core/enum/enum.js';

export default class TableSourceType extends Enum {}

TableSourceType.Csv = new TableSourceType('Csv');
TableSourceType.SqLite = new TableSourceType('SqLite');
TableSourceType.MySql = new TableSourceType('MySql');