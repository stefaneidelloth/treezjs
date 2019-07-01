[Content](../README.md)

# Installation

## A. Stand allone

Treezjs comes with a minimal Java based server, that can be used to run treezjs in standalone mode. 
Some features, e.g. interaction with python, might not work in this mode. 

### Download source code

Use TortoiseGit or the download feature of github to download the source code from

https://github.com/stefaneidelloth/treezjs.git

### Install bower
The javascript dependencies of treezjs are managed with bower. Download and install node.js
from https://nodejs.org as a prerequisite and then install bower with the package manager
of nodejs, using following console command:

>npm install -g bower

### Install javascript dependencies

* Open a console and navigate to the "main folder" of treezjs, e.g

>d:<br>
>cd D:\treezjs

* Install the javscript dependencies using bower with following console command:

>bower install

That command creates a sub folder "bower_components" and downloads the dependencies.
If the download fails because you are behind a firewall please see 
https://stackoverflow.com/questions/21705091/bower-behind-a-proxy

### Install Java JDK (for example from https://jdk.java.net/12/ )

### Install Google Chrome (other browsers might not support the latest javascript features)

### Adapt the startup script file "startTreez.bat"

The file "startTreez.bat" in the "main folder" of treezjs needs to be adapted to contain
the correct paths to the main folder itself, Java JDK and chrome, e.g. 

>d:<br>
>cd D:\treezjs<br>
>start cmd /c D:\jdk12\bin\java.exe -jar treezServer.jar<br>
>start "" "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" http://localhost:8080/

### Execute "startTreez.bat" 

Double click on "startTreez.bat" to start the standallone server of treezjs and to open a browser
window that connects to the server. If you cannot see the views of treezjs, please open the
Developer Tools of the browser (F12) and check the console for errors. 

## B. Jupyter notebook extension

Treezjs can also be installed as an extension of the Jupyter notebook. The Jupyter notebook already
comes with a server that allows access to the file system and treezjs connects to this server.

### Install Jupyter notebook

### Install nbextensions

### Download treez source code

### Copy custeom nbextension "workspace_module"

### Initialize nbextensions
