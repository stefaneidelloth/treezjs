[Components](../components.md)

----

# TextArea
		
The TextArea component allows to specify some (multi-line) text.  
	
![](../../images/treezTextArea.png)
		
## Source code

[./src/components/textArea/treezTextArea.js](../../../src/components/textArea/treezTextArea.js)

## Test

[./test/components/textArea/treezTextArea.test.js](../../../test/components/textArea/treezTextArea.test.js)

## Demo

[./demo/components/textArea/treezTextAreaDemo.html](../../../demo/components/textArea/treezTextAreaDemo.html)

## Construction

```javascript
    ...
    sectionContent.append('treez-text-area')
		  .label('Text area:')		  
		  .value('Content of text\narea')		
		  .bindValue(this, () => this.text);	
   ...
```

## JavaScript Attributes

### value

The current text. 

### Inherited attributes

Also see the attributes that are inherited from [LabeledTreezElement](../labeledTreezElement.md#value).


## HTML String Attributes

### value

The current text.

### Inherited attributes

Also see the attributes that are inherited from [LabeledTreezElement](../labeledTreezElement.md#value-1).


----

[TExtField](./textField.md)
