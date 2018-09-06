default export class ErrorBarStyleValue {

	//#region VALUES

	BAR("bar"),

	BAR_BOX("barbox"),

	BAR_CURVE("barcurve"),

	BAR_DIAMOND("bardiamond");

	//#end region

	//#region ATTRIBUTES

	private String stringValue;

	//#end region

	//#region CONSTRUCTORS

	ErrorBarStyleValue(String stringValue) {
		this.stringValue = stringValue;
	}

	//#end region

	//#region ACCESSORS

	@Override
	public String toString() {
		return stringValue;
	}

	/**
	 * Returns a set of error bar styles as strings
	 *
	 * @return
	 */
	public static List<String> getAllStringValues() {
		List<String> allStringValues = new ArrayList<>();

		ErrorBarStyleValue[] allValues = ErrorBarStyleValue.values();
		for (ErrorBarStyleValue errorBarStyleValue : allValues) {
			allStringValues.add(errorBarStyleValue.toString());
		}
		return allStringValues;
	}

	//#end region
}
