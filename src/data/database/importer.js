export default class Importer {

	constructor(){
		this.__JOB_ID_PLACEHOLDER = '{$jobId$}';
	}

	removeTrailingSemicolon(customQuery) {

		var length = customQuery.length;
		if (length < 1) {
			return customQuery;
		}

		var endsWithSemicolon = customQuery.endswith(';');
		if (endsWithSemicolon) {
			return customQuery.substring(0, length - 1);
		} else {
			return customQuery;
		}
	}

	injectJobIdIfIncludesPlaceholder(customQuery, jobId) {
		return customQuery.replace(JOB_ID_PLACEHOLDER, jobId);
	}

	//#end region

}

