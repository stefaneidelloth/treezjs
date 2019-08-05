import Baa from './baa.js';

export default class Foo{
    constructor(){
        var baa = new Baa();
        this.value = baa.value();
    }
}