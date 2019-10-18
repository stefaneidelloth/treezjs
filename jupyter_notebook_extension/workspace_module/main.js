define([
    'require',
    'jquery',
    'base/js/namespace',
    'base/js/events',
    'notebook/js/codecell' 
], function(
    requirejs,
    $,
    Jupyter,
    events,
    codecell   
) {
	
	//put this file at workspace_module folder of nbextensions of jupyter, e.g.
	//D:\EclipsePython\App\WinPython\python-3.7.2.amd64\Lib\site-packages\jupyter_contrib_nbextensions\nbextensions\workspace_module
           
    var load_ipython_extension = function() {  
        if (Jupyter.notebook !== undefined && Jupyter.notebook._fully_loaded) {
			init();                    
        } else {
            console.log("[workspace_module] Waiting for notebook availability")
            events.on("notebook_loaded.Notebook", function() {
				init();                           
            })
        }
    };
	
	async function init(){

		let url = document.URL;
		let maxDepth = url.split('/').length;
		
		let workspacePath = 'workspace.js';
		
		console.log('[workspace_module] Trying to load "' + workspacePath + '"');
		
		let loadingFinished = false;

		let numberOfTrials = 0;
		
		while(!loadingFinished){
		
			await importScript(workspacePath)
				.then(()=>{
					loadingFinished = true;
					console.log('[workspace_module] Found "' + workspacePath + '".');
				})
				.catch(error => {
					
					if(numberOfTrials > maxDepth){
						let message = 'Could not find required file "workspace.js" for jupyter notebook extension "workspace_module" after ' + maxDepth + ' trials!';
						throw new Error(message);
					}
					
					console.log('[workspace_module] Could not load "' + workspacePath + '" relative to  "' + document.URL + '". Trying with parent folder..');
					workspacePath = '../' + workspacePath;	
					numberOfTrials++;				
				});
		}		

		
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


    return {
        load_ipython_extension: load_ipython_extension       
    };

});
