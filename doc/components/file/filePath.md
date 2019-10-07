[Components](../components.md)

----

# FilePath
		
The FilePath component allows to select the path to a file. 
	
![](../../images/treez_file_path.png)

* Click on the browse button ![](../../../icons/browse.png) to open a selection dialog or

* Manually enter the path in the text field. 

* Click on the play button ![](../../../icons/run_triangle.png) to open/execute the file.
		
## Source code

[./src/components/file/treezFilePath.js](../../../src/components/file/treezFilePath.js)

## Test

[./test/components/file/treezFilePath.test.js](../../../test/components/file/treezFilePath.test.js)

## Demo

[./demo/components/file/treezFilePathDemo.html](../../../demo/components/file/treezFilePathDemo.html)

## Construction

```javascript
    ...
    sectionContent.append('treez-file-path')
		  .label('File:')		
		  .value('C:\')
		  .nodeAttr('pathMapProvider', this)
		  .bindValue(this, () => this.filePath);	
   ...
```

## JavaScript Attributes

### value

The file path as a string. If a pathMapProvider is given, the file path might be a relative path.  

### pathMapProvider

A pathMapProvider is an object that has an attribute 'pathMap'. The pathMap itself is a dictionary, mapping
from directory names to directory paths, e.g.

```javascript
{
  'workingDir': 'C:/myProject',
  'imageDir': '{$workingDir$}/images'
}
```

If you select a file and the path of that file includes a path from the pathMap (e.g. 'C:/myProject'), the corresponding name (e.g. 'workingDir') is injected and thus, a relative path will be shown (e.g. '{$workingDir$}/foo.txt').  


### fullPath

Returns the full/absolute path of the file (the 'value' attribute might contain a relative path).

### fullDirectory

Returns the full/absolute path of the directory that contains the file.

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

The file path as a string. If a pathMapProvider is given, the file path might be a relative path.  

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

[FillStyle](../fillStyle/fillStyle.md)
