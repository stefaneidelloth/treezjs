import TreezCodeArea from './treezCodeArea.js';
import Treez from './../../../treez.js';

export default class TreezCodeMirrorArea extends TreezCodeArea {

    async createEditor(codeAreaContainer){
        await this.initializeCodeMirror();

        var self = this;

        //Doc on CodeMirror options: https://codemirror.net/doc/manual.html#config
        let editor = window.CodeMirror(codeAreaContainer,
          {
            value: self.value,
            mode: self.mode,
            lineNumbers: false,
            matchBrackets: true,
            continueComments: "Enter",
            extraKeys: {"Ctrl-Q": "toggleComment"}
          }
        );
        return editor;
    }

    async initializeCodeMirror(){


    	if(!window.requirejs){
        	 window.requirejs = await Treez.importScript('/node_modules/requirejs/require.js','require')
                    .catch(error => {
                        console.log(error);
                        throw error;
                    });

			window.requirejs.config({
				baseUrl : '..',
				paths : {
					'codemirror' : 'node_modules/codemirror'
				}
			});
        }

        if(!window.CodeMirror){

        	Treez.importCssStyleSheet('/node_modules/codemirror/lib/codemirror.css');

        	await new Promise((resolve, reject) => {
				window.requirejs([
					'codemirror/lib/codemirror',
					'codemirror/mode/sql/sql',
					'codemirror/mode/javascript/javascript',
					'codemirror/mode/python/python',
					'codemirror/mode/htmlmixed/htmlmixed'
				], function(
					 CodeMirror
				) {
					window.CodeMirror=CodeMirror;
					resolve();
				}, function(error){
					console.log(error);
					reject(error);
				});
			});

		}
    }

}

window.customElements.define('treez-code-mirror-area', TreezCodeMirrorArea);