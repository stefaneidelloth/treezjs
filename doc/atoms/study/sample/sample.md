![](../../../../icons/studies.png) [Studies](../studies.md)

----

# Sample
		
The purpose of the ![](../../../../icons/sample.png) Sample atom is to specify variable values for 
a ![](../../../../icons/picking.png) [Picking](../picking/picking.md) study. Add several samples if
you would like to run the controlled model several times. 

![](../../../images/sample.png)

A time dependent Picking study only supports a single Sample, where the time series for the variables
are specified as arrays:

![](../../../images/sampleTimeDependent.png)

## Source code

[./src/study/sample/sample.js](../../../../src/study/sample/sample.js)

## Demo

[./demo/study/sample/sampleDemo.ipynb](../../../../demo/study/sample/sampleDemo.ipynb)

## Construction
		
A new ![](../../../../icons/sample.png) Sample atom is created either by: 

* using the context menu of a ![](../../../../icons/picking.png) [Picking](../picking/picking.md) study in the [Tree View](../../../views/treeView.md) or
* calling the corresponding factory method of the ![](../../../../icons/picking.png) [Picking](../picking/picking.md) study in the source code of the [Editor view](../../../views/editorView.md):

```javascript
    ...
    let sample = picking.createSample();	     
```

## Work flow	

First define which variables you would like to pick values for in the Picking study. Then add Then add some
![](../../../../icons/sample.png) [Samples](../sample/sample.md) as children of the Picking study.
Click on a sample to show its properties in the [Properties View](../../../views/propertiesView.md) and specify some values. 

----

![](../../../../icons/sensitivity.png) [Sensitivity](../sensitivity/sensitivity.md)

