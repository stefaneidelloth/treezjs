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
	
	function init(){
		
		console.log("[workspace_module] trying to load workspace.js")

		var moduleScript = document.createElement('script');
		moduleScript.setAttribute('type','module');	
		
		moduleScript.setAttribute('src','workspace.js');	

		document.body.appendChild(moduleScript);
	}


    return {
        load_ipython_extension: load_ipython_extension       
    };

});
