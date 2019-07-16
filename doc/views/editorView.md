[Views](../views.md)
----

#	Editor View

The purpose of the Editor View is to **edit the tree model** of the application in form of **JavaScript** source code. The source code can be saved and restored as text file. 

Code that this generated from the tree model contains all modified properties (= different to default value) of the treez atoms.

## Toolbar

The toolbar of the Editor View provides several action buttons:

* ![Open from](../../icons/browse.png) **Open from...** Open a text file and show it in the Editor View. 
* ![Open from](../../icons/save.png) **Save as...** Download the content of the Editor View as JavScript file *.js. 
* ![Open from](../../icons/openFromLocalStorage.png) **Open from local storage** Open a previously stored source code from the local browser storage in the Editor View and also import it to the TreeView (="quick open"). 
* ![Open from](../../icons/saveToLocalStorage.png) **Save to local storage** Save the content of the Editor View to the local browser storage (="quick save") 

## Installation options

The appearance of the Editor View might be slightly different, depending on how you use treez:

* **Stand-alone**: [Orion](http://wiki.eclipse.org/Orion) is used as source code editor and line numbers are shown by default. There is no extra border.

<img width="400" src="../images/editor_view_stand-alone.png">

* **Jupyter Notebook extension**: The first cell of the Jupyter Notebook is used to edit the JavaScript sourcecode for the tree model. The cells of the Jupyter Notebook are based on [CodeMirror](https://codemirror.net/). You can [enable line numbers](https://stackoverflow.com/questions/10979667/showing-line-numbers-in-ipython-jupyter-notebooks) if you want. Further cells (containing python code or any other supported content) can be added to the Jupyter Notebook below. The cells have a border that indicates their current state/[edit mode](https://jupyter-notebook.readthedocs.io/en/stable/examples/Notebook/Notebook%20Basics.html#Modal-editor). In addition to the buttons of the Editor View, the [buttons of the Jupyter Notebook](https://jupyter-notebook.readthedocs.io/en/stable/examples/Notebook/Notebook%20Basics.html#Mouse-navigation) can be used, e.g. to open or save *.ipynb notebook files. 

<img width="400" src="../images/editor_view.png">

