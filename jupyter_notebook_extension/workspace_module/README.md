# Workspace module

Looks for a JavaScript file "workspace.js" in the workspace folder (=notebook-dir) and tries to load it as ES6 module.
This works by adding the following source node to the html document body:

<script tpye="module" src="./workspace.js"></script>

The content of workspace.js can be adapted to serve your needs, e.g.

* Show an alert message:
alert('Welcome!')

* Specify the path to a javascript file in the workspace that should be executed:
import './treezjs/src/treezJupyterNotebook.js';



