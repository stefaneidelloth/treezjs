import TreezStringList from './treezStringList.js';

export default class TreezStringItemList extends TreezStringList {

    constructor(){
        super();
        this.__itemInfoMap = {};
    } 
    
    static get observedAttributes() {
		return TreezStringList.observedAttributes.concat(['options']);                    
    }  
    
    info(item, info){
    	if(info === undefined){
    		return this.__itemInfoMap[item];
    	} else {
    		this.__itemInfoMap[item] = info;
    		if(this.__tableBody){
    			this.__recreateTableRows();
    		}        	
    	}    	
    }
    
    get hasItemInfo(){
    	return Object.keys(this.__itemInfoMap).length > 0;
    }     
   
    
    __focusCell(rowIndex){
    	var row = this.__tableBody.children[rowIndex];
    	var cell = row.children[0];    	
    	cell.focus();
    }   

    __createRow(value){
    	var row = document.createElement('tr');
    	row.className = 'treez-list-tr';
    	this.__tableBody.appendChild(row);                	
    	
    	row.onclick = (event)=>this.__rowClicked(event);
    	
    	var cell = document.createElement('td');
    	cell.className = 'treez-list-td';
    	row.appendChild(cell);
    	
    	if(this.hasItemInfo){ 
    		var infoCell = document.createElement('td');
    		infoCell.className = 'treez-list-td';
    		var info = this.__itemInfoMap[value];
    		if(info !== undefined){
    			infoCell.innerText = info;
    		}  
    		row.appendChild(infoCell);  		
    	} 
    	
    	var comboBox = document.createElement('select'); 
    	comboBox.className = 'treez-list-select';
    	comboBox.onchange = () => this.__comboBoxChanged(comboBox);                                              
		cell.appendChild(comboBox); 		
		
		if(this.getAttribute('options')){
           this.__recreateOptionTags(comboBox);	                           
		} 
		
		if(value){
			comboBox.value = value;
    	}
    	
    	row.tabIndex=row.rowIndex;    	
    	cell.onblur = (event)=>this.__cellLostFocus(event);                	
    	 
    }
    
    __comboBoxChanged(comboBox){
    	let cell = comboBox.parentElement;
    	let newValue = comboBox.value;
    	let rowIndex = cell.parentElement.rowIndex;  

    	var valueArray = this.values;                	
    	valueArray[rowIndex] = newValue;
    	this.value = valueArray;
    	
    	this.__focusCell(rowIndex);
    }

     get __defaultValue(){
     	if(!this.options){
     		return '';
     	}
     	return this.options.split(',')[0];    	
    } 
    
    getCellValue(cell){
    	return cell.children[0].value;
    }
    
    setCellValue(cell, value){
    	cell.children[0].value = value;
    }
    
    __recreateOptionTags(comboBox){	  
	    var oldValue = comboBox.value;

		while (comboBox.hasChildNodes()) {
			comboBox.removeChild(comboBox.lastChild);
		}

		var optionEntries = this.options.split(',');
		optionEntries.forEach(option=>{
			var optionTag = this.__createOptionTag(option)						
		    comboBox.appendChild(optionTag);
		});

		if(oldValue){
			if (optionEntries.indexOf(oldValue) > -1){
				comboBox.value = oldValue;
			} else {
				if (optionEntries.length > 0 ){
					comboBox.value = optionEntries[0];
				}
			}
		}	
	}	
	
	__createOptionTag(option){
		var optionTag = document.createElement('option')
	 	optionTag.innerText=option;
		return optionTag;
	}
	
	attributeChangedCallback(attr, oldValue, newValue) {
    	super.attributeChangedCallback(attr, oldValue, newValue) 
        if(attr==='options'){
        	if(this.__tableBody){
        		this.__recreateTableRows();        		
        	}                                           
        } 					
		
    } 	
	
	get options() {
	  var optionString = this.getAttribute('options');
	  return optionString
	  			?optionString
	  			:'';
	}

	set options(newValue) {
	  this.setAttribute('options', newValue);	
	}	
                           
}

window.customElements.define('treez-string-item-list', TreezStringItemList);