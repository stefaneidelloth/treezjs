import TreezElement from './../treezElement.js';

export default class TreezStringList extends TreezElement {

    constructor(){
        super();                     
        this.__labelElement=undefined; 
        this.__table=undefined; 
        this.__tableBody=undefined;
        this.__selectedRowIndex=undefined;
        this.__lastSelectedRowIndex=undefined;       
    } 
    
    static get observedAttributes() {
		return TreezElement.observedAttributes.concat(['label']);                    
    }

    connectedCallback() {  
        if(!this.__table){  
			var container = this.__createContainer();			
			if(this.label){
        		this.__createLabelElement(container);
        	} 					
			this.__createButtons(container);			
			this.__createTable(container);      		
        }
    }    

    updateElements(stringArray){ 
    	if(this.__table){
    		this.__recreateTableRows();
    	} 		    
    } 
    
    __createContainer(){
    	var container = document.createElement('div');  
		container.setAttribute("class","treez-string-list-container");
		this.appendChild(container);
		return container;
    }
    
    __createLabelElement(container){
    	var labelElement = document.createElement('label');
		this.__labelElement = labelElement;
		labelElement.className = 'treez-list-label'
		labelElement.innerText = this.label;                                            
		container.appendChild(labelElement); 
    }
    
    __createTable(container){
    	var table = document.createElement('table'); 
		table.className = 'treez-list-table';
		this.__table = table;		
		container.appendChild(table); 

		var tableBody = document.createElement('tbody')
		this.__tableBody = tableBody;
		table.appendChild(tableBody);
		
		this.__recreateTableRows();
    }

    __recreateTableRows(){                	
    	this.__deleteRows(); 
    	this.values.forEach((value)=>{
    		this.__createRow(value);
    	});  
    } 
    
    __cellChanged(event){
    	let cell = event.currentTarget;
    	let newValue = cell.innerText;
    	let rowIndex = cell.parentElement.rowIndex;  

    	var cursorPosition = window.getSelection().getRangeAt(0).startOffset; 	

    	var valueArray = this.values;                	
    	valueArray[rowIndex] = newValue;
    	this.value = valueArray;
    	
    	this.__focusCell(rowIndex, cursorPosition);
    }
    
