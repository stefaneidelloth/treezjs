![](../../../../icons/graph.png) [Graph](../graph/graph.md)

----

# Axis

The ![](../../../../icons/axis.png) Axis atom represents a plot axis.<br>
Typically, each ![](../../../../icons/graph.png) [Graph](../graph/graph.md) atom has two Axis children, a horizontal an a vertical one. Furthermore, plots (e.g. ![](../../../../icons/xy.png) [XY](../xy/xy.md)) need to reference those axis. 

## Source code

[./src/result/axis/axis.js](../../../../src/result/axis/axis.js)

## Demo

[./demo/result/axis/axisDemo.ipynb](../../../../demo/result/axis/axisDemo.ipynb)

## Construction
		
A new ![](../../../../icons/axis.png) Axis is created either by: 

* using the context menu of a ![](../../../../icons/graph.png) [Graph](../graph/graph.md) atom in the [Tree View](../../../views/treeView.md) or
* calling the corresponding factory method of the ![](../../../../icons/graph.png) [Graph](../graph/graph.md) atom in the source code of the [Editor view](../../../views/editorView.md):

```javascript
    ...
    let axis = graph.createAxis();	
```

# Screenshots of Property View

<table>
<tr>
<img src="../../../images/axisData.png">
</tr>	

<tr>
<img src="../../../images/axisLine.png">
</tr>	

<tr>
<img src="../../../images/axisMajorTicks.png">	
</tr>	

<tr>
<img src="../../../images/axisMinorTicks.png">	
</tr>	

<tr>
<img src="../../../images/axisTickLabels.png">	
</tr>	

<tr>
<img src="../../../images/axisLabel.png">	
</tr>	

</table> 

----

![](../../../../icons/xy.png) [Xy](../xy/xy.md)

