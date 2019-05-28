If you want to use treezjs with Jupyter Notebook please follow following steps:

#A. Install Jupyter Notebook and Chrome browser (other browsers are currently not supported)

#B. Create a (windows) shortcut for starting Jupyter Notebook with your wanted workspace (notebok-dir):
 
* Right click => New => Shortcut
* The target of the shortcut might for example be:
%COMSPEC% /C ".\WinPython\Jupyter Notebook.exe"  --notebook-dir=%cd%\workspace

If you do not want to creae that shortcut you can also use the default workspace (=notebook-dir)

#C. Clone treez to a sub folder "treezjs" of your workspace folder, e.g.

.\workspace\treezjs

#D. Install the python package jupyter_contrib_nbextensions:

pip install jupyter_contrib_nbextensions

#E. Copy the jupyter notebook extension "workspace_module" to the extensions folder, e.g.

.\WinPython\python-3.7.2.amd64\Lib\site-packages\jupyter_contrib_nbextensions\nbextensions

The task of thet jupyter notebook extension is to execute a file "workspace.js" in the workspace folder.

#F. Activate the notebook extensions:

jupyter-contrib-nbextension.exe install

#G. Create a file "workspace.js" in your worspace folder, including a single line to import "treezJupyterNotebook.js":

import './treezjs/src/treezJupyterNotebook.js';

#H. Start Jupyter notebook in Chrome, switch to the nbextensions tab and enable the workspace_module extension

#J. Open some notebook file. Now the views of treez.js should be shown inside the Jupyter notebook. 
(If not you might want to open the developer tools of the browser and look for error messages in the
JavaScript console.) 