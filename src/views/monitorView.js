export default class MonitorView {

	constructor(){
		this.__dTreez = undefined;
		this.__content = undefined;
		this.__progressPanel = undefined;
		this.__loggingPanel =undefined;
		this.__loggingSection = undefined;
		this.__monitor = undefined;
	}

	buildView(element, mainViewModel, dTreez){
        
        this.__dTreez = dTreez;		

		var parentSelection = dTreez.select(element);		
		this.__buildContent(parentSelection);
	}	

	__buildContent(parentSelection) {

		var progressHost = parentSelection.append('div')
			.className('treez-monitor-progress-host');
		
		progressHost.append('span')
			.text('Progress');
		
		this.__progressPanel = progressHost.append('div')
		.className('treez-monitor-progress-panel');	

		var loggingHost = parentSelection.append('div')
			.className('treez-monitor-logging-host');
			
		loggingHost.append('span')
			.text('Log messages');	
		
		this.__loggingPanel = loggingHost.append('div')
			.className('treez-monitor-logging-panel');	
		
	}	
	
	setMonitor(monitor) {
		this.__monitor = monitor;
		this.__updateProgressTree();		
	}

	__updateProgressTree() {
		
		var self=this;
		
		self.__progressPanel.selectAll('div').remove();
		
		if(!self.__monitor){
			return;
		}		

		var subMonitors = self.__monitor.getChildren();

		var div = self.__progressPanel.append('div');

		var details = div.append('div'); //expandable for progress that has children (might be hidden)

		var collapsibleHeader = details.append('div');

		var collapsibleSymbol = collapsibleHeader
				.append('span') //
				.className('treez-monitor-progress-collapsible-header')				
				.text('\u25BE ');

		var collapsibleContent = details
				.append('div') //
				.className('treez-monitor-progress-collapsible-content');

		collapsibleSymbol.onClick(() => {

			var isCollapsed = collapsibleContent.classed('collapsed');

			if (isCollapsed) {
				collapsibleContent.classed('collapsed', false);
				//collapsibleContent.style('display', 'block');
				collapsibleSymbol.text('\u25BE ');
			} else {
				collapsibleContent.classed('collapsed', true);
				//collapsibleContent.style('display', 'none');
				collapsibleSymbol.text('\u25B8 ');
			}

		});

		var nonExpandableHeader = div.append('div'); //for progress that does not have children (might be hidden)

		self.__monitor.addChildCreatedListener((newChildMonitor) => {			
			self.__appendChildMonitor(self.__monitor, nonExpandableHeader, collapsibleHeader, collapsibleContent, details,
						newChildMonitor);
		});

		if (subMonitors.length === 0) {
			//show non-expandable header
			collapsibleHeader.style('display', 'none');
			self.__createHeaderNodes(nonExpandableHeader, self.__monitor, null);
		} else {
			//show expandable header
			nonExpandableHeader.style('display', 'none');
			self.__createHeaderNodes(collapsibleHeader, self.__monitor, details);

			subMonitors.forEach((subMonitor)=>{
				self.__createProgressNodes(collapsibleContent, subMonitor);
			});	

		}

	}

	__appendChildMonitor( monitor, simpleHeader, expandableHeader, content, details, newChildMonitor) {

		var headerDisplay = expandableHeader.style('display');
		if (headerDisplay === 'none') {
			simpleHeader.style('display', 'none');
			expandableHeader.style('display', 'block');
			this.__createHeaderNodes(expandableHeader, monitor, details);
		}

		this.__createProgressNodes(content, newChildMonitor);
	}

	__createHeaderNodes(header, monitor, details) {
		
		var self=this;
		var title = monitor.title;
		var progressInPercent = monitor.getProgressInPercent();
		var description = monitor.getDescription();

		header.onClick(() => {
			self.__showLogMessagesForMonitor(monitor);
		});

		var titleLabel = header
				.append('label') //
				.className('treez-monitor-progress-title')				
				.text(title);

		if (details != null) {
			titleLabel.onClick(() => {
				var expandedString = details.attr('open');
				if (expandedString === null) {
					details.attr('open', 'true');
				} else {					
					details.attr('open', null);
				}

			});
		}

		var descriptionLabel = header //
				.append('label') //
				.className('treez-monitor-progress-description');
				

		if (description.length === 0) {
			descriptionLabel.text('');
		} else {
			descriptionLabel.text(': ' + description);
		}

		var right = header
				.append('span') //
				.className('treez-monitor-progress-toolbar');				

		var progressLabel = right //
				.append('span') //
				.className('treez-monitor-progress-label')
				.text('' + progressInPercent + ' %');

		var cancelButton = right //
				.append('input')
				.attr('type', 'button')
				.attr('title', 'Cancel')
				.className('treez-monitor-progress-cancel-button');
		
				

		var canceledSymbol = right //
				.append('label') //
				.text('!') //
				.className('treez-monitor-progress-canceled-symbol')				
				.attr('title', 'Canceled!');

		cancelButton.onClick(() => {
			monitor.cancel();
		});

		var progressBackground = header
				.append('div') //
				.className('treez-monitor-progress-background');
				

		var progress = progressBackground
				.append('div') //			
				.className('treez-monitor-progress-bar')
				.style('width', progressInPercent + '%');

		monitor.addPropertyChangedListener(() => {

			
				//update title
				var currentTitle = monitor.title;
				titleLabel.text(currentTitle);

				//update description
				var currentDescription = monitor.getDescription();
				if (currentDescription === '') {
					descriptionLabel.text('');
				} else {
					descriptionLabel.text(': ' + currentDescription);
				}

				//update progress
				var currentProgressInPercent = monitor.getProgressInPercent();
				progressLabel.text('' + currentProgressInPercent + ' %');
				progress.style('width', currentProgressInPercent + '%');

				//apply issue state
				if (monitor.hasIssue) {
					progress.style('background', 'linear-gradient(#f17d85, #e82734)');
				}

				//apply canceled state
				if (monitor.isCanceled) {
					cancelButton.style('display', 'none');
					canceledSymbol.style('display', 'inline');
					progress.style('background', 'linear-gradient(#eb4752, #e82734)');
				}

				//update visibility of cancel button
				if (currentProgressInPercent == 100.0) {
					cancelButton.style('display', 'none');
				}

			

		});

	}
	
	__createProgressNodes(parentSelection, monitor) {
		
		var self = this;

		var subMonitors = monitor.getChildren();

		var div = parentSelection.append('div');

		var details = div.append('div'); //expandable for progress that has children (might be hidden)

		var collapsibleHeader = details.append('div');

		var collapsibleSymbol = collapsibleHeader
				.append('span') //
				.style('text-size', '14px') //
				.text('\u25BE ');

		var collapsibleContent = details
				.append('div') //
				.style('padding-left', '10px');

		collapsibleSymbol.onClick(() => {

			var isCollapsed = collapsibleContent.classed('collapsed');

			if (isCollapsed) {
				collapsibleContent.classed('collapsed', false);
				collapsibleContent.style('display', 'block');
				collapsibleSymbol.text('\u25BE ');
			} else {
				collapsibleContent.classed('collapsed', true);
				collapsibleContent.style('display', 'none');
				collapsibleSymbol.text('\u25B8 ');
			}

		});

		var nonExpandableHeader = div.append('div'); //for progress that does not have children (might be hidden)

		monitor.addChildCreatedListener((newChildMonitor) => {			
			self.__appendChildMonitor(monitor, nonExpandableHeader, collapsibleHeader, collapsibleContent, details, newChildMonitor);	
		});

		if (subMonitors.length === 0) {
			//show non-expandable header
			collapsibleHeader.style('display', 'none');
			self.__createHeaderNodes(nonExpandableHeader, monitor, null);
		} else {
			//show expandable header
			nonExpandableHeader.style('display', 'none');
			self.__createHeaderNodes(collapsibleHeader, monitor, details);

			subMonitors.forEach(subMonitor=>{
				self.__createProgressNodes(collapsibleContent, subMonitor);
			});
		}

	}

	__showLogMessagesForMonitor(monitor) {
		
		
		this.__loggingPanel.selectAll('div').remove();		
		
		var console = monitor.getConsole();

		if (console != null) {			
			console.showMessages();						
		}		

	}
	
	getLoggingPanel(){
		return this.__loggingPanel;
	}

	

	

	//#end region

}
