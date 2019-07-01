# Installation as Jupyter Notebook extension

Treezjs can also be installed as an extension of the Jupyter notebook. The Jupyter notebook already
comes with a server that allows access to the file system. Treezjs connects to this server to
execute file specific operation and python code.

## Install Jupyter Notebook

Instructions on how to install Jupyter Notebook are given here: https://jupyter.org/install.
As an alternative to the [Anaconda](https://www.anaconda.com/distribution/) distribution, 
you can also consider [WinPython](https://winpython.github.io/). It is a portably python distribution and also comes
with the Jupyter notebook.

## Install nbextensions

The python module "jupyter_contrib_nbextensions" comes with a few useful extensions and an extension management tab
for the Jupyter Notebook. Pleas install it with following console command (pip.exe is the package manager of python):

>pip install jupyter_contrib_nbextensions

That creates a sub folder "jupyter_contrib_nbextensions" in the site-packages of your python installation, for example at

>D:\EclipsePython\App\WinPython\python-3.7.2.amd64\Lib\site-packages\jupyter_contrib_nbextensions\

The individual extensions are located in the folder nbextensions, for example:

>D:\EclipsePython\App\WinPython\python-3.7.2.amd64\Lib\site-packages\jupyter_contrib_nbextensions\nbextensions

We will put a custom extension in that folder, see next steps. 

Also see:

https://jupyter-contrib-nbextensions.readthedocs.io/en/latest/install.html

## Download treez source code

Use TortoiseGit or the download feature of github to download the source code from

https://github.com/stefaneidelloth/treezjs.git

to the working directory of the Jupyter notebook, e.g. 

D:\EclipsePython\App\WinPython\notebooks\treezjs

(The working directory (="notebook-dir") of Jupyter Notebook can be customized, e.g. by creating a windows shortcut like
%COMSPEC% /C ".\App\WinPython\Jupyter Notebook.exe"  --notebook-dir=%cd%\workspace
)

## Copy custom nbextension "workspace_module"

Treez comes with an extension "workspace_module" for the Jupyter Notebook. That extension
executes the file "workspace.js" if it exists in the workspace of the Jupyter Notebook.

Copy the folder 

>...\treezjs\jupyter_notebook_extension\workspace_module

from the treez source code to the nbextensions folder of the Jupyter Notebook, e.g.

>D:\EclipsePython\App\WinPython\python-3.7.2.amd64\Lib\site-packages\jupyter_contrib_nbextensions\nbextensions

and copy the file "workspace.js" from 

>...\treezjs\jupyter_notebook_extension\workspace.js

to the Jupyter Notebook workspace directory, e.g. 

D:\EclipsePython\App\WinPython\notebooks


## Initialize nbextensions

Run following console command to initilaize the nbextensions:

>jupyter-contrib-nbextension.exe install 

Also see

https://jupyter-contrib-nbextensions.readthedocs.io/en/latest/install.html

## Enable nbextensions

If you now start the Jupyter Notebook, you should see an extra tab "Nbextensions".
Please enable the extension "Workspace module" and all other extensions you would like to use:

![Nbextensions](https://raw.githubusercontent.com/stefaneidelloth/treezjs/master/doc/images/jupyter_nbextensions_tab.png)

If you open a notebook file, workspace.js will be executed and that modifies the user interface of the Jupyter Notebook to include treez:

![Nbextensions](https://raw.githubusercontent.com/stefaneidelloth/treezjs/master/doc/images/jupyter_treez_views.png)

