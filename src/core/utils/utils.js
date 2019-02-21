export default class Utils {

    static firstToUpperCase(text){
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    static extractParentFolder(path) {
        const fileName = Utils.extractFileName(path);
        const endIndex = path.length - fileName.length - 1;
        const parentPath = path.substring(0, endIndex);
        return parentPath;
    }

    static extractFileName(pathWithoutExtension) {
        const path = pathWithoutExtension.replace("\\", "/");
        const subStrings = path.split("/");
        const fileName = subStrings[subStrings.length - 1];
        return fileName;
    }

    /**
     * Includes a postFix in front of the last point in a file name
     */
    static includeNumberInFileName(fileName, postFix) {
        const subStrings = fileName.split("\\.");
        let newFileName = subStrings[0];
        if (subStrings.length > 2) {
            for (let index = 1; index < subStrings.length - 2; index++) {
                newFileName += "." + subStrings[index];
            }
        }
        newFileName += postFix;
        newFileName += "." + subStrings[subStrings.length - 1];
        return newFileName;
    }

    /**
     * Returns the current date & time as string
     */
    static getDateString() {
        const now = new Date();
        return now.toISOString().substring(0,19).replace('T','_');
    }

    /**
     * Returns true if the given file path could represent a file (last subString contains a point)
     */
    static isFilePath(outputPath) {
        if(outputPath){
            const outputPathString = outputPath.replace("\\", "/");
            const subStrings = outputPathString.split("/");
            const lastSubString = subStrings[subStrings.length - 1];
            return lastSubString.indexOf(".") > -1;
        } else {
            throw Error ('Output path must not be null.');
        }
    }

//#end region
}