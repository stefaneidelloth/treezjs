import Model from "./model";

export default class Models extends Model {

	constructor(name) {
		super(name);
		this.isRunnable=true;
		this.image = "models.png";
	}

	copy() {
		//TODO
	}

    createVueControl(parent){
        const page = parent.append('page');

        const section = page.append('section')
			.attr('title','Models');

        section.append('label')
			.attr('text','This atom represents models.');
    }

	extendContextMenuActions(actions, treeViewer) {

		const addGenericModel = new AddChildAtomTreeViewerAction(
				GenericInputModel.class,
				"genericInputModel",
				"genericModel.png",
				this,
				treeViewer);
		actions.add(addGenericModel);

        const addExecutable = new AddChildAtomTreeViewerAction(
				Executable.class,
				"executable",
				"run.png",
				this,
				treeViewer);
		actions.add(addExecutable);

        const addJarExecutable = new AddChildAtomTreeViewerAction(
				JarExecutable.class,
				"jarExecutable",
				"java.png",
				this,
				treeViewer);
		actions.add(addJarExecutable);

		return actions;
	}

	createCodeAdaption() {
		return new RegionsAtomCodeAdaption(this);
	}

	createGenericInputModel(name) {
		const child = new GenericInputModel(name);
		addChild(child);
		return child;
	}

	createExecutable(name) {
		const child = new Executable(name);
		addChild(child);
		return child;
	}

	createJarExecutable(name) {
		const child = new JarExecutable(name);
		addChild(child);
		return child;
	}

}
