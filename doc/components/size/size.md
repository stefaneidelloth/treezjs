[Components](../components.md)

----

# Size
		
The Size component allows to select a size in point (pt). Application examples are some font size or the with of a line. 
	
![](../../images/treezSize.png)

The available sizes are:

'0pt','0.25pt','0.5pt','1pt',<br> 
'1.5pt','2pt','3pt','4pt','5pt','6pt','8pt','10pt',<br>
'12pt','14pt','16pt','18pt','20pt',<br>
'22pt','24pt','26pt','28pt','30pt',<br>
'34pt','40pt','44pt','50pt','60pt','70pt'<br>
		
## Source code

[./src/components/size/treezSize.js](../../../src/components/size/treezSize.js)

## Test

[./test/components/size/treezSize.test.js](../../../test/components/size/treezSize.test.js)

## Demo

[./demo/components/size/treezSizeDemo.html](../../../demo/components/size/treezSizeDemo.html)

## Construction

```javascript
    ...
    sectionContent.append('treez-size')
		  .label('Size:')		  
		  .value('0.5pt')		
		  .bindValue(this, () => this.size);	
   ...
```

## JavaScript Attributes

### value

The current size as string. 

### Inherited attributes

Also see the attributes that are inherited from [LabeledTreezElement](../labeledTreezElement.md#value).


## HTML String Attributes

### value

The current size as string.

### Inherited attributes

Also see the attributes that are inherited from [LabeledTreezElement](../labeledTreezElement.md#value-1).


----

[StringList](../list/stringList.md)
