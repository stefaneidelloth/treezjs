[Views](../views.md)
----

#	Editor View

The purpose of the Editor View is to **edit the tree model** of the application in form of **JavaScript** source code. The source code can be saved and restored as text file. 

Code that this generated from the tree model contains all modified properties (= different to default value) of the treez atoms.

## Toolbar

The toolbar of the Editor View provides several action buttons:

* ![Open from](../../icons/browse.png) **Open from...**
* **Save as...**
* ![Open from](../../icons/save.png) **Open from local storage**
* ![Open from](../../icons/saveToLocalStorage.png) **Save to local storage**

## Installation options

The appearance of the Editor View might be slightly different, depending on how you use treez:

* **Stand-alone**: [Orion](http://wiki.eclipse.org/Orion) is used as source code editor and line numbers are shown by default. There is no extra border.

<img width="400" src="../images/editor_view_stand-alone.png">

* **Jupyter Notebook extension**: The first cell of the Jupyter Notebook is used to edit the JavaScript code of treez. The cells of the Jupyter Notebook are based on [CodeMirror](https://codemirror.net/) and here you can also [enable line numbers](https://stackoverflow.com/questions/10979667/showing-line-numbers-in-ipython-jupyter-notebooks) if you want. Further cells (containing python code or any other supported content) can be added to the Jupyter Notebook below. 

<img width="400" src="../images/editor_view.png">

