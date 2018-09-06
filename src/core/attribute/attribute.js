

export default class Attribute extends Function  {

    constructor(defaultValue){
        super("value", "return arguments.callee.apply(arguments);");
        this.value = defaultValue;
        this.defaultValue = defaultValue;
        this.changeListeners = [];
    }

    apply([value]){
        if(value!==undefined){
           if(value!==this.value){
               var oldValue = this.value;
               this.value=value;
               this.changeListeners.every((changeListener)=>changeListener(oldValue, value));
           }
        }
        return this.value;
    }

    clear(){
        this.value=undefined;
    }

    reset(){
        this.value=this.defaultValue;
    }

    addChangeListener(listener){
        this.changeListeners.push(listener);
    }

    removeChangeListener(listener){
        this.changeListeners.remove(listener);
    }

    clearChangeListeners(){
        this.changeListeners = [];
    }
}