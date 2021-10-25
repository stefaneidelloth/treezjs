
export default class NotebookObserver {

    constructor(){
        this._cellMap = {};
    }

    observe(notebook, dependencies){

        //Also see
        //https://jupyterlab.readthedocs.io/en/stable/developer/patterns.html#signals

       
        if(notebook){		
            let cellModels = notebook.model.cells
            cellModels.changed.connect(this.__cellsChanged, this);	

            for(let cellIndex=0; cellIndex < cellModels.length; cellIndex++){
                let cellModel = cellModels.get(cellIndex);			
                this.__observeCell(cellModel);
            }

            let notebookActions = dependencies["NotebookActions"];
            notebookActions.executed.connect(this.__cellExecuted, this);  //selectionExecuted, exutionScheduled
        }		 

    }

    __observeCell(cellModel){  

        var id = cellModel.id;

        var outputExpression = this.__extractOutputExpression(cellModel);
        var outputValue = this.__extractOutputValue(cellModel.outputs);    
        this._cellMap[id] = {
            input: outputExpression,
            output: outputValue
        };

        //TODO handle cahgnes to update cell map

        cellModel.outputs.changed.connect(this.__cellOutputsChanged, this) 
        cellModel.contentChanged.connect(this.__cellContentChanged, this);   
        cellModel.stateChanged.connect(this.__cellStateChanged, this);   

    }

    __extractOutputValue(outputs){        
        if(outputs.length > 1){
            let message = "A cell produces more than one output which is not supported by treezjs! Please split into multiple cells having just one output.";
            console.error(message);
            console.warn(cellModel.value.text);
            throw message;
        }

        if(outputs.length < 1){
            return undefined;
        }

        const outputModel = outputs.get(0);
        const outputData = outputModel.data;  
        const text = outputData["text/plain"];
        return text;
    }

    __extractOutputExpression(cellModel){
        var text = cellModel.value.text;
        var lines = text.split('\n');
        var lastLine = lines[lines.length-1];
        return lastLine;
    }

    __cellsChanged(cellModels, change){
        /*
        console.log("Cells changed:")
        console.log("type: " + change.type);
        console.log("oldIndex: " + change.oldIndex);
        console.log("newIndex: " + change.newIndex);
        console.log("oldValues: " + change.oldValues); 
        console.log("newValues: " + change.newValues); 
        */

        if(change.type == "add"){
            var newCellModel = cellModels.get(change.newIndex);
            this.__observeCell(newCellModel);
        }

        //TODO handle other types of changes
    }

    __cellContentChanged(cellModel){	
        let id = cellModel.id
        //console.log("Content of cell " + id + " changed");

        let currentText =  cellModel.value.text;
        //console.log(currentText);      

    }


    __cellOutputsChanged(outputs, change){

         var outputValue = this.__extractOutputValue(outputs)

        //console.log("Output changed:");
        //console.log(outputValue);       
    }


    __cellStateChanged(cellModel, change){
        let currentText =  cellModel.value.text;
        /*
        console.log("State of cell " + cellModel.id + " changed:");
        console.log("name: " + change.name);
        console.log("old value: " + change.oldValue);
        console.log("new value: " + change.newValue);
        */
    }

    __cellExecuted(any, context){
        let {cell, notebook, success, error} = context;	
        //console.log("Executed cell " + cell.model.id);
    }

}