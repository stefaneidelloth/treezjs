import ColumnType from './../../column/columnType.js';

export default class SqLiteColumnTypeConverter {

	static convert(sqLiteColumnType) {

		switch (sqLiteColumnType) {
		case 'INTEGER':
			return ColumnType.integer;
		case 'REAL':
			return ColumnType.double;
		case 'TEXT':
			return ColumnType.string;
		case 'BLOB':
			return ColumnType.string;
		case 'int64':
			return ColumnType.integer;
		case 'object':
			return ColumnType.string;
		case 'float64':
			return ColumnType.double;
		default:
			throw new Error('Unknown sqlite column type "' + sqLiteColumnType + '"');
		}
	}	

	static convertBack(columnType){
		switch(columnType){
			case ColumnType.integer:
				return 'INTEGER'
			case ColumnType.string:
				return 'TEXT'
			case ColumnType.double:
				return 'REAL'
			default:
				throw new Error('Not yet implemented');
		}
	}

}
