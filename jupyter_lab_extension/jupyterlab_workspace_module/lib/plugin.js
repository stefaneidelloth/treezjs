require('../style/plugin.css');
var { ReactWidget } = require('@jupyterlab/apputils');

module.exports = [{
    id: 'jupyterlab_workspace_module',
    autoStart: true,
    activate: function(app) {
      init(app);
    }
}];

async function init(app){

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
				    	await window.init_workspace_module(app, ReactWidget);
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