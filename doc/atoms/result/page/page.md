![](../../../../icons/results.png) [Results](../results.md)

----

# Page

The ![](../../../../icons/page.png) Page atom is the entry point for creating content of the [Graphics View](../../../views/graphicsView.md). If you want you can select some background color and adapt the size of the Page.

In order to show a Page in the [Graphics View](../../../views/graphicsView.md), you can
* Use the context menu of the Page atom in the [Tree View](../../../views/treeView.md) and click on the ![](../../../../icons/run.png) Run button. 
* Show the Page atom in the [Properties View](../../../views/propertiesView.md) and click on the ![](../../../../icons/run.png) Run button in the toolbar of the Data section. 

Inside the [Graphics View](../../../views/graphicsView.md), the Page is represented by a rectangular [svg](https://en.wikipedia.org/wiki/Scalable_Vector_Graphics) region. 

The svg content of the [Graphics View](../../../views/graphicsView.md) supports mouse actions:

* If you **double click on a Page** in the [Graphics View](../../../views/graphicsView.md), a file dialog is shown to save the content as [Scalable Vector Graphics \*.svg file](https://en.wikipedia.org/wiki/Scalable_Vector_Graphics). The exported \*.svg file can be edited with the open source software [Inkscape](https://inkscape.org/).

* If you **click on an element** (e.g. Graph, Axis etc.) in the [Graphics View](../../../views/graphicsView.md), the properties of the corresponding child atom are shown in the [Properties View](../../../views/propertiesView.md).

![](../../../images/page.png)

## Source code

[./src/result/page/page.js](../../../../src/result/page/page.js)

## Demo

[./demo/result/page/pageDemo.ipynb](../../../../demo/result/page/pageDemo.ipynb)

## Construction
		
A new ![](../../../../icons/page.png) Page is created either by: 

* using the context menu of a ![](../../../../icons/results.png) [Results](../results.md) atom in the [Tree View](../../../views/treeView.md) or
* calling the corresponding factory method of the ![](../../../../icons/results.png) [Results](../results.md) atom in the source code of the [Editor view](../../../views/editorView.md):

```javascript
    ...
    let page = results.createPage();	     
```

## Child atoms

The context menu of the ![](../../../../icons/page.png) Page atom allows to add child atoms: 

* ![](../../../../icons/graph.png) [Graph](../graph/graph.md)

## Properties

### Data

#### Width

The width of the page, e.g. 15 cm. For supported svg units see [here](https://www.w3.org/TR/css3-values/#absolute-lengths) and [here](https://www.w3.org/TR/css3-values/#relative-lengths) 

#### Height

The height of the page, e.g. 15 cm. For supported svg units see [here](https://www.w3.org/TR/css3-values/#absolute-lengths) and [here](https://www.w3.org/TR/css3-values/#relative-lengths) 

#### Color

The background/fill color of the page.

#### IsHidden

Enable this checkbox if you would like to hide the page.

----

![](../../../../icons/graph.png) [Graph](../graph/graph.md)

