import LabeledTreezElement from './../labeledTreezElement.js';

export default class TreezStringList extends LabeledTreezElement {

    constructor(){
        super();
		this.__container = undefined;
        this.__label = undefined; 
        this.__table = undefined; 
        this.__tableBody = undefined;
        this.__selectedRowIndex = undefined;
        this.__lastSelectedRowIndex = undefined;
		this.__addButton = undefined;
		this.__deleteButton = undefined;
		this.__upButton = undefined;
		this.__downButton = undefined;
    } 
    
    static get observedAttributes() {
		return LabeledTreezElement.observedAttributes.concat(['label']);                    
    }

    connectedCallback() {  
        if(!this.__table){
			this.__createContainer();
			if(this.label){
        		this.__createLabelElement();
        	} 					
			this.__createButtons();
			this.__createTable();
        }

        this.update();
    } 
	

	updateElements(){
    	if(this.__table){
    		this.__recreateTableRows();
    	} 		    
    }

	updateContentWidth(width){
		this.updateWidthFor(this.__container, width);
		
	}

	disableElements(booleanValue){
    	if(booleanValue === undefined){
    		throw Error('This method expects a boolean argument');
		}
    	if(this.__addButton){
    		this.__addButton.disabled = booleanValue;
			this.__deleteButton.disabled = booleanValue;
			this.__upButton.disabled = booleanValue;
			this.__downButton.disabled = booleanValue;
		}

    	if(this.__table){
    		this.__disableTable(booleanValue);
		}
	}

	hideElements(booleanValue){
		if(booleanValue === undefined){
			throw Error('This method expects a boolean argument');
		}
		if(this.__container){
			LabeledTreezElement.hide(this.__container, booleanValue);
		}
	}

	convertFromStringValue(arrayString){
		if(arrayString === undefined){
			throw new Error('Array string must not be undefined!');
		}
		return eval(arrayString);
	}

	convertToStringValue(stringArray){
		if(stringArray.length < 1){
			return "[]";
		} else {
			return "['" + stringArray.join("','") + "']";
		}
	}

	//might be overridden by inheriting class; do not make static
	getCellValue(cell){
		return cell.innerText;
	}

	//might be overridden by inheriting class; do not make static
	setCellValue(cell, value){
		cell.innerText = value;
	}

	//might be overridden by inheriting class; do not make static
	styleCell(cell, value){
		cell.style.border ='1px solid lightgrey';
		cell.style.backgroundColor = 'white';
		cell.style.padding= '0px';
	}

	__createContainer(){
    	let container = document.createElement('div');  
		container.setAttribute("class","treez-list-container");
		this.appendChild(container);
		this.__container = container;
    }
    
    __createLabelElement(){
    	let labelElement = document.createElement('label');
		this.__label = labelElement;
		labelElement.className = 'treez-list-label'
		labelElement.innerText = this.label;
		this.__container.appendChild(labelElement);
    }
    
    __createTable(){
    	let table = document.createElement('table'); 
		table.className = 'treez-list-table';
		this.__table = table;
		this.__container.appendChild(table);
		this.__createTableBody();
		this.__recreateTableRows();
    }

    __createTableBody(){
		let tableBody = document.createElement('tbody')
		this.__tableBody = tableBody;
		this.__table.appendChild(tableBody);
	}

    __disableTable(booleanValue){
		if(booleanValue === undefined){
			throw Error('This method expects a boolean argument');
		}
    	for(let row of this.__table.rows){
    		for(let cell of row.cells){
    			cell.contentEditable = !booleanValue;
			}
		}
	}

    __recreateTableRows(){                	
    	this.__deleteRows(); 
    	if(this.values){
    		this.values.forEach((value)=>{
				this.__createRow(value);
			});
    	}
    } 
    
    __cellChanged(event){
    	let cell = event.currentTarget;
    	let newValue = cell.innerText;
    	let rowIndex = cell.parentElement.rowIndex;  

    	let cursorPosition = window.getSelection().getRangeAt(0).startOffset; 	

    	let valueArray = this.values; //here we only consider tables with a single column; values is a one-dimensional array
    	valueArray[rowIndex] = newValue;
    	this.value = valueArray;
    	
    	this.__focusCell(rowIndex, cursorPosition);
    }

	__cellLostFocus(event){
		this.__selectedRowIndex=undefined;
	}

	__focusCell(rowIndex, cursorPosition){
    	let row = this.__tableBody.children[rowIndex];
    	let cell = row.children[0];    	
    	cell.focus();    	
		let selection = window.getSelection();
		selection.collapse(cell.lastChild, cursorPosition);
    }
    
    __addRow(){
    	if(this.__lastSelectedRowIndex === undefined){
    		this.__appendNewRow();
    	} else {
    		this.__duplicateRow(this.__lastSelectedRowIndex);
    	}     	               	
    }

    __appendNewRow(){
    	let valueArray = this.values;
    	valueArray.push(this.__defaultValue);
    	this.value = valueArray;    	
    	
    	this.__recreateTableRows();
    	this.__selectRow(this.values.length-1);
    }

    __createButtons(){
    	let buttonContainer = document.createElement('div');
		this.__container.appendChild(buttonContainer);
		
		let addButton = this.__createButton(buttonContainer, 'add', 'Add entry');
		addButton.onclick = ()=>this.__addRow();
		this.__addButton = addButton;
		
		let deleteButton = this.__createButton(buttonContainer, 'delete', 'Delete entry');
		deleteButton.onclick = ()=>this.__deleteRow();
		this.__deleteButton = deleteButton;
		
		let upButton = this.__createButton(buttonContainer, 'up','Move entry up');
		upButton.onclick = ()=>this.__moveCurrentRowUp();
		this.__upButton = upButton;
		
		let downButton = this.__createButton(buttonContainer, 'down','Move entry down');
		downButton.onclick = ()=>this.__moveCurrentRowDown();
		this.__downButton = downButton;
    } 
    
