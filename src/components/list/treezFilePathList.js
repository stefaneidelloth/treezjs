import TreezStringList from './treezStringList.js';
import TreezFilePath from './../file/treezFilePath.js';

export default class TreezFilePathList extends TreezStringList {

    constructor(){
        super();
		this.__pathMapProvider = undefined;
    }

	getCellValue(cell){
		return cell.children[0].value;
	}

	setCellValue(cell, value){
		cell.children[0].value = value;
	}

    __createRow(value){
    	var row = document.createElement('tr');
    	row.className = 'treez-list-tr';
    	this.__tableBody.appendChild(row);                	
    	
    	row.onclick = (event)=>this.__rowClicked(event);
    	
    	var cell = document.createElement('td');
    	cell.className = 'treez-list-td';
    	row.appendChild(cell);    	
    	
    	var path = document.createElement('treez-file-path');
    	path.pathMapProvider = this.__pathMapProvider;
		path.onchange = (event) => this.__filePathChanged(event);
		cell.appendChild(path);
		if(value){
			path.value = value;
    	}
    	
    	row.tabIndex=row.rowIndex;    	
    	cell.onblur = (event)=>this.__cellLostFocus(event); 
    }
    
    __filePathChanged(event){  
        var filePath = event.srcElement;
		if(filePath instanceof HTMLInputElement){
        	filePath = filePath.parentElement.parentElement.parentElement;  	
        }
        
    	var cell = filePath.parentElement;
    	let newValue = filePath.value;
    	let rowIndex = cell.parentElement.rowIndex;  

    	var valueArray = this.values;                	
    	valueArray[rowIndex] = newValue;
    	this.value = valueArray;
    	
    	this.__focusCell(rowIndex);
    }

	__focusCell(rowIndex){
		var row = this.__tableBody.children[rowIndex];
		var cell = row.children[0];
		cell.focus();
	}

	set pathMapProvider(provider){
		this.__pathMapProvider = provider;
		this.__recreateTableRows();
	}
}

window.customElements.define('treez-file-path-list', TreezFilePathList);