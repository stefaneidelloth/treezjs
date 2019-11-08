![](../../../../icons/results.png) [Results](../results.md)

----

# Page

The ![](../../../../icons/page.png) Page atom is the entry point for creating content of the Graphics View. 

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

## Sections

### Data

#### Width

#### Height

#### Color

#### IsHidden

----

![](../../../../icons/graph.png) [Graph](../graph/graph.md)

