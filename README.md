# treezjs
Treez is an open source project that helps you to create tree based Graphical User Interfaces (GUIs) for (scientific) applications.
The core idea of treez is to provide reusable building blocks (so-called atoms) and to organize them in a tree structure.

Originally Treez has been developed as Eclipse Plugin (see ). This is a JavaScript version of Treez and all further development will be done here. 

# Installation

## Stand allone

## Jupyter notebook extension

# User interaction

Tree structures are often very well suited to manage complexity. Therefore, it does not surprise that trees are a common element in complex applications. The file system on computers typically has a tree structure und the reader might probably use a tree based file explorer to manage all kind of files for complex research projects. 
In order to be able to edit complex tree models, Treez focuses on the context menus of the tree nodes in the so-called Treez View and on operations in the Treez Properties View. Treez does not have an obfuscating main menu on the top of the application window. 
The context menu in the Treez View exactly provides those actions being rele-vant to the selected Treez Atom. This concept is not a new idea. Nevertheless, the decision to have a minimum main menu and to concentrate on the tree nodes actually has a deep impact on the workflows and on the way one thinks about an application in Treez.
Treez does not only allow editing an application model with a graphical work-flow but also allows editing the application model in form of a text file in a Source Code Editor. 
The graphical workflow with mouse clicks in the Treez View is easier to learn for new users and the source code workflow provides an efficient option for advanced users.

# Views

## Treez View

The Treez View is the heart of Treez. It displays a tree model of the applica-tion and provides actions to edit the tree model. Each node of the tree repre-sents a corresponding Treez Atom. 

### Tool bar actions 
•	 : Create a Root atom and set it as the content of the Treez View (overrides the previous content of the Treez View). 
•	 : Import a tree from the currently opened text file (overrides the previ-ous content of the Treez View). 
•	 : Exports the tree to the currently opened text file (overrides the pre-vious content of the text file).
 
###	Tree node mouse actions

•	Left-click: Show the properties of the corresponding Treez atom in the Properties View.
•	Right-click: Shows a context menu that provides specific actions for that tree node/atom.
•	Double-click: Fully expands or collapses the tree node.

## Properties View

The purpose of the Properties View is to inspect and edit the properties of a Treez Atom. It has a hierarchical structure: 

##	Editor View
The purpose of the Editor View is to edit the tree model of the application in form of a text file. The text file can be saved and restored and contains all modi-fied properties of the Treez Atoms.   

##	Graphics View
Some of the Treez Atoms have graphical representations, for example a plot window. The purpose of the Graphics View is to show those graphical repre-sentations.    

##	Monitoring View
The Monitoring View shows the progress of executed actions (e.g. batch simu-lations) in form of progress bars and log messages.  
