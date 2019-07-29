import TreezStringList from './treezStringList.js';

export default class TreezDirectoryPathList extends TreezStringList {

    constructor(){
        super();       
    }  

    __createRow(value){
    	var row = document.createElement('tr');
    	row.className = 'treez-list-tr';
    	this.__tableBody.appendChild(row);                	
    	
    	row.onclick = (event)=>this.__rowClicked(event);
    	
    	var cell = document.createElement('td');
    	cell.className = 'treez-list-td';
    	row.appendChild(cell);    	
    	
    	var filePath = document.createElement('treez-directory-path');    
    	filePath.onchange = (event) => this.__directoryPathChanged(event); 	                                           
		cell.appendChild(filePath);		
		if(value){
			filePath.value = value;
    	}
    	
    	row.tabIndex=row.rowIndex;    	
    	cell.onblur = (event)=>this.__cellLostFocus(event); 
    }

     __focusCell(rowIndex){
    	var row = this.__tableBody.children[rowIndex];
    	var cell = row.children[0];    	
    	cell.focus();
    }  
    
    __directoryPathChanged(event){
    	 var directoryPath = event.srcElement;
		if(directoryPath instanceof HTMLInputElement){
        	directoryPath = directoryPath.parentElement.parentElement.parentElement;  	
        }
        
    	let cell = directoryPath.parentElement;
    	let newValue = directoryPath.value;
    	let rowIndex = cell.parentElement.rowIndex;  

    	var valueArray = this.values;                	
    	valueArray[rowIndex] = newValue;
    	this.value = valueArray;
    	
    	this.__focusCell(rowIndex);
    }
         
    getCellValue(cell){
    	return cell.children[0].value;
    }
    
    setCellValue(cell, value){
    	cell.children[0].value = value;
    }
    	                           
}

window.customElements.define('treez-directory-path-list', TreezDirectoryPathList);