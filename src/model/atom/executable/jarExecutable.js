import Executable from './executable.js';

export default class JarExecutable extends Executable {

	constructor( name) {
		super(name);
		this.image = 'java.png';
        this.jvmArgument = undefined;
        this.jarPath = undefined;
        this.fullClassName = undefined;
	}


	 copy() {
		//TODO
	}

	createExecutableSection(page) {
		Section executable = dataPage.createSection("javaExecutable", executableHelpContextId).setLabel(
				"Java executable");

		Image resetImage = Activator.getImage("resetJobIndex.png");
		executable.createSectionAction("resetJobIndex", "Reset the job index to 1", () -> resetJobIndex(), resetImage);
		executable.createSectionAction("action", "Run external executable", () -> execute(treeViewRefreshable));

		FilePath filePath = executable.createFilePath(executablePath, this, "Path to java.exe",
				"D:/EclipseJava/App/jdk1.8/bin/java.exe");
		filePath.addModificationConsumer("updateStatus", updateStatusListener);

	}

	modifyModel() {

		AbstractAtom<?> root = this.getModel();
		Page dataPage = (Page) root.getChild("data");

		Consumer updateStatusConsumer = () -> refreshStatus();

		createClassPathSection(dataPage, updateStatusConsumer, null);
		createJvmArgumentsSection(dataPage, updateStatusConsumer, null);

	}

	createClassPathSection(page) {

		const section = page
				.createSection("classPath", executableHelpContextId) //
				.setLabel("Jar (class path)");
		section.moveAtom(1);

		FileOrDirectoryPath classPathChooser = section.createFileOrDirectoryPath(jarPath, this,
				"Path to jar file (that provides main class)", "");
		classPathChooser.addModificationConsumer("updateStatus", updateStatusListener);

		TextField fullClassNameField = section.createTextField(fullClassName, this, "");
		fullClassNameField.setLabel("Full name of main class");
		fullClassNameField.addModificationConsumer("updateStatus", updateStatusListener);
	}

	createJvmArgumentsSection(page) {

		Section section = dataPage
				.createSection("jvmArguments", executableHelpContextId) //
				.setLabel("JVM arguments");
		section.moveAtom(2);

		TextArea jvmField = section.createTextArea(jvmArgument, this);
		jvmField.setLabel("Arguments for tweaking Java Virtual Maschine");

		jvmField.addModificationConsumer("updateStatus", updateStatusListener);
		jvmField.setHelpId("org.eclipse.ui.ide.jvmArguments");

	}



	buildCommand() {
		let command = "cmd.exe /C start /b /wait /low \"" + executablePath + "\"";

		command = this.addJavaArguments(command);
		command = this.addInputArguments(command);
		command = this.addOutputArguments(command);
		command = this.addLoggingArguments(command);

		return command;
	}

	addJavaArguments(commandToExtend) {
		String command = commandToExtend;
		boolean jvmArgumentsIsEmpty = jvmArgument.get().isEmpty();
		if (!jvmArgumentsIsEmpty) {
			command += " " + jvmArgument.get();
		}

		boolean classPathArgsIsEmplty = jarPath.get().isEmpty();
		if (!classPathArgsIsEmplty) {
			command += " -cp " + jarPath.get();
		}

		boolean classFullNameArgsIsEmpty = fullClassName.get().isEmpty();
		if (!classFullNameArgsIsEmpty) {
			command += " " + fullClassName.get();
		}
		return command;
	}

	refreshStatus() {
		AbstractUiSynchronizingAtom.runUiTaskNonBlocking(() -> {
			String infoTextMessage = buildCommand();
			// LOG.debug("Updating info text: " + infoTextMessage);
			commandInfo.set(infoTextMessage);

			Wrap<String> infoTextWrap = (Wrap<String>) executionStatusInfo;
			InfoText executionStatusInfoText = (InfoText) infoTextWrap.getAttribute();
			executionStatusInfoText.resetError();
			executionStatusInfoText.set("Not yet executed");

			jobIndexInfo.set("" + getJobId());
		});

	}

	//#end region

	//#end region

}
