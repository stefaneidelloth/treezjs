[Components](../components.md)

----

# LabeledTreezElement
		
The LabeledTreezElement serves as a parent component. You can imagine it to consist of

* a label and
* some content

The content is created by some inheriting class. 

The LabeledTreezElement provides some attributes and methods that can be used by those inheriting components. 
LabeledTreezElement itself inherits from TreezElement and you can find all relevant attributes below. 
		
## Source code

[./src/components/labeledTreezElement.js](../../../src/components/labeledTreezElement.js)

## Test

[./test/components/labeledTreezElement.test.js](../../../test/components/labeledTreezElement.js)


## JavaScript Attributes

### value

The current value that can be edited with the component. The type of this JavaScript attribute "value" is 
determined by the implementation of the method "convertFromString" of the inheriting class. 

### disabled

The disabled state as a boolean value. 

### hidden

The hidden state as a boolean value.

### width

The total css width as a string, e.g. '500px'.

### label-width

The css width of the label as string, e.g. '100px'.

### content-width

The css width of the content as string, e.g. '300px'.

### label

Some label text that is shown before the content. 


## HTML String Attributes

### value

A string reprsentation of the current value.

### disabled

If you want to enable the component:

* Do not specify the 'disabled' attribute in the html tag (e.g. <treez-foo id="myComponent" ></treez-foo>) or

* Use element.setAttribute('disabled', null)) 

If you want to disable the component:

* Specify the 'disabled' attribute in the html tag (e.g. <treez-foo id="myComponent" disabled ></treez-foo>) or

* Use element.setAttribute('disabled','') or set it to any other value not equal to null. 

### hidden

If you want to show the component:

* Do not specify the 'hidden' attribute in the html tag (e.g. <treez-foo id="myComponent" ></treez-foo>) or

* Use element.setAttribute('hidden', null)) 

If you want to hide the component:

* Specify the 'hidden' attribute in the html tag (e.g. <treez-foo id="myComponent" hidden ></treez-foo>) or

* Use element.setAttribute('hidden','') or set it to any other value not equal to null. 

### width

The total css width of the component, e.g. '500px'.

### label-width

The css width of the label as string, e.g. '100px'.

### content-width

The css width of the content as string, e.g. '300px'.

### label

Some label text that is shown before the content. 


----

[LineStyle](../lineStyle/lineStyle.md)
