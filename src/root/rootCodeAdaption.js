import ComponentAtomCodeAdaption from '../core/component/componentAtomCodeAdaption.js';
import CodeContainer from '../core/code/codeContainer.js';

export default class rootCodeAdaption extends ComponentAtomCodeAdaption {

    constructor(atom) {
        super(atom);
    }

    buildCreationCodeContainerWithoutVariableName(codeContainer) {

        if(!codeContainer){
            codeContainer = new CodeContainer();
        }


        var name = this.__atom.name;
        let hasDefaultName = name === this.__atom.__defaultName;
        var className = this.className(this.__atom);
        var hasParent = this.__atom.hasParent;

        let constructorArgs = hasDefaultName
            ?"()"
            :"('" + name + "')";

        if (hasParent) {
            throw new Error('Root atom must not have parent.');

        } else {
            codeContainer.extendBulk(this.indent + "let root = new Root"+ constructorArgs + ";");
        }
        return codeContainer;
    }

}