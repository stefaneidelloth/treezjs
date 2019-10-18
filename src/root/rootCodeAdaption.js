import ComponentAtomCodeAdaption from "../core/component/componentAtomCodeAdaption";

export default class rootCodeAdaption extends ComponentAtomCodeAdaption {

    constructor(atom) {
        super(atom);
    }

    buildCreationCodeContainerWithoutVariableName(codeContainer) {

        if(!codeContainer){
            codeContainer = new CodeContainer();
        }

        var name = this.__atom.name;
        var className = this.getClassName(this.__atom);
        var hasParent = this.__atom.hasParent;

        if (hasParent) {
            throw new Error('Root atom must not have parent.');

        } else {
            codeContainer.extendBulk(this.indent + "let root = new Root('" + name + "');");
        }
        return codeContainer;
    }

}