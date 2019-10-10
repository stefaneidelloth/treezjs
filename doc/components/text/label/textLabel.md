[Components](../components.md)

----

# TextLabel
		
The TextLabel component allows to show some text.  
	
![](../../../images/treezTextLabel.png)
		
## Source code

[./src/components/textLabel/treezTextLabel.js](../../../../src/components/textLabel/treezTextLabel.js)

## Test

[./test/components/textLabel/treezTextLabel.test.js](../../../../test/components/textLabel/treezTextLabel.test.js)

## Demo

[./demo/components/textLabel/treezTextLabelDemo.html](../../../../demo/components/textLabel/treezTextLabelDemo.html)

## Construction

```javascript
    ...
    sectionContent.append('treez-text-label')
		  .value('Hello world');	
   ...
```

## JavaScript Attributes

### value

The label text.

### hidden

The hidden state as a boolean value.


## HTML String Attributes

### value

The label text.

### hidden

If you want to **show** the label:

* Do not specify the 'hidden' attribute in the html tag (e.g. <treez-label value="Hello world" ></treez-label>) or

* Use element.setAttribute('hidden', null)) 

If you want to **hide** the label:

* Specify the 'hidden' attribute in the html tag (e.g. <treez-label value="Hello world" hidden></treez-label>). 
An assigned value is ignored and always interpreted as true (e.g. hidden = '' or hidden = null or hidden = 'true' or 
hidden = 'False'). Only the existance matters.

* Use element.setAttribute('hidden','') or set it to any other value not equal to null.


----

[Components](../components.md)
