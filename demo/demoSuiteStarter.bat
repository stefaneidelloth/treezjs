REM start cmd /c explorer d:\treezjs

CD ..
start cmd /c D:\EclipsePython\App\jdk\bin\java.exe -jar ./treezServer.jar
start "" "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" http://localhost:8080/demo/demoSuite.html
