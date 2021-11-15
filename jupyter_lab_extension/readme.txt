If you want to use treezjs with JupyterLab please follow following steps:

#A. Install JupyterLab and Chrome browser (other browsers are currently not supported)

#B. Create a (windows) shortcut for starting JupyterLab with your wanted workspace (notebok-dir):

* Right click => New => Shortcut
* The target of the shortcut might for example be:
%COMSPEC% /C ".\WinPython\Jupyter Labk.exe"  --notebook-dir=%cd%\workspace

If you do not want to create that shortcut you can also use the default workspace (=notebook-dir)

#C. Clone treez to a sub folder "treezjs" of your workspace folder, e.g.

.\workspace\treezjs

#D. Install the JupyterLab extension "@treezjs/workspace_module":

jupyter labextension install @treezjs/workspace_module

Source code of this extension is available at

https://github.com/stefaneidelloth/workspace_module

#E. Create a file "workspace.js" in your workspace folder, including a single line to
import "treezJupyterLab.js":

import './treezjs/jupter_lab_extension/treezJupyterLab.js';

#H. Start JupyterLab. The left Sidebar should have a new button with the treez icon.
