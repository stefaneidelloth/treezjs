REM start cmd /c explorer d:\treezjs
d:
cd d:\treezjs
start cmd /c D:\EclipseJava\App\jdk\bin\java.exe -jar treezServer.jar
start "" "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" http://localhost:8080/
