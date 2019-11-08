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

## Child atoms

The context menu of the ![](../../../../icons/page.png) Page atom allows to add child atoms: 

* ![](../../../icons/axis.png) [Axis](../axis/axis.md)
* ![](../../../icons/xy.png) [Xy](../xy/xy.md)
* ![](../../../icons/xySeries.png) [XySeries](../xySeries/xySeries.md)
* ![](../../../icons/bar.png) [Bar](../bar/bar.md)
* ![](../../../icons/tornado.png) [Tornado](../tornado/tornado.md)
* ![](../../../icons/legend.png) [Legend](../legend/legend.md)


## Sections

### Data

#### Width

The width of the page. For supported svg units see [here](https://www.w3.org/TR/css3-values/#absolute-lengths) and [here](https://www.w3.org/TR/css3-values/#relative-lengths) 

#### Height

The height of the page. For supported svg units see [here](https://www.w3.org/TR/css3-values/#absolute-lengths) and [here](https://www.w3.org/TR/css3-values/#relative-lengths) 

#### Color

The background color of the page

#### IsHidden

Enable this checkbox if you would like to hide the page.

----

![](../../../../icons/graph.png) [Graph](../graph/graph.md)

