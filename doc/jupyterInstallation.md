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

That creates a sub folder "jupyter_contrib_nbextensions" in the site-packages of your python installation, e.g. at

D:\EclipsePython\App\WinPython\python-3.7.2.amd64\Lib\site-packages\jupyter_contrib_nbextensions\

The individual extensions are located in the folder nbextensions, e.g.

D:\EclipsePython\App\WinPython\python-3.7.2.amd64\Lib\site-packages\jupyter_contrib_nbextensions\nbextensions

We will put a custom extension in that folder, see next steps. 

Also see:

https://jupyter-contrib-nbextensions.readthedocs.io/en/latest/install.html

## Download treez source code

Use TortoiseGit or the download feature of github to download the source code from

https://github.com/stefaneidelloth/treezjs.git

to the working directory of the Jupyter notebook, e.g. 

D:\EclipsePython\App\WinPython\notebooks\treezjs

(The working directory can be customized, e.g. by creating as windows shortcut like

)



## Copy custom nbextension "workspace_module"

## Initialize nbextensions
