[Components](../components.md)

----

# Section
		
The Section component allows to structure the tabbed pages of the [Property View] in several collapsible reagions. 
	
![](../../images/treezSection.png)

The header of a section contains a label and a section toolbar. The section toolbar might contain several section actions.

The collapsible content of a section might contain sub sections and some components to edit values. 
		
## Source code

[./src/components/section/treezSection.js](../../../src/components/section/treezSection.js)

## Test

[./test/components/section/treezSection.test.js](../../../test/components/section/treezSection.test.js)

## Demo

[./demo/components/section/treezSectionDemo.html](../../../demo/components/section/treezSectionDemo.html)

## Construction

```javascript
    ...
    let section = page.append('treez-section')
		  .label('First section');
      
    section.append('treez-section-action')
	        .image('run.png')
	        .label('Run')
	        .addAction(()=>this.run());
      
    let sectionContent = section.append('div');
    
    sectionContent.append('treez-label')
            .label('First section content'); 	
   ...
```

## JavaScript Attributes

### label

Some label text that is shown in the section header. 

### collapsed

The collapsed state as a boolean value. 



## HTML String Attributes

### label

Some label text that is shown in the section header. 

### collapsed

If you want to **expand** the section:

* Do not specify the 'collapsed' attribute in the html tag (e.g. \<treez-section id="mySection" ></treez-section>) or

* Use section.setAttribute('collapsed', null)) 

If you want to **collapse** the section:

* Specify the 'collapsed' attribute in the html tag (e.g. \<treez-section id="myComponent" collapsed ></treez-section>). 
An assigned value is ignored and always interpreted as true (e.g. collapsed = '' or collapsed = null or collapsed = 'true' or
collapsed = 'False'). Only the existance matters. You can also:

* Use element.setAttribute('collapsed','') or set it to any other value not equal to null.


----

[Size](../size/size.md)
