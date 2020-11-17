export default class Utils {

	static uniqueId(){
		var randomNumber = new Date().getMilliseconds()*Math.random();
        return ('' + randomNumber).replace('.','');
	}

    static firstToUpperCase(text){
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    static firstToLowerCase(text){
        return text.charAt(0).toLowerCase() + text.slice(1);
    }

    static isString(value){
    	return typeof value === 'string' || value instanceof String;
    }

    static numberToLetters(number) {
		let letters = ''
		while (number >= 0) {
			letters = 'abcdefghijklmnopqrstuvwxyz'[number % 26] + letters
			number = Math.floor(number / 26) - 1
		}
		return letters
	}

    static extractParentFolder(path) {
        const fileName = Utils.extractFileName(path);
        const endIndex = path.length - fileName.length - 1;
        const parentPath = path.substring(0, endIndex);
        return parentPath;
    }

    static extractFileName(pathWithoutExtension) {
        const path = pathWithoutExtension.replace(/\\/g, '/');
        const subStrings = path.split('/');
        const fileName = subStrings[subStrings.length - 1];
        return fileName;
    }

    static removeFileExtension(fileName){
    	var parts = fileName.split('.');
    	parts.pop();
    	return parts.join('.');
    }

    static convertNameThatMightIncludeSpacesToCamelCase(name){
		var parts = name.trim().split(' ');
		parts[0] = Utils.firstToLowerCase(parts[0]);
		for(var index = 1; index < parts.length; index++){
			parts[index] = Utils.firstToUpperCase(parts[index]);
		}
		return parts.join('');
	}	

	static multiply(a,b){
		return parseFloat((a*b).toFixed(12)); //avoids issues with decimal places, otherwise for example 1.1 * 100 = 110.00000000000001
	}

	static divide(a,b){
		return parseFloat((a/b).toFixed(12)); //avoids issues with decimal places
	}

    /**
     * Includes a postFix in front of the last point in a file name
     */
    static includeNumberInFileName(fileName, postFix) {
        const subStrings = fileName.split('\\.');
        let newFileName = subStrings[0];
        if (subStrings.length > 2) {
            for (let index = 1; index < subStrings.length - 2; index++) {
                newFileName += '.' + subStrings[index];
            }
        }
        newFileName += postFix;
        newFileName += '.' + subStrings[subStrings.length - 1];
        return newFileName;
    }

    /**
     * Returns the current date & time as string
     */
    static getDateString() {
        const now = new Date();
        return now.toISOString().substring(0,19).replace('T','_');
    }


    static isFilePath(outputPath) {
        if(outputPath){
            const outputPathString = outputPath.replace(/\\/g, '/');
            const subStrings = outputPathString.split('/');
            const lastSubString = subStrings[subStrings.length - 1];
            return lastSubString.indexOf('.') > -1;
        } else {
            throw Error ('Output path must not be null.');
        }
    }


}