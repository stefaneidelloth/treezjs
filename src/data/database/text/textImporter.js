import Importer from './../importer.js';

export default class TextImporter extends Importer {

	constructor() {
		
	}

	/*


	public static TableData importData(String filePath, String columnSeparator, int rowLimit) {

		//read tab separated entries
		List<List<Object>> data = readTextData(filePath, columnSeparator, rowLimit);

		//check data size (number of lines > 1, number of columns equal)
		checkDataSizes(data);

		//get header data
		List<Object> currentHeaderDataObjects = data.get(0);
		List<String> currentHeaderData = new ArrayList<>();
		for (Object headerObj : currentHeaderDataObjects) {
			currentHeaderData.add(headerObj.toString());
		}

		//get row data
		List<List<Object>> currentRowData = data.subList(1, data.size());

		TableData tableData = new TableData() {

			@Override
			public List<String> getHeaderData() {
				return currentHeaderData;
			}

			@Override
			public ColumnType getColumnType(String header) {
				return ColumnType.STRING;
			}

			@Override
			public List<List<Object>> getRowData() {
				return currentRowData;
			}
		};

		return tableData;
	}


	private static void checkDataSizes(List<List<Object>> data) {
		int numberOfLines = data.size();

		//check number of lines
		if (numberOfLines < 2) {
			throw new IllegalStateException("The text file must contain at least two lines");
		}

		//get number of columns from first line
		int numberOfColumns = data.get(0).size();

		//check number of columns of all lines
		int lineCounter = 1;
		for (List<Object> entries : data) {
			int currentNumberOfColumns = entries.size();
			boolean hasSameNumberOfColumns = (currentNumberOfColumns == numberOfColumns);
			if (!hasSameNumberOfColumns) {
				String message = "The number of columns in line " + lineCounter + " has to be " + numberOfColumns
						+ " but is " + currentNumberOfColumns + ".";
				throw new IllegalStateException(message);
			}
			lineCounter++;
		}

	}


	private static List<List<Object>> readTextData(String filePath, String columnSeparator, int rowLimit) {

		List<List<Object>> lines = new ArrayList<>();
		int rowCount = 0;
		try (
				BufferedReader br = new BufferedReader(new FileReader(filePath))) {
			String line;
			while ((line = br.readLine()) != null && rowCount < rowLimit) {
				String[] lineEntries = line.split(columnSeparator);
				lines.add(Arrays.asList(lineEntries));
				rowCount++;
			}
		} catch (IOException exception) {
			String message = "Could not read text file '" + filePath + "'";
			LOG.error(message, exception);
			throw new IllegalStateException(message, exception);
		}

		return lines;
	}

	*/

}
