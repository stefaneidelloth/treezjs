

/**
 * Represents a container for several parts of code. The container might be altered in an iterative process while it is
 * passed around. After finishing that process the different parts of the code can be put together.
 */
export default class CodeContainer {
	
	constructor() {
		this.headerLines = [];
		this.importLines = new Set();
		this.openingLines = [];
		this.bulkLines = [];
		this.closingLines = [];	
		this.indent = '    ';	
	}	
	
	buildCode() {
		var headerCode = this.__joinLines(this.headerLines);
		var importCode = this.__joinLines(this.importLines);
		var openingCode = this.__joinLines(this.openingLines);
		var bulkCode = this.__joinLines(this.bulkLines);
		var closingCode = this.__joinLines(this.closingLines);

		var code = headerCode + '\n' + importCode + '\n' + openingCode + bulkCode + closingCode;
		return code;
	}
	
	__joinLines(lines) {
		if(lines.join){
			return lines.join('\n');
		} else {
			return Array.from(lines).join('\n');
		}				
	}

	extend(codeContainer) {
		if(!codeContainer){
			throw new Error('Invalid code container.');
		}
				
		this.headerLines = this.headerLines.concat(codeContainer.headerLines);		
		this.importLines = new Set([...this.importLines, ...codeContainer.importLines]);		
		this.openingLines = this.openingLines.concat(codeContainer.openingLines);		
		this.bulkLines = this.bulkLines.concat(codeContainer.bulkLines);		
		this.closingLines = this.closingLines.concat(codeContainer.closingLines);
	}

	extendHeader(header) {
		if (this.__isBlank(header)) {
			throw new Error('Extended code must not be empty.');
		}
		this.headerLines.push(header);
	}

	extendHeaderWithEmptyLine() {
		this.headerLines.push('');
	}

	extendImports(importString) {
		if (this.__isBlank(importString)) {
			throw new Error('Extended code must not be empty.');
		}
		this.importLines.add(importString);
	}	

	extendImportWithEmptyLine() {
		this.importLines.push('');
	}

	extendOpening(newOpeningLine) {
		if (this.__isBlank(newOpeningLine)) {
			throw new Error('Added code must not be empty.');
		}
		this.openingLines.push(newOpeningLine);
	}

	extendOpeningWithEmptyLine() {
		this.openingLines.push('');
	}

	extendBulk(newbulkLine) {
		if (this.__isBlank(newbulkLine)) {
			throw new Error('Added code must not be empty.');
		}
		this.bulkLines.push(newbulkLine);
	}

	extendBulkWithEmptyLine() {
		this.bulkLines.push('');
	}

	extendClosing(newClosingLine) {
		if (this.__isBlank(newClosingLine)) {
			throw new Error('Added code must not be empty.');
		}
		this.closingLines.push(newClosingLine);
	}

	extendClosingWithEmptyLine() {
		this.closingLines.push('');
	}

	replaceInBulk(valueToReplace, newValue) {
		for (var index = 0; index < this.bulkLines.length; index++) {
			var currentLine = this.bulkLines[index];
			var containsValueToReplace = currentLine.includes(valueToReplace);
			if (containsValueToReplace) {
				var newLine = currentLine.replace(valueToReplace, newValue);
				this.bulkLines[index] = newLine;
			}
		}
	}

	makeBulkEndWithSingleEmptyLine() {

		//remove empty lines at the end of the bulk
		for (var index = this.bulkLines.length - 1; index >= 0; index--) {
			var bulkLine = this.bulkLines[index];
			var isEmpty = this.__isBlank(bulkLine); 
			if (isEmpty) {
				this.bulkLines.splice(index,1);
			} else {
				break;
			}
		}
		
		this.extendBulkWithEmptyLine();
	}
	
	__isBlank(text){
		return text.length < 1;
	}

	get hasEmptyBulk() {
		if (this.bulkLines.length < 1) {
			return true;
		} else {
			for (var bulkLine of this.bulkLines) {			
				if (!this.__isBlank(bulkLine)) {
					return false;
				}
			}
		}
		return true;
	}

	get isEmpty() {
		var startIsEmpty = this.headerLines.length < 1 && this.importLines.length < 1  && this.openingLines.length < 1;
		var isEmpty = startIsEmpty && this.hasEmptyBulk && this.closingLines.length < 1;
		return isEmpty;
	}	

}
