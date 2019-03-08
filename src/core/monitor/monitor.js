import MonitorConsole from './monitorConsole.js';

export default class Monitor {

	get isDone() {
		if (this.__totalWork === undefined) {
			return false;
		}

		return this.__finishedWork >= this.__totalWork;
	}
	
	get isChildCanceled() {
		var result = false;
		this.__children.every((child)=>{
			if (child.isCanceled) {
				result=true
				return false; //stops every loop
			}
			
			if (child.isChildCanceled) {
				result=true
				return false; //stops every loop
			}
			
			return true; //continues every loop
		});
		
		return result;
	}	
	
	
	constructor(title, treeView, id, coveredWorkOfParentMonitor, totalWork, parentMonitor) {		
		this.id = id;
		this.title = title;
		
		this.isCanceled = false; //Represents the canceled state of this monitor, not including the child monitors! Use method isChildCanceled to check the children.  
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
              
        this.__console = this.__createConsole(title, treeView, id);
	}

	showInMonitorView() {		
		var monitorView = this.__treeView.provideMonitorView();
		monitorView.setMonitor(this);
	}

	

	createChild(title, treeView, id, coveredWorkOfParentMonitor, totalWork) {

		this.__assertTotalWorkHasBeenSet();
		this.__assertChildWorkIsNotTooLarge(coveredWorkOfParentMonitor);

		this.__workCoveredByChildren += coveredWorkOfParentMonitor;
		
		
		
		var subMonitor = new Monitor(title, treeView, id, coveredWorkOfParentMonitor, totalWork, this);
		this.__children.push(subMonitor);
		
		this.__triggerChildCreatedListeners(subMonitor);
		return subMonitor;
	}

	createChildWithoutTotal(title, treeView, id, coveredWorkOfParentMonitor) {

		this.__assertTotalWorkHasBeenSet();
		this.__assertChildWorkIsNotTooLarge(coveredWorkOfParentMonitor);

		//TODO
		//Add Id to logging context, also see http://www.baeldung.com/java-logging-ndc-log4j
		//ThreadContext.put("id", id);

		this.workCoveredByChildren += coveredWorkOfParentMonitor;
		var subMonitor = new Monitor(title, treeView, id, coveredWorkOfParentMonitor, null, parentMonitor);
		this.__children.push(subMonitor);
		this.__triggerChildCreatedListeners(subMonitor);
		return subMonitor;
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

	__assertTotalWorkHasBeenSet() {
		if (this.__totalWork == undefined) {
			throw new Error("Total work must be set before calling this method.");
		}
	}

	//Cancels the whole monitor tree: this monitor, all of its recursive child monitors and
	//all its recursive parent monitors (including their recursive children). 
	cancelAll() {
		this.cancel();
		if (this.__parent) {
			this.__parent.cancel();
		}
	}

	//Cancels this monitor and all of its recursive child monitors. 
	//This does not cancel the parent monitor! (Also see cancelAll)
	//It is due to the user to check:
	//* if a monitor has been canceled
	//* if some child of a monitor has been canceled (use the method isChildCanceled )
	//=> This way a user can decide on its own if the total process should be stopped
	//if a child process has been canceled or if the total process should continue in
	//that case. 
	cancel() {
		if(this.isCanceled){
			return;
		}
		
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

	__createConsole(title, treeView, id) {
		
		var monitorView = treeView.provideMonitorView();
		
		var loggingPanel = monitorView.getLoggingPanel();
		
		var monitorConsole = new MonitorConsole(loggingPanel);		
				
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
	
	info(message){
		this.__console.info(message);
	}
	
	warn(message){
		this.__console.warn(message);
	}
	
	error(message){
		this.__console.error(message);
	}

	setDescription(description) {
		this.__description = description;	
		this.__triggerPropertyChangedListeners();
	}

	getDescription() {
		return this.__description;
	}

	setTotalWork(totalWork) {
		if (this.__totalWork === undefined) {
			this.__totalWork = totalWork;
			this.__triggerPropertyChangedListeners();
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

	

	getOutputStream() {
		return this.__console.newOutputStream();
	}

	

	//#end region

}
