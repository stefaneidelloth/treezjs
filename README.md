# treezjs <img src="./icons/tree32.png">
 [Content](./README.md#content)

<img width="650" src="./doc/images/treezjs.png">

**Treez** is an open source project that helps you to create **tree based user interfaces** for (scientific) web applications. <br>The core idea of treez is to provide so-called **atoms** as building blocks and organize them in a **tree model**. 

Treez originally has been developed as [Eclipse Plugin](https://github.com/stefaneidelloth/treez). This github project provides  a **JavaScript implementation of Treez (= treezjs)** and all further development is done here.

The treezjs front end can be [installed](./doc/installation/installation.md) as an extension to [Jupyter](https://jupyter.org/) notebooks (to interact with a **Python** kernel as back end), or in standalone mode (with its own **Java** based back end). 

# Content

* [Installation](./doc/installation/installation.md)
* [User interaction](./doc/userInteraction.md)
* [Views](./doc/views/views.md)
  * [Tree](./doc/views/treeView.md)
  * [Properties](./doc/views/propertiesView.md)
  * [Editor](./doc/views/editorView.md)
  * [Graphics](./doc/views/graphicsView.md)
  * [Monitor](./doc/views/monitorView.md)
* [Atoms](./doc/atoms/atoms.md) (overview)
  * ![](./icons/root.png) [Root](./doc/atoms/root.md)
    * ![](./icons/models.png) [Models](./doc/atoms/model/models.md)
    * ![](./icons/studies.png) [Studies](./doc/atoms/study/studies.md)
    * ![](./icons/results.png) [Results](./doc/atoms/result/results.md)
  * [How to implement atoms](./doc/atoms/howToImplementAtoms.md)
* [Components](./doc/components/components.md)

# Core features

* The tree model can be **edited** with a [**Tree view**](./doc/views/treeView.md). 
* The model can also be **exported** to and **imported** from a JavaScript [**Editor view**](./doc/views/editorView.md). Thus, the tree model can also be edited and stored as a text file. 
* The properties of the atoms are shown in the [**Properties View**](./doc/views/propertiesView.md)
* Some atoms have a graphical representation ([svg](https://en.wikipedia.org/wiki/Scalable_Vector_Graphics) content created with [d3.js](https://d3js.org/)), shown in the [**Graphics view**](./doc/views/graphicsView.md)
* Some atoms can be executed and the progress of the execution is shown in terms of **progress bars** and **log messages** in the [**Monitor view**](./doc/views/monitorView.md)
* The treezjs front end can be [installed](./doc/installation/installation.md) as an extension to to [Jupyter](https://jupyter.org/) notebooks (to interact with a **Python** kernel as back end), or in standalone mode (with its own **Java** based back end). 

# Example usage

The [atoms](./doc/atoms.md) that come with treez can be used to model a **common simulation work flow**: define an exectuable model that should be run several times, define and execute a (batch) study and finally evaluate the results and plot some figures.

# Your contribution

If the already existing atoms are not sufficient for you, please feel free to reuse the **input elements** that come with treez (for example file chooser, color picker, ...) to [implement additional atoms]((./doc/atoms/howToImplementAtoms.md)) for **your own tree based GUI**. 

**Please contribute!** If every user of treez creates a single new atom and feeds it back to this open source project, a large **atom library** will arise with time. If you would like to contribute, please create a new issue ticket and describe your atom suggestions. **Bug reports and ideas on how to improve** the already existing atoms are also very welcome.

