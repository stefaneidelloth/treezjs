[Components](../components.md)

----

# DirectoryPath
		
The DirectoryPath component allows to select the path to a directory of the file system. 
	
![](../../images/treezDirectoryPath.png)

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

### Inherited attributes

Also see the attributes that are inherited from [LabeledTreezElement](../labeledTreezElement.md#value).


## HTML String Attributes

### value

The directory path as a string. 

### Inherited attributes

Also see the attributes that are inherited from [LabeledTreezElement](../labeledTreezElement.md#value-1).


----

[Double](../number/double.md)
