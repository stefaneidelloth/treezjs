![](../../../../icons/data.png) [Data](../../data/data.md)

----

# SweepProbe

Lets assume that a model run does not yield a single number but a whole table and that we
want to create a simple 2D diagram to visualize the output of a Sweep study. In order to do so,
we should focus on a single cell of the output table and collect it over all model runs.   

The ![](../../../../icons/sweepProbe.png) SweepProbe loops over all output tables of a Sweep study,
picks a specific output value and maps it to the corresponding input values. The collected values 
yield a new table, including data from all model runs.  

The generated probe table can be understood as an intermediate step to visualize dependencies of
Sweep studies in terms of XySeries plots. 

![](../../../images/sweepProbe.png)

## Source code

[./src/result/probe/sweepProbe.js](../../../../src/result/probe/sweepProbe.js)

## Demo

[./demo/study/probe/sweepProbeDemo.ipynb](../../../../demo/study/probe/sweepProbeDemo.ipynb)

## Construction
		
A new ![](../../../../icons/sweepProbe.png) SweepProbe is created either by: 

* using the context menu of a ![](../../../../icons/data.png) [Data](../../data/data.md) atom in the [Tree View](../../../views/treeView.md) or
* calling the corresponding factory method of the ![](../../../../icons/data.png) [Data](../../data/data.md) atom in the source code of the [Editor view](../../../views/editorView.md):

```javascript
    ...
    let sweepProbe = data.createSweepProbe();	     
```

## Sections

### Domain

#### Domain label

#### Domain range

### First family

#### Legend for first family

#### Range for first family

### Second family

#### Legend for second family

#### Range for second family

### Probe

#### Probe label

#### Sweep output

#### First probe table

#### One based column index

#### One based row index

----

![](../../../../icons/pickingProbe.png) [PickingProbe](./pickingProbe.md)

