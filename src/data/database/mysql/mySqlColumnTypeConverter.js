import ColumnType from './../../column/columnType.js';

export default class MySqlColumnTypeConverter  {

	static convert(mySqlColumnType) {

		switch (mySqlColumnType) {
		case 'int':
			return ColumnType.INTEGER;
		case 'integer':
			return ColumnType.INTEGER;
		case 'tinyint':
			return ColumnType.INTEGER;
		case 'bool':
			return ColumnType.INTEGER;
		case 'boolean':
			return ColumnType.INTEGER;
		case 'float':
			return ColumnType.DOUBLE;
		case 'double':
			return ColumnType.DOUBLE;
		case 'char':
			return ColumnType.STRING;
		case 'varchar':
			return ColumnType.STRING;
		default:
			throw new Error('The MySql column type "' + mySqlColumnType + '" is not yet implemented.');
		}
	}

}
