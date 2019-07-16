[Views](../views.md)

----

<img align="right" width="300" src="../images/tree_view.png">

# Tree View

The Tree View is the heart of Treez. It displays a tree model of the application and provides actions to edit that model. Each node of the tree represents a corresponding Treez Atom. The first node of the tree is called "root". 

## Toolbar 

The toolbar of the Tree View provides several action buttons:

* ![addRoot](../../icons/root.png) **Create a [Root](../atoms/root.md) atom** and set it as the content of the Treez View (overrides the previous content of the Tree View). 
* ![import](../../icons/toTree.png) **Import a tree model** from the currently opened text file (overrides the previous content of the Tree View). 
* ![export](../../icons/fromTree.png) **Export the tree model** to the currently opened text file (overrides the previous content of the text file).
* ![help](../../icons/help.png) **Show help** page in a new tab of the browser: [README.md](https://github.com/stefaneidelloth/treezjs/blob/master/README.md)
 
##	Tree node mouse actions

Users can modify the tree model using mouse actions:

* **Left-click on triangle** symbol: **expand or collapse** a tree node.
*	**Left-click** on node label: **Show the properties** of a node/atom in the [Properties View](./propertiesView.md).
*	**Double-click** on node label: **Fully expand or collapse** a tree node and its children.
*	**Right-click** on node label: Show the **context menu** of a tree node, for example:<br>
![Tree View](../images/context_menu.png)


----
[Properties View](./propertiesView.md)