    __createButton(container, name, title){
    	let button = document.createElement('button');
		container.appendChild(button);
		
		button.className = 'treez-list-button';
		button.title = title;
		
		let image = document.createElement('img');
		button.appendChild(image);
		image.src = this.__urlPrefix + '/icons/' + name + '.png';
		
		return button;
    }

    __createRow(value){
    	let row = document.createElement('tr');
    	row.className = 'treez-list-tr'
		row.tabIndex=0;
    	this.__tableBody.appendChild(row);                	
    	
    	row.onclick = (event)=>this.__rowClicked(event);
    	
    	let cell = document.createElement('td');
    	cell.className = 'treez-list-td'
    	row.appendChild(cell);
    	
    	cell.contentEditable = true;

    	cell.onkeyup = (event)=>this.__cellChanged(event);
    	cell.onblur = (event)=>this.__cellLostFocus(event);
		
    	                	
    	if(value){
			this.setCellValue(cell, value);
    	}
    	this.styleCell(cell, value);
    }
    
	__deleteRow(){
		
		if(!this.__rowCanBeDeleted){
			return;
		} 					
		
		let indexOfRowToDelete = this.__lastSelectedRowIndex; 					
		if(indexOfRowToDelete === undefined){						
			indexOfRowToDelete=0; 						
		}
		
		let valueArray = this.values
		valueArray.splice(indexOfRowToDelete,1);
		this.value = valueArray;	

		this.__recreateTableRows(); 					 

		this.__updateSelectedRowIndexAfterDeletion(indexOfRowToDelete);    
		this.dispatchChangeEvent();        	
    }

     __deleteRows(){
    	let body = this.__tableBody; 
    	
		while (body.hasChildNodes()) {
			body.removeChild(body.lastChild);
		}
    	 		
    }

    __duplicateRow(index){
    	let oldRow = this.__tableBody.children[index];
    	let oldValue = this.getCellValue(oldRow.children[0]);

    	let valueArray = this.values;
    	valueArray.splice(index,0, oldValue);
    	this.value = valueArray;
    	
    	this.__recreateTableRows();
    	this.__selectRow(index+1);
    	this.dispatchChangeEvent(); 
    }   
	
	__moveCurrentRowUp(){
    	let index = this.__lastSelectedRowIndex;
    	if(index){
    		this.__moveRowUp(index);
    	} else {
    		this.__moveRowUp(0);
    	}
    }               
	
	__moveCurrentRowDown(){
    	let index = this.__lastSelectedRowIndex;
    	if(index){
    		this.__moveRowDown(index);
    	} else {
    		this.__moveRowDown(0);
    	}
    }

    __moveRowUp(index){
    	let valueArray = this.values;
    	if(valueArray.length<2){
    		return;
    	}

    	let valueToMove = valueArray[index];

    	valueArray.splice(index,1);

        let newIndex= index-1;
        if(newIndex < 0){
        	newIndex = valueArray.length;
			valueArray.splice(newIndex,0,valueToMove);
			let otherValueToMove = valueArray[newIndex-1];
			valueArray.splice(newIndex-1,1);
			valueArray.splice(0,0,otherValueToMove);
        } else {
			valueArray.splice(newIndex,0,valueToMove);
		}


		this.value = valueArray;  

		this.__recreateTableRows(); 		                 
      
        this.__selectRow(newIndex);
        this.dispatchChangeEvent(); 
    }

    __moveRowDown(index){
    	let valueArray = this.values;
    	if(valueArray.length<2){
    		return;
    	}

    	let valueToMove = valueArray[index];

    	valueArray.splice(index,1);

        let newIndex= index+1;
        if(newIndex > valueArray.length){
        	newIndex = 0;
            valueArray.splice(newIndex,0,valueToMove);
            let otherValueToMove = valueArray[1];
            valueArray.splice(1,1);
            valueArray.splice(valueArray.length,0,otherValueToMove);
        } else {
            valueArray.splice(newIndex,0,valueToMove);
        }

		this.value = valueArray;

		this.__recreateTableRows(); 
        this.__selectRow(newIndex);
        this.dispatchChangeEvent(); 
    }    


	__rowClicked(event){
        let rowIndex = event.currentTarget.rowIndex;            	 
    	this.__selectedRowIndex = rowIndex;
    	this.__lastSelectedRowIndex = rowIndex;                	
    } 

    __selectRow(index){
		this.__selectedRowIndex = index;
		this.__lastSelectedRowIndex = index;

		let rowToSelect = this.__tableBody.children[index]; 					
		let cellToSelect = rowToSelect.children[0];
		cellToSelect.focus(); 					
	}

	__updateSelectedRowIndexAfterDeletion(indexOfDeletedRow){
		if(this.values.length > 0){
			if(indexOfDeletedRow > this.values.length-1) {
				let lastIndex = this.values.length - 1;
				this.__selectRow(lastIndex);
			} else {
				this.__selectRow(indexOfDeletedRow);
			}

		} else {
			this.__selectedRowIndex = undefined;
		}
	}

	get __urlPrefix(){
    	return window.treezConfig
			?window.treezConfig.home
			:'';
	}
	
	get label() {
	  return this.getAttribute('label');
	}

	set label(newValue) {
	  this.setAttribute('label', newValue);	
	}
	
	get values(){
		if(!this.value){
			return [];
		}
		return this.value;
	}

	get __rowCanBeDeleted(){
		return this.values.length > 0;
	}

	get __defaultValue(){
		return '';
	}
                           
}

window.customElements.define('treez-string-list', TreezStringList);