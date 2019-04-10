import TreezElement from './../treezElement.js';

export default class TreezStringList extends TreezElement {

	static get observedAttributes() {
		return TreezElement.observedAttributes.concat(['label']);                    
    }

    get label() {
	  return this.getAttribute('label');
	}

	set label(newValue) {
	  this.setAttribute('label', newValue);	
	}  
	
	get value(){
		return this.values.join(',');
	}

	set value(newValue) {

		if(newValue === undefined){
			throw new Error("Value for color must not be undefined!");
		}
		
		this.values=newValue.split(',');
		this.__recreateTableRows();	
	}  			

    constructor(){
        super();                     
        this.labelElement=undefined; 
        this.table=undefined; 
        this.tableBody=undefined;
        this.selectedRowIndex=undefined;
        this.lastSelectedRowIndex=undefined;
        this.values=[];
    }  

    attributeChangedCallback(attr, oldValue, newValue) {
    	super.attributeChangedCallback(attr, oldValue, newValue) 
        if(attr==='label'){
        	if(this.labelElement){
        		 this.labelElement.innerText= newValue;   
        	}                                           
        } 					
		
    }  

     connectedCallback() {
    	var self = this;

        if(!self.table){   

			var container = document.createElement('div');  
			container.setAttribute("class","treez-string-list-container");
			self.appendChild(container);      

			var labelElement = document.createElement('label');
			this.labelElement = labelElement;
			labelElement.className = 'treez-list-label'
			labelElement.innerText = self.label;                                            
			container.appendChild(labelElement); 
			
			this.__createButtons(container);					

			var table = document.createElement('table'); 
			table.className = 'treez-list-table';
			self.table = table;		
			container.appendChild(table); 

			var tableBody = document.createElement('tbody')
			this.tableBody = tableBody;
			table.appendChild(tableBody);
			
			this.__recreateTableRows();						                                       
                                                  		
        }
    }  		

    updateElements(newValue){   
    	this.values = newValue.split(',');
    	if(this.table){
    		this.__recreateTableRows();
    	} 		    
    }                   
                
    
    __addRow(){
    	if(this.lastSelectedRowIndex===undefined){
    		this.__appendNewRow();
    	} else {
    		this.__duplicateRow(this.lastSelectedRowIndex);
    	} 
    	               	
    }

    __appendNewRow(){
    	this.values.push(""); 
    	this.__recreateTableRows();
    	this.__selectRow(this.values.length-1);
    }
    
    __cellChanged(event){
    	let cell = event.currentTarget;
    	let newValue = cell.innerText;
    	let rowIndex = cell.parentElement.rowIndex;                	
    	this.values[rowIndex]=newValue;                	 
    }

     __cellLostFocus(event){ 
    	this.selectedRowIndex=undefined;
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
		
		let image = document.createElement('img');
		button.appendChild(image);
		image.src = name + '.png';					
		
		return button;
    }

    __createRow(value){
    	var row = document.createElement('tr');
    	row.className = 'treez-list-tr'
    	this.tableBody.appendChild(row);                	
    	
    	row.onclick = (event)=>this.__rowClicked(event);
    	
    	var cell = document.createElement('td');
    	cell.className = 'treez-list-td'
    	row.appendChild(cell);
    	
    	cell.contentEditable=true;
    	row.tabIndex=row.rowIndex;
    	cell.onkeyup = (event)=>this.__cellChanged(event);
    	cell.onblur = (event)=>this.__cellLostFocus(event);                	
    	                	
    	if(value){
    		cell.innerText=value;
    	}
    }
    
	__deleteRow(){
		
		if(!this.__rowCanBeDeleted()){
			return;
		} 					
		
		let indexOfRowToDelete = this.lastSelectedRowIndex; 					
		if(indexOfRowToDelete === undefined){						
			indexOfRowToDelete=0; 						
		}
		
		this.values.splice(indexOfRowToDelete,1);	

		this.__recreateTableRows(); 					 

		this.__updateSelectedRowIndexAfterDeletion(indexOfRowToDelete);           	
    }

     __deleteRows(){
    	var body = this.tableBody;  
		while (body.hasChildNodes()) {
			body.removeChild(body.lastChild);
		}
    }

    __duplicateRow(index){
    	let oldRow = this.tableBody.children[index];
    	let oldValue = oldRow.children[0].innerText;

    	let currentValues = this.values;
    	currentValues.splice(index,0, oldValue);
    	
    	this.__recreateTableRows();
    	this.__selectRow(index+1);
    }
	
	__moveCurrentRowUp(){
    	let index = this.lastSelectedRowIndex;
    	if(index){
    		this.__moveRowUp(index);
    	} else {
    		this.__moveRowUp(0);
    	}
    }               
	
	__moveCurrentRowDown(){
    	let index = this.lastSelectedRowIndex;
    	if(index){
    		this.__moveRowDown(index);
    	} else {
    		this.__moveRowDown(0);
    	}
    }

    __moveRowUp(index){
    	var values = this.values;
    	if(values.length<2){
    		return;
    	}

    	var valueToMove = values[index];

    	values.splice(index,1);

        var newIndex= index-1;
        if(newIndex < 0){
        	newIndex = values.length;
        }
		values.splice(newIndex,0,valueToMove);  

		this.__recreateTableRows(); 		                 
      
        this.__selectRow(newIndex);                	
    	
    }

    __moveRowDown(index){
    	var values = this.values;
    	if(values.length<2){
    		return;
    	}

    	var valueToMove = values[index];

    	values.splice(index,1);

        var newIndex= index+1;
        if(newIndex > values.length){
        	newIndex = 0;
        }
		values.splice(newIndex,0,valueToMove);  

		this.__recreateTableRows(); 		                 
       
        this.__selectRow(newIndex); 

    }
    
    __recreateTableRows(){                	
    	this.__deleteRows(); 
    	this.values.forEach((value)=>{
    		this.__createRow(value);
    	});  
    } 

    __rowCanBeDeleted(){
    	return this.values.length>0; 					
	} 				

    __rowClicked(event){  
        let rowIndex = event.currentTarget.rowIndex;            	 
    	this.selectedRowIndex = rowIndex;
    	this.lastSelectedRowIndex=rowIndex;                	
    } 

    __selectRow(index){
		this.selectedRowIndex = index;
		this.lastSelectedRowIndex=index;   
		let rowToSelect = this.tableBody.children[index]; 					
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
			this.selectedRowIndex=undefined;
		}
	}                                 
                           
}

window.customElements.define('treez-string-list', TreezStringList);