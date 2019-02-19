import Utils from './../../../core/utils/utils.js';

export default class OutputPathModifier {

	constructor(executable) {
		this.executable = executable;
	}

	/**
	 * Returns the output path, optionally modified by data and job index
	 */
	getModifiedOutputPath(outputPath) {

		const outputPathString = outputPath.replace("\\", "/");

		//split path with point to determine file extension if one exists
        const subStrings = outputPathString.split("\\.");

        let pathBase = subStrings[0];
        let fileNameWithoutExtension = "";
        let pathPostFix = "";
        const hasFileExtension = subStrings.length > 1;
		if (hasFileExtension) {
			pathPostFix = "." + subStrings[1];
			fileNameWithoutExtension = Utils.extractFileName(pathBase);
			pathBase = Utils.extractParentFolder(pathBase);
		}

		let outputPathExpression = pathBase;

		outputPathExpression = this.includeDateInFolder(outputPathExpression);

		outputPathExpression = this.includeJobIndexInFolder(outputPathExpression);

		outputPathExpression = this.includeSubFolder(outputPathExpression);

		if (hasFileExtension) {
			//append file name and extension
			outputPathExpression = this.includeFileNameAndExtension(fileNameWithoutExtension, pathPostFix,
					outputPathExpression);
		}

		return outputPathExpression;
	}

	includeDateInFolder(outputPathExpression) {
		let newOutputPath = outputPathExpression;
		if (executable.isIncludingDateInOutputFolder) {
			newOutputPath += "_" + Utils.getDateString();
		}
		return newOutputPath;
	}

	includeJobIndexInFolder(outputPathExpression) {
		let newOutputPath = outputPathExpression;
		if (executable.isIncludingJobIndexInOutputFolder) {
			newOutputPath += "#" + executable.getJobId();
		}
		return newOutputPath;
	}

	includeSubFolder(outputPathExpression) {

		let newOutputPath = outputPathExpression;

		const isIncludingDateInSubFolder = executable.isIncludingDateInOutputSubFolder;
        const isIncludingJobIndexInSubFolder = executable.isIncludingJobIndexInOutputSubFolder;
        const doIncludeSubFolder = isIncludingDateInSubFolder || isIncludingJobIndexInSubFolder;

		if (doIncludeSubFolder) {
			newOutputPath += "/";
		}

		if (isIncludingDateInSubFolder) {
			newOutputPath += Utils.getDateString();
		}

		if (isIncludingJobIndexInSubFolder) {
			newOutputPath += "#" + executable.gobId;
		}
		return newOutputPath;
	}

	includeFileNameAndExtension(fileNameWithoutExtension, pathPostFix, outputPathExpression) {

		let newOutputPath = outputPathExpression;

		newOutputPath += "/";

		newOutputPath += fileNameWithoutExtension; //is empty for directories

		if (executable.isIncludingDateInOutputFile) {
			newOutputPath += "_" + Utils.getDateString();
		}

		if (executable.isIncludingJobIndexInOutputFile) {
			newOutputPath += "#" + executable.gobId;
		}
		newOutputPath += pathPostFix; //is empty for directories
		return newOutputPath;
	}



}
