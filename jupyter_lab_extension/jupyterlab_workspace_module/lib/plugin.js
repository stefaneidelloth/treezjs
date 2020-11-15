require('../style/plugin.css');

var { IMainMenu } = require ('@jupyterlab/mainmenu');
var { ILayoutRestorer} = require('@jupyterlab/application');
var { IFileBrowserFactory } = require ('@jupyterlab/filebrowser');
var { IRenderMimeRegistry } = require ('@jupyterlab/rendermime');
var { ISettingRegistry } = require ('@jupyterlab/settingregistry');
var { IDocumentManager } = require ('@jupyterlab/docmanager');
var { IStatusBar } = require ('@jupyterlab/statusbar');

var { FileDialog } = require('@jupyterlab/filebrowser');
var { NotebookActions } = require("@jupyterlab/notebook");
var { InputDialog, ReactWidget } = require('@jupyterlab/apputils');

module.exports = [{
    id: 'jupyterlab_workspace_module',
    autoStart: true,
    requires: [
	    IMainMenu,
	    ILayoutRestorer,
	    IFileBrowserFactory,
	    IRenderMimeRegistry,
	    ISettingRegistry,
	    IDocumentManager,
	    IStatusBar
    ],
    activate: function(
    	app,
    	mainMenu,
    	layoutRestorer,
    	fileBrowserFactory,
    	renderMimeRegistry,
    	settingRegistry,
    	documentManager,
    	statusBar
    ) {
      init(
      	app,
      	mainMenu,
      	layoutRestorer,
      	fileBrowserFactory,
      	renderMimeRegistry,
      	settingRegistry,
      	documentManager,
      	statusBar
      );
    }
}];

async function init(
	app,
  	mainMenu,
  	layoutRestorer,
  	fileBrowserFactory,
  	renderMimeRegistry,
  	settingRegistry,
  	documentManager,
  	statusBar
){

	 var jupyterDependencies = {
	    'mainMenu': mainMenu,
	    'layoutRestorer': layoutRestorer,
	  	'fileBrowserFactory': fileBrowserFactory,
	  	'renderMimeRegistry': renderMimeRegistry,
	  	'settingRegistry': settingRegistry,
	  	'documentManager': documentManager,
	  	'statusBar': statusBar,
	  	'InputDialog': InputDialog,
    	'FileDialog': FileDialog,
    	'NotebookActions': NotebookActions,
    	'ReactWidget': ReactWidget
    };

	let url = document.URL;
	let maxDepth = url.split('/').length;

	let workspacePath = 'files/workspace.js';

	console.log('[workspace_module] Trying to load "' + workspacePath + '"');

	let loadingFinished = false;

	let numberOfTrials = 0;

	while(!loadingFinished){

		await importScript(workspacePath)
			.then(async () => {
				if(window.init_workspace_module){
				    try{
				    	await window.init_workspace_module(app, jupyterDependencies);
				    } catch(exception){
				       console.error("[workspace_module]: Error while calling init method 'window.init_workspace_module'", exception);
				    }
			    	window.init_workspace_module = undefined;
			    }
				loadingFinished = true;
				console.log('[workspace_module] Found "' + workspacePath + '".');
			})
			.catch(error => {

				if(numberOfTrials > maxDepth){
					let message = 'Could not find required file "workspace.js" for jupyter lab extension "jupyterlab_workspace_module" after ' + maxDepth + ' trials!';
					throw new Error(message);
				}

				console.log('[workspace_module] Could not load "' + workspacePath + '" relative to  "' + document.URL + '". Trying with parent folder..');
				workspacePath = '../' + workspacePath;
				numberOfTrials++;
			});
	}

	console.log('JupyterLab extension jupyterlab_workspace_module is activated!');

}

async function importScript(src){


	return new Promise((resolve, reject) => {
		const script = document.createElement('script');
		script.async = true;
		script.type = 'module';
		script.src = src;
		script.addEventListener('load', (event)=>{
			resolve();
		});
		script.addEventListener('error', (event) => reject('Could not load script ' + src));
		script.addEventListener('abort', (event) => reject('Could not load script ' + src));
		try{
			document.head.appendChild(script);
		} catch(error){
			reject(error);
		}

	});

}