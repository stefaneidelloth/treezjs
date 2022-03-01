import TreezCodeArea from './treezCodeArea.js';
import Treez from './../../../treez.js';

export default class TreezCodeMirrorArea extends TreezCodeArea {

    async createEditor(codeAreaContainer){
        if(!window.CodeMirror){
			throw Exception('window.CodeMirror needs to be provided by treez, e.g. treezJupyterLab.js')
		}

        var self = this;

        //Doc on CodeMirror options: https://codemirror.net/doc/manual.html#config
        let editor = new window.CodeMirror(codeAreaContainer,
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
	
}

window.customElements.define('treez-code-mirror-area', TreezCodeMirrorArea);