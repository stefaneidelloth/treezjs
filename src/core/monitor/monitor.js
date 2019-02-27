import MonitorConsole from './monitorConsole.js';

export default class Monitor {

	get isDone() {
		if (this.__totalWork === undefined) {
			return false;
		}

		return this.__finishedWork >= this.__totalWork;
	}
	
	constructor(title, treeView, totalWork, id, parentMonitor, coveredWorkOfParentMonitor) {		
		this.id = id;
		this.title = title;
		
		this.isCanceled = false;
        this.hasIssue = false;
        
		this.__description = '';
				
		this.__treeView = treeView;
		this.__parent = parentMonitor;
		this.__children = [];        
		
		this.__totalWork = totalWork;
		
		if(coveredWorkOfParentMonitor===undefined){
			this.__coveredWorkOfParentMonitor = totalWork;
		} else {
			this.__coveredWorkOfParentMonitor = coveredWorkOfParentMonitor;
		}		
		
		this.__workCoveredByChildren = 0.0;
		this.__finishedWork = 0.0;			
		
	    this.__logger = undefined;       

        this.__propertyChangedListeners = [];
        this.__childCreatedListeners = [];	
        
        this.__consoleMap = {};
        this.__console = this.__createConsole(title, id);
	}

	showInMonitorView() {		
		var monitorView = this.__treeView.provideMonitorView();
		monitorView.setMonitor(this);
	}

	

	createChild(title, id, coveredWorkOfParentMonitor, totalWork) {

		this.__assertTotalWorkHasBeenSet();
		this.__assertChildWorkIsNotTooLarge(coveredWorkOfParentMonitor);

		this.__workCoveredByChildren += coveredWorkOfParentMonitor;
		
		var subMonitor = new Monitor(title, totalWork, id, this, coveredWorkOfParentMonitor);
		this.__children.add(subMonitor);
		
		this.__triggerChildCreatedListeners(subMonitor);
		return treezSubMonitor;
	}

	createChildWithoutTotal(title, id, coveredWorkOfParentMonitor) {

		this.__assertTotalWorkHasBeenSet();
		this.__assertChildWorkIsNotTooLarge(coveredWorkOfParentMonitor);

		//TODO
		//Add Id to logging context, also see http://www.baeldung.com/java-logging-ndc-log4j
		//ThreadContext.put("id", id);

		this.workCoveredByChildren += coveredWorkOfParentMonitor;
		var subMonitor = new TreezMonitor(title, null, id, this, coveredWorkOfParentMonitor);
		this.__children.add(subMonitor);
		this.__triggerChildCreatedListeners(subMonitor);
		return treezSubMonitor;
	}

	__assertChildWorkIsNotTooLarge(coveredWorkOfParentMonitor) {

		var workNotCoveredByChildren = this.__totalWork - this.__workCoveredByChildren;
		if (coveredWorkOfParentMonitor > workNotCoveredByChildren) {
			var message = "The parent monitor does not have enough uncovered work to create the child ("
					+ this.__coveredWorkOfParentMonitor + " > " + workNotCoveredByChildren + ")";
			throw new Error(message);
		}

		var freeWork = this.__totalWork - this.__finishedWork;
		if (coveredWorkOfParentMonitor > freeWork) {
			var message = "The parent monitor does not have enough free work to create the child ("
					+ coveredWorkOfParentMonitor + " > " + freeWork + ")";
			throw new Error(message);
		}
	}

	worked(workIncrement) {

		this.__assertTotalWorkHasBeenSet();

		if (this.isDone) {
			return;
		}

		this.__assertWorkIncrementIsNotTooLarge(workIncrement);

		this.__finishedWork += workIncrement;

		this.__incrementParentWork(workIncrement);
		
		this.__triggerPropertyChangedListeners();
	}

	__assertWorkIncrementIsNotTooLarge(workIncrement) {
		if (this.__finishedWork + workIncrement > this.__totalWork) {
			var message = "The work increment " + workIncrement + " is too large. The finished work "
					+ (this.__finishedWork + workIncrement) + " would be greater than the total work " + this.__totalWork;
			throw new Error(message);
		}
	}

	__incrementParentWork(workIncrement) {
		var workIncrementForParent = 1.0 * this.workIncrement / this.__totalWork * this.__coveredWorkOfParentMonitor;

		if (this.__parent) {
			this.__parent.worked(workIncrementForParent);
		} 
	}	
	

	done() {
		this.__assertTotalWorkHasBeenSet();

		var workIncrement = this.__totalWork - this.__finishedWork;
		this.__finishedWork = this.__totalWork;		
		
		this.__triggerPropertyChangedListeners();
		this.__incrementParentWork(workIncrement);
	}

	close() {
		this.cancel();
		//TODO
		//NDC.pop();
	}

	__assertTotalWorkHasBeenSet() {
		if (this.__totalWork == undefined) {
			throw new Error("Total work must be set before calling this method.");
		}
	}

	cancelAll() {
		this.cancel();
		if (this.__parent) {
			this.__parent.cancel();
		}
	}

	cancel() {
		if (this.isDone) {
			return;
		}
		this.isCanceled = true;
		this.__children.forEach(
			(child)=>child.cancel()
		);
				
		this.__triggerPropertyChangedListeners();
	}

	markIssue() {
		this.hasIssue = true;
		this.__triggerPropertyChangedListeners();
	}

	__createConsole(title, id) {
		
		var monitorView = this.__treeView.provideMonitorView();
		
		var loggingPanel = monitorView.getLoggingPanel();
		
		var monitorConsole = new MonitorConsole(loggingPanel);		
		
		this.__registerConsole(id, monitorConsole);		
		
		return monitorConsole;
	}

	addPropertyChangedListener(listener) {
		this.__propertyChangedListeners.push(listener);
	}

	__triggerPropertyChangedListeners() {
		this.__propertyChangedListeners.forEach(
				(listener)=>listener()
		);		
	}

	addChildCreatedListener(listener) {
		this.__childCreatedListeners.push(listener);
	}

	__triggerChildCreatedListeners(newChild) {
		this.__childCreatedListeners.forEach(
				(listener)=>listener(newChild)
		);		
	}


	__registerConsole(id, console) {
		this.__consoleMap[id] = console;
	}

	__unRegisterConsole(id) {
		this.__consoleMap[id] = undefined;
	}

	getConsole(id) {
		return this.__consoleMap[id];
	}

	

	setDescription(description) {
		this.__description = description;
		
		//TODO
		//if (rootMonitor != null) {
		//	rootMonitor.setTaskName(description);
		//}
		this.__triggerPropertyChangedListeners();
	}

	getDescription() {
		return this.__description;
	}

	setTotalWork(totalWork) {
		if (this.__totalWork === undefined) {
			this.__totalWork = totalWork;
		} else {
			throw new Error("Total work must only be set once");
		}
	}	

	

	getProgressInPercent() {

		if (this.__totalWork === undefined || this.__totalWork === 0) {
			return 0;
		}
		var progressInPercent = 1.0 * this.__finishedWork / this.__totalWork * 100;
		return Math.floor(progressInPercent);
	}

	getChildren() {
		return this.__children;
	}

	getConsole() {
		return this.__console;
	}

	getOutputStream() {
		return this.__console.newOutputStream();;
	}

	isChildCanceled() {
		var result = false;
		this.__children.every((child)=>{
			if (child.isCanceled() || child.isChildCanceled()) {
				result=true
				return false;
			}
			return true;
		});
		
		return result;
	}

	//#end region

}