    __focusCell(rowIndex, cursorPosition){
    	var row = this.__tableBody.children[rowIndex];
    	var cell = row.children[0];    	
    	cell.focus();    	
		var selection = window.getSelection();
		selection.collapse(cell.lastChild, cursorPosition);
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
    
    __addRow(){
    	if(this.__lastSelectedRowIndex === undefined){
    		this.__appendNewRow();
    	} else {
    		this.__duplicateRow(this.__lastSelectedRowIndex);
    	}     	               	
    }

    __appendNewRow(){
    	var valueArray = this.values;
    	valueArray.push(this.__defaultValue);
    	this.value = valueArray;    	
    	
    	this.__recreateTableRows();
    	this.__selectRow(this.values.length-1);
    } 

    get __defaultValue(){
    	return '';
    }   

     __cellLostFocus(event){ 
    	this.__selectedRowIndex=undefined;
    } 

    __createButtons(container){
    	let buttonContainer = document.createElement('div');
		container.appendChild(buttonContainer);				
		
		let addButton = this.__createButton(buttonContainer, 'add', 'Add entry');
		addButton.onclick = ()=>this.__addRow();	
		
		let deleteButton = this.__createButton(buttonContainer, 'delete', 'Delete entry');
		deleteButton.onclick = ()=>this.__deleteRow();
		
		let upButton = this.__createButton(buttonContainer, 'up','Move entry up');
		upButton.onclick = ()=>this.__moveCurrentRowUp();	
		
		let downButton = this.__createButton(buttonContainer, 'down','Move entry down');
		downButton.onclick = ()=>this.__moveCurrentRowDown();					                   	
    } 
    
    __createButton(container, name, title){
    	let button = document.createElement('button');
		container.appendChild(button);
		
		button.className = 'treez-list-button';
		button.title = title;
		
		var urlPrefix = window.treezConfig
			?window.treezConfig.home
			:'';
		
		let image = document.createElement('img');
		button.appendChild(image);
		image.src = urlPrefix + '/icons/' + name + '.png';					
		
		return button;
    }

    __createRow(value){
    	var row = document.createElement('tr');
    	row.className = 'treez-list-tr'
    	this.__tableBody.appendChild(row);                	
    	
    	row.onclick = (event)=>this.__rowClicked(event);
    	
    	var cell = document.createElement('td');
    	cell.className = 'treez-list-td'
    	row.appendChild(cell);
    	
    	cell.contentEditable = true;
    	row.tabIndex=row.rowIndex;
    	cell.onkeyup = (event)=>this.__cellChanged(event);
    	cell.onblur = (event)=>this.__cellLostFocus(event);                	
    	                	
    	if(value){
    		this.setCellValue(cell, value);    		
    	}
    }
    
    getCellValue(cell){
    	return cell.innerText;
    }
    
    setCellValue(cell, value){
    	cell.innerText = value;	
    }
    
	__deleteRow(){
		
		if(!this.__rowCanBeDeleted()){
			return;
		} 					
		
		let indexOfRowToDelete = this.__lastSelectedRowIndex; 					
		if(indexOfRowToDelete === undefined){						
			indexOfRowToDelete=0; 						
		}
		
		var valueArray = this.values
		valueArray.splice(indexOfRowToDelete,1);
		this.value = valueArray;	

		this.__recreateTableRows(); 					 

		this.__updateSelectedRowIndexAfterDeletion(indexOfRowToDelete);    
		this.dispatchChangeEvent();        	
    }

     __deleteRows(){
    	var body = this.__tableBody; 
    	
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
    	var valueArray = this.values;
    	if(valueArray.length<2){
    		return;
    	}

    	var valueToMove = valueArray[index];

    	valueArray.splice(index,1);

        var newIndex= index-1;
        if(newIndex < 0){
        	newIndex = valueArray.length;
        }
		valueArray.splice(newIndex,0,valueToMove);

		this.value = valueArray;  

		this.__recreateTableRows(); 		                 
      
        this.__selectRow(newIndex);
        this.dispatchChangeEvent(); 
    }

    __moveRowDown(index){
    	var valueArray = this.values;
    	if(valueArray.length<2){
    		return;
    	}

    	var valueToMove = valueArray[index];

    	valueArray.splice(index,1);

        var newIndex= index+1;
        if(newIndex > valueArray.length){
        	newIndex = 0;
        }
		valueArray.splice(newIndex,0,valueToMove);  
		this.value = valueArray;

		this.__recreateTableRows(); 
        this.__selectRow(newIndex);
        this.dispatchChangeEvent(); 
    }    

    __rowCanBeDeleted(){
    	return this.values.length > 0; 					
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

	__updateSelectedRowIndexAfterDeletion(oldIndex){ 					
		if(this.values.length > 0){
			let newIndex = oldIndex - 1;
			if(newIndex < 0){
				this.__selectRow(0);	 						
			} else {
				this.__selectRow(newIndex);	 						
			}
		} else {
			this.__selectedRowIndex = undefined;
		}
	} 
	
	attributeChangedCallback(attr, oldValue, newValue) {
    	super.attributeChangedCallback(attr, oldValue, newValue) 
        if(attr==='label'){
        	if(this.labelElement){
        		 this.labelElement.innerText= newValue;   
        	}                                           
        } 					
		
    } 	
	
	get label() {
	  return this.getAttribute('label');
	}

	set label(newValue) {
	  this.setAttribute('label', newValue);	
	}
	
	get values(){
		return this.value;
	}
                           
}

window.customElements.define('treez-string-list', TreezStringList);