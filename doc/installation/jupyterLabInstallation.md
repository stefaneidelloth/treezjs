[Installation](./installation.md)

----

# JupyterLab extension

Treez can be loaded with a [JupyterLab](https://www.tutorialspoint.com/jupyter/jupyterlab_installation_and_getting_started.htm) extension:

https://github.com/stefaneidelloth/workspace_module

## Install JupyterLab

Instructions on how to install JupyterLab are given here: https://jupyter.org/install.
As an alternative to the [Anaconda](https://www.anaconda.com/distribution/) distribution, you also might want to consider [WinPython](https://winpython.github.io/). WinPython is a portably python distribution and also includes JupyterLab.

## Install workspace_module

The JupyterLab extension workspace_module allows extending JupyterLab with code that is located in the JupyterLab workspace.

* Open a console window (Press keys Win + R, enter "cmd" and click OK) 

* Install the workspace_module with following console command:

>jupyter labextension install @treezjs/workspace_module

Trouble shooting:

* If pip.exe can not be found, please ensure that pip.exe is included in the Windows system environment variable PATH or navigate to the Scripts folder of you python installation first

* If you are behind a firewall, please ensure to set the right proxy before running pip.exe, for example with following console command:

>SET HTTPS_PROXY=153.33.222.111:3128

## Download treez source code

Use [TortoiseGit](https://tortoisegit.org/) or the [download feature of github](https://github.com/stefaneidelloth/treezjs/archive/master.zip) to download the source code from

https://github.com/stefaneidelloth/treezjs.git

to the "working directory" of the Jupyter notebook, e.g. 

D:\WinPython\notebooks\treezjs

(Please note that the working directory (="notebook-dir") of JupyterLab can be customized, e.g. by creating a windows shortcut like

>%COMSPEC% /C ".\App\WinPython\Jupyter Notebook.exe"  --notebook-dir=%cd%\workspace

)

## Install javascript dependencies

* Open a console window (Press keys Win + R, enter "cmd" and click OK) 

* Navigate to the "main folder" of treez, e.g

>d:<br>
>cd D:\WinPython\notebooks\treezjs

* Install the javascript dependencies using npm with following console command:

>npm install

That command creates a sub folder "node_modules" and downloads the JavaScript dependencies.

## Install Google Chrome 

Treez is a web application that uses modern JavaScript features like ES6 modules and custom web components. 
Those JavaScript features are supported by the Google Chrome browser but might not yet be supported
by other browsers. Treez might work with other browsers but only has been tested with [Google Chrome](https://www.google.com/chrome/).

## Configure "workspace_module"

The JupyterLab extension "workspace_module" executes the file "workspace.js" if it exists in the workspace of JupyterLab. 
Create a file workspace.js, e.g.

D:\WinPython\notebooks\workspace.js

and set its content to: 

>import './treezjs/jupter_lab_extension/treezJupyterLab.js';

----
[User interaction](./userInteraction.md)


