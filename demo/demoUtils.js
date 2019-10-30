
import Treez from '../src/treez.js';
import DTreez from '../src/core/dTreez/dTreez.js';
import Root from '../src/root/root.js';

export default class DemoUtils {

    static async createDemo(atomClass){

        Treez.config({
            home: '..',
            isSupportingPython: false
        });

        Treez.importCssStyleSheet('/src/views/propertyView.css');

        let d3 = await Treez.importScript('/bower_components/d3/d3.min.js','d3')
                    .catch(error => {
                        console.log(error);
                        throw error;
                    });

        let dTreez = new DTreez(d3);
        let treeView = { dTreez: dTreez };       

        let propertiesView = dTreez.select('#treez-properties');


        let atom = new atomClass();

        if(atomClass !== Root){
            let root = new Root();
            root.addChild(atom);
        }
        atom.createControlAdaption(propertiesView, treeView);

    }

}