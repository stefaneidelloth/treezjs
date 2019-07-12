[Installation](./installation.md)

# Jupyter Notebook extension

Treez can be installed as an extension of the [Jupyter notebook](https://www.dataquest.io/blog/jupyter-notebook-tutorial/). The Jupyter notebook already comes with a server that allows access to the file system. Treez connects to this server to
access the local file system and to execute python code.

## Install Jupyter Notebook

Instructions on how to install Jupyter Notebook are given here: https://jupyter.org/install.
As an alternative to the [Anaconda](https://www.anaconda.com/distribution/) distribution, you also might want to consider [WinPython](https://winpython.github.io/). WinPython is a portably python distribution and also includes the Jupyter notebook.

## Install nbextensions

The python module "jupyter_contrib_nbextensions" comes with a few useful extensions for the Jupyter Notebook. It also provides an extra tab on the Home page to manage all the extensions. 

* Open a console window (Press keys Win + R, enter "cmd" and click OK) 

* Install the python module with following console command (pip.exe is the package manager of python):

>pip install jupyter_contrib_nbextensions

Trouble shooting:

* If pip.exe can not be found, please ensure that pip.exe is incluclued in the windows system environmenat variable PATH or navigate to the Scripts folder of you python installation first

* If you are behind a firewall, please ensure to set the right proxy before running pip.exe, e.g. with following console command:

>SET HTTPS_PROXY=153.33.222.111:3128

If the pip command executes successfully, it creates a folder "jupyter_contrib_nbextensions" in the site-packages of your python installation, for example at

>D:\EclipsePython\App\WinPython\python-3.7.2.amd64\Lib\site-packages\jupyter_contrib_nbextensions\

The individual extensions are located in the sub folder nbextensions, for example:

>D:\EclipsePython\App\WinPython\python-3.7.2.amd64\Lib\site-packages\jupyter_contrib_nbextensions\nbextensions

Now we are ready to isntall a custom extension in that folder, see the next steps. 

Also see:

https://jupyter-contrib-nbextensions.readthedocs.io/en/latest/install.html

## Download treez source code

Use [TortoiseGit](https://tortoisegit.org/) or the [download feature of github](https://github.com/stefaneidelloth/treezjs/archive/master.zip) to download the source code from

https://github.com/stefaneidelloth/treezjs.git

to the "working directory" of the Jupyter notebook, e.g. 

D:\EclipsePython\App\WinPython\notebooks\treezjs

(Please note that the working directory (="notebook-dir") of Jupyter Notebook can be customized, e.g. by creating a windows shortcut like

>%COMSPEC% /C ".\App\WinPython\Jupyter Notebook.exe"  --notebook-dir=%cd%\workspace

)

## Install bower
The javascript dependencies of treez are managed with [bower](https://bower.io/). Download and install node.js
from https://nodejs.org as a prerequisite and then install bower with the package manager
of nodejs, using following console command:

>npm install -g bower

## Install javascript dependencies

* Open a console window (Press keys Win + R, enter "cmd" and click OK) 

* Navigate to the "main folder" of treez, e.g

>d:<br>
>cd D:\EclipsePython\App\WinPython\notebooks\treezjs

* Install the javscript dependencies using bower with following console command:

>bower install

That command creates a sub folder "bower_components" and downloads the JavaScript dependencies.
If the download fails because you are behind a firewall please also see 
https://stackoverflow.com/questions/21705091/bower-behind-a-proxy

## Install Google Chrome 

Treez is a web application that uses modern JavaScript features like ES6 modules and custom web components. 
Those JavaScript features are supported by the Google Chrome browser but might not yet be supported
by other browsers. Treez might work with other browsers but only has been tested with [Google Chrome](https://www.google.com/chrome/).

## Copy custom nbextension "workspace_module"

Treez comes with an extension "workspace_module" for the Jupyter Notebook. That extension
executes the file "workspace.js" if it exists in the workspace of the Jupyter Notebook. 
Furhtermore, the content of "workspace.js" is for example: 

>import './treezjs/src/treezJupyterNotebook.js';

In order for this startup process to work correctly, please copy the folder 

>...\treezjs\jupyter_notebook_extension\workspace_module

from the treez source code to the nbextensions folder of your Jupyter Notebook installation, e.g.

>D:\EclipsePython\App\WinPython\python-3.7.2.amd64\Lib\site-packages\jupyter_contrib_nbextensions\nbextensions

and copy the file "workspace.js" from 

>...\treezjs\jupyter_notebook_extension\workspace.js

to the Jupyter Notebook workspace directory, e.g. 

D:\EclipsePython\App\WinPython\notebooks


## Initialize nbextensions

Run following console command to initialize all the nbextensions:

>jupyter-contrib-nbextension.exe install 

Also see

https://jupyter-contrib-nbextensions.readthedocs.io/en/latest/install.html

## Enable nbextensions

If you now start the Jupyter Notebook, you should see an extra tab "Nbextensions" on the Home page.
Please enable the required extension "Workspace module" (and all other extensions you would like to use):

![Nbextensions](https://raw.githubusercontent.com/stefaneidelloth/treezjs/master/doc/images/jupyter_nbextensions_tab.png)

If you now open a notebook file, the script "workspace.js" will be automatically executed. The content of workspace.js links to the script "treezJupyterNotebook.js" and is responsible for starting treez. As a result, the user interface of the Jupyter Notebook is modified to include the views of treez:

![Nbextensions](https://raw.githubusercontent.com/stefaneidelloth/treezjs/master/doc/images/jupyter_treez_views.png)

If you did not download treez to the working directory of the Jupyter Notebook but to a custom folder, you must adapt the script workspace.js to point to the right location of "treezJupyterNotebook.js". 

The views of treez might only be visible if you use Google Chrome as web browser because treez is based on 
modern javascript features (e.g. ES6 modules) that are not yet supported by all browsers.

If you cannot see the [views](doc/views.md) of treez inside your Jupyter Notebook, please open the 
Developer Tools (F12) of your browser and check the JavaScript console for errors. 

