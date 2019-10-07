[Components](../components.md)

----

# FileOrDirectoryPath
		
The FileOrDirectoryPath component allows to select the path of a file or directory. 
	
![](../../images/treez_file_or_directory_path.png)

* Toggle the **selection mode** with the mode toggle button:

  * ![](../../../icons/fileToggle.png): file selection mode

  * ![](../../../icons/directoryToggle.png): directory selection mode

(Unfortunately, Google Chrome does not provide a dialog that allows to select both, files and directories. Therefore, we need to toggle the mode and use seperate dialogs.)

* Click on the browse button ![](../../../icons/browse.png) to open a selection dialog or

* Manually enter the path in the text field. 

* Click on the play button ![](../../../icons/run_triangle.png) to open/execute the file or directory.
		
## Source code

[./src/components/file/treezFileOrDirectoryPath.js](../../../src/components/file/treezFileOrDirectoryPath.js)

## Test

[./test/components/file/treezFileOrDirectoryPath.test.js](../../../test/components/file/treezFileOrDirectoryPath.test.js)

## Demo

[./demo/components/file/treezFileOrDirectoryPathDemo.html](../../../demo/components/file/treezFileOrDirectoryPathDemo.html)

## Construction

```javascript
    ...
    sectionContent.append('treez-file-or-directory-path')
		  .label('File path')		
		  .value('C:\test.txt')
		  .nodeAttr('pathMapProvider', this)
		  .bindValue(this, () => this.fileOrDirectoryPath);	
   ...
```

## JavaScript Attributes

### value

The path as a string. If a pathMapProvider is given, the path might be a relative path.  

### pathMapProvider

A pathMapProvider is an object that has an attribute 'pathMap'. The pathMap itself is a dictionary, mapping
from directory names to directory paths, e.g.

```javascript
{
  'workingDir': 'C:/',
  'imageDir': '{$workingDir$}/images'
}
```

If you select a path that includes a path from the pathMap (e.g. 'C:/'), the corresponding name (e.g. 'workingDir') is injected and thus, a relative path will be shown (e.g. '{$workingDir$}/test.txt').  


### fullPath

Returns the full/absolute path (the 'value' attribute might contain a relative path).

### fullDirectory

Returns the full/absolute path of 

* the selected directory or 
* the directory that contains the selected file.

### fullParentDirectory

Returns the full/absolute path of 

* the parent directory of the selected directory or 
* the directory that contains the selected file.

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

The path as a string. If a pathMapProvider is given, the path might be a relative path.  

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

[FilePath](./filePath.md)


