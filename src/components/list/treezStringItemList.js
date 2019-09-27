import TreezStringList from './treezStringList.js';

export default class TreezStringItemList extends TreezStringList {

    constructor(){
        super();
        this.__itemInfoMap = {};
    } 
    
    static get observedAttributes() {
		return TreezStringList.observedAttributes.concat(['options']);                    
    }

	attributeChangedCallback(attr, oldValue, newValue) {
		super.attributeChangedCallback(attr, oldValue, newValue)
		if(attr==='options'){
			if(this.__tableBody){
				this.__recreateTableRows();
			}
		}
	}

	getCellValue(cell){
		return cell.children[0].value;
	}

	setCellValue(cell, value){
		cell.children[0].value = value;
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

    __createRow(value){
    	var row = document.createElement('tr');
    	row.className = 'treez-list-tr';
    	this.__tableBody.appendChild(row);                	
    	
    	row.onclick = (event)=>this.__rowClicked(event);
    	
    	var cell = document.createElement('td');
    	cell.className = 'treez-list-td';
    	row.appendChild(cell);

		var comboBox = document.createElement('select');
		comboBox.className = 'treez-list-select';
		comboBox.onchange = () => this.__comboBoxChanged(comboBox);
		cell.appendChild(comboBox);

		if(this.__hasItemInfo){
    		var infoCell = document.createElement('td');
    		infoCell.className = 'treez-list-td';
    		var info = this.__itemInfoMap[value];
    		if(info !== undefined){
    			infoCell.innerText = info;
    		}  
    		row.appendChild(infoCell);  		
    	}
		
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

	__focusCell(rowIndex){
		var row = this.__tableBody.children[rowIndex];
		var cell = row.children[0];
		cell.focus();
	}
    
    __recreateOptionTags(comboBox){	  
	    var oldValue = comboBox.value;

		while (comboBox.hasChildNodes()) {
			comboBox.removeChild(comboBox.lastChild);
		}

		if(this.options){
			let optionEntries = this.options.split(',');
			optionEntries.forEach(option=>{
				var optionTag = TreezStringItemList.__createOptionTag(option)
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
				this.__comboBoxChanged(comboBox);
			}
		}

	}	
	
	static __createOptionTag(option){
		var optionTag = document.createElement('option')
	 	optionTag.innerText=option;
		return optionTag;
	}

	get __defaultValue(){
		if(!this.options){
			return '';
		}
		return this.options.split(',')[0];
	}

	get __hasItemInfo(){
		return Object.keys(this.__itemInfoMap).length > 0;
	}
	
	get options() {
	  var optionsString = this.getAttribute('options');
	  return optionsString
	  			?optionsString
	  			:'';
	}

	set options(newValue) {
	  this.setAttribute('options', newValue);	
	}	
                           
}

window.customElements.define('treez-string-item-list', TreezStringItemList);