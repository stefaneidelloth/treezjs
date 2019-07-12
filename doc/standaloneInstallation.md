[Installation](./installation.md)

# Stand-alone installation

Treez consists of two parts, a JavaScript based client and a Java based server. The purpose of the
minimalistic Java based server is to allow access to the local file system and to serve the
JavaScript files for the client (=web application in the browser). 

Some special features, e.g. the interaction with python, are not supported by this installation option.
If you want treez to interact with python please see [Jupyter notebook extension](./jupyterInstallation.md).

The following instructions assume that you use windows as operation system. (Treez should also work
on other operation systems like Ubuntu but has only be tested with windows.) 

## Download source code

Use [TortoiseGit](https://tortoisegit.org/) or the [download feature of github](https://github.com/stefaneidelloth/treezjs/archive/master.zip) to download the source code from

https://github.com/stefaneidelloth/treezjs.git

## Install bower
The javascript dependencies of treez are managed with [bower](https://bower.io/). Download and install node.js
from https://nodejs.org as a prerequisite and then install bower with the package manager
of nodejs, using following console command:

>npm install -g bower

## Install javascript dependencies

* Open a console window (Press keys Win + R, enter "cmd" and click OK) 

* Navigate to the "main folder" of treez, e.g

>d:<br>
>cd D:\treezjs

* Install the javscript dependencies using bower with following console command:

>bower install

That command creates a sub folder "bower_components" and downloads the JavaScript dependencies.
If the download fails because you are behind a firewall please also see 
https://stackoverflow.com/questions/21705091/bower-behind-a-proxy

## Install Java JDK 

In order to run the Java based server, Java needs to be installed. Please download and
install Java JDK, for example from https://jdk.java.net/12/

## Install Google Chrome 

Treez uses modern JavaScript features like ES6 modules and custom web components. Those
JavaScript features are already supported by Google Chrome but might not yet be supported
by other browsers. Treez might work with other browsers but only has been tested with
Google Chrome.

## Adapt the startup script file "startTreez.bat"

The file "startTreez.bat" in the "main folder" of treez needs to be adapted to contain
the correct paths to the main folder, the Java JDK, and Google Chrome, e.g. 

>d:<br>
>cd D:\treezjs<br>
>start cmd /c D:\jdk12\bin\java.exe -jar treezServer.jar<br>
>start "" "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" http://localhost:8080/

## Execute "startTreez.bat" 

Double click on "startTreez.bat". The batch script starts the stand-alone server of treez and 
opens a browser window that connects to that server. 

## Trouble shooting

If you cannot see the [views](doc/views.md) of treez in your browser, please open the 
Developer Tools (F12) of your browser and check the JavaScript console for errors. 
