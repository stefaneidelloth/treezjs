[Components](../components.md)

----

# DirectoryPath
		
The DirectoryPath component allows to select the path to a directory of the file system. 
	
![](../../images/treez_directory_path.png)

* Click on the browse button ![](../../../icons/browse.png) to open a selection dialog or

* Manually enter the path in the text field. 

* Click on the play button ![](../../../icons/run_triangle.png) to open the directory.
		
## Source code

[./src/components/file/treezDirectoryPath.js](../../../src/components/file/treezDirectoryPath.js)

## Test

[./test/components/file/treezDirectoryPath.test.js](../../../test/components/file/treezDirectoryPath.test.js)

## Demo

[./demo/components/file/treezDirectoryPathDemo.html](../../../demo/components/file/treezDirectoryPathDemo.html)

## Construction

```javascript
    ...
    sectionContent.append('treez-directory-path')
		  .label('Directory:')		
		  .value('C:\')
		  .nodeAttr('pathMapProvider', this)
		  .bindValue(this, () => this.directoryPath);	
   ...
```

## JavaScript Attributes

### value

The directory path as a string. If a pathMapProvider is given, the directory path might be a relative path.  

### pathMapProvider

A pathMapProvider is an object that has an attribute 'pathMap'. The pathMap itself is a dictionary, mapping
from directory names to directory paths, e.g.

```javascript
{
  'workingDir': 'C:/myProject',
  'imageDir': '{$workingDir$}/images'
}
```

If you select a directory and the path of that directory includes a path from the pathMap (e.g. 'C:/myProject'), the corresponding name (e.g. 'workingDir') is injected and thus, a relative path will be shown (e.g. '{$workingDir$}/foo').  

### fullDirectory

Returns the full/absolute path of the directory (the 'value' attribute might contain a relative path).

### fullParentDirectory

Rerturns the full/absolute path to the parent directory (or null if there is no parent directry). 

### disabled

The disabled state as a boolean value. 

### hidden

The hidden state as a boolean value.

### width

The css width as a string, e.g. '500px'.

### label

Some label text. 


## HTML String Attributes

### value

The directory path as a string. 

### disabled

If you want to enable the component:

* Do not specify the 'disabled' attribute in the html tag

* Use element.setAttribute('disabled', null)) 

If you want to disable the component:

* Specify the 'disabled' attribute in the html tag, e.g. disabled = ''

* Use element.setAttribute('disabled','') or set it to any other value not equal to null. 

### hidden

If you want to show the component:

* Do not specify the 'hidden' attribute in the html tag

* Use element.setAttribute('hidden', null)) 

If you want to hide the component:

* Specify the 'hidden' attribute in the html tag, e.g. hidden = ''

* Use element.setAttribute('hidden','') or set it to any other value not equal to null. 

### width

The total css width of the component, e.g. '500px'

### label

Some label text.


----

[Double](../number/double.md)
