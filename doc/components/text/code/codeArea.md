[Components](../components.md)

----

# CodeArea
		
The CodeArea allows to edit some source code. 
	
![](../../../images/treezCodeArea.png)
		
## Source code

[./src/components/text/code/treezCodeArea.js](../../../../src/components/text/code/treezCodeArea.js)

## Test

[./test/components/text/code/treezCodeArea.test.js](../../../../test/components/text/code/treezCodeArea.test.js)

## Demo

[./demo/components/text/code/treezCodeAreaDemo.html](../../../../demo/components/text/code/treezCodeAreaDemo.html)

## Construction

```javascript
    ...
    sectionContent.append('treez-code-area')
		  .label('Code area:')		  
		  .value('alert("Hello world!")')		
		  .bindValue(this, () => this.code);	
   ...
```

## JavaScript Attributes

### mode

In order to influcence highlighting you can choose from following modes: 'javascript' (default), 'sql' or 'python'.

### value

The source code as string. 

### Inherited attributes

Also see the attributes that are inherited from [LabeledTreezElement](../labeledTreezElement.md#value).

## HTML String Attributes

### mode

In order to influcence highlighting you can choose from following modes: 'javascript' (default), 'sql' or 'python'.

### value

The source code.

### Inherited attributes

Also see the attributes that are inherited from [LabeledTreezElement](../labeledTreezElement.md#value-1).


----

[Color](../../color/color.md)
