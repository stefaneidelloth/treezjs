import Utils from './../../../core/utils/utils.js';

export default class InputPathModifier {


	constructor(executable) {
		this.inputPathProvider = executable;
	}

	getModifiedInputPath(inputPath) {

		let inputPathString = inputPath.replace("\\", "/");

		//split path with point to determine file extension if one exists
		const subStrings = inputPathString.split("\\.");

		let pathBase = subStrings[0];
		let fileNameWithoutExtension = "";
        let pathPostFix = "";
        const hasFileExtension = subStrings.length > 1;
		if (hasFileExtension) {
			pathPostFix = "." + subStrings[1];
			fileNameWithoutExtension = Utils.extractFileName(pathBase);
			pathBase = Utils.extractParentFolder(pathBase);
		}

		let inputPathExpression = pathBase;

		inputPathExpression = this.includeDateInFolder(inputPathExpression);

		inputPathExpression = this.includeJobIndexInFolder(inputPathExpression);

		inputPathExpression = this.includeSubFolder(inputPathExpression);

		if (hasFileExtension) {
			inputPathExpression = this.includeFileNameAndExtension(fileNameWithoutExtension, pathPostFix,
					inputPathExpression);
		}

		return inputPathExpression;
	}

	includeDateInFolder(inputPathExpression) {

		let newInputPath = inputPathExpression;

		const doIncludeDateInFolder = inputPathProvider.isIncludingDateInInputFolder;
		if (doIncludeDateInFolder) {
			newInputPath += "_" + Utils.getDateString();
		}
		return newInputPath;
	}

	 includeJobIndexInFolder(inputPathExpression) {

		let newInputPath = inputPathExpression;

		const doIncludejobIndexInFolder = inputPathProvider.isIncludingJobIndexInInputFolder;
		if (doIncludejobIndexInFolder) {
			newInputPath += "#" + inputPathProvider.gobId;
		}
		return newInputPath;
	}

	includeSubFolder(inputPathExpression) {

		let newInputPath = inputPathExpression;

		const isIncludingDateInSubFolder = inputPathProvider.isIncludingDateInInputSubFolder;
        const isIncludingJobIndexInSubFolder = inputPathProvider.isIncludingJobIndexInInputSubFolder();
        const doIncludeSubFolder = isIncludingDateInSubFolder || isIncludingJobIndexInSubFolder;

		if (doIncludeSubFolder) {
			newInputPath += "/";
		}

		if (isIncludingDateInSubFolder) {
			newInputPath += Utils.getDateString();
		}

		if (isIncludingJobIndexInSubFolder) {
			newInputPath += "#" + inputPathProvider.getJobId();
		}
		return newInputPath;
	}

	includeFileNameAndExtension(fileNameWithoutExtension, pathPostFix, inputPathExpression) {

		let newInputPath = inputPathExpression;

		newInputPath += "/";

		newInputPath += fileNameWithoutExtension; //is empty for directories

		if (inputPathProvider.isIncludingDateInFile) {
			newInputPath += "_" + Utils.getDateString();
		}

		if (inputPathProvider.isIncludingJobIndexInInputFile) {
			newInputPath += "#" + inputPathProvider.getJobId();
		}
		newInputPath += pathPostFix; //is empty for directories
		return newInputPath;
	}
}
