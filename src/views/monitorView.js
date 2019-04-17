export default class MonitorView {

	constructor(mainViewModel, dTreez){
		this.__mainViewModel = mainViewModel;
		this.__dTreez = dTreez;
		this.__content = undefined;
		this.__progressPanel = undefined;
		this.__loggingPanel =undefined;
		this.__loggingSection = undefined;
		this.__monitor = undefined;
	}

	buildView(){    

		this.__progressPanel = this.__dTreez.select('#treez-progress')
									.className('treez-monitor-progress-panel');	

		this.__loggingPanel = this.__dTreez.select('#treez-log')
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

		var subMonitors = self.__monitor.children;

		var div = self.__progressPanel.append('div');

		//expandable for progress that has children (might be hidden to show alternative non-expandable header)
		//I first tried to use "details" & "summary"-tags. However, I want the expander only to expand with the 
		//triangle button and not with the complete summary. I did not manage to do so with the "summary"-tag. 
		//Therefore, a custom implementation based on plain divs is applied here.  
		var details = div.append('div'); 
					
		var collapsibleHeader = details.append('div') //
									   .className('treez-monitor-progress-collapsible-header');	
		
		var collapsibleSymbol = collapsibleHeader
				.append('span') //
				.className('treez-monitor-progress-collapsible-symbol')				
				.text('\u25BE ');

		var collapsibleContent = details
				.append('div') //
				.className('treez-monitor-progress-collapsible-content') //
				.classed('collapsed', true);
		
		collapsibleSymbol.onClick(() => {
			var isCollapsed = collapsibleContent.classed('collapsed');
			if (isCollapsed) {
				collapsibleContent.classed('collapsed', false);				
				collapsibleSymbol.text('\u25BE ');
			} else {
				collapsibleContent.classed('collapsed', true);			
				collapsibleSymbol.text('\u25B8 ');
			}
		});

		var nonExpandableHeader = div.append('div') //for progress that does not have children (might be hidden)
									 .className('treez-monitor-progress-collapsible-header');	
		
		self.__monitor.addChildCreatedListener((newChildMonitor) => {

			if(!collapsibleHeader.node()){
				return;
			}			
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

	__appendChildMonitor( monitor, nonExpandableHeader, expandableHeader, content, details, newChildMonitor) {
		
		var headerDisplay = expandableHeader.style('display');
				
		if (headerDisplay === 'none') {
			nonExpandableHeader.style('display', 'none');
			expandableHeader.style('display', 'block');
			this.__createHeaderNodes(expandableHeader, monitor, details);
		}

		this.__createProgressNodes(content, newChildMonitor);
	}

	__createHeaderNodes(header, monitor, details) {
		
		var self=this;
		var title = monitor.title;
		var progressInPercent = monitor.progressInPercent;
		var description = monitor.description;

		
		header.onClick((event) => {	
			monitor.showLogMessages();
		});
		
		var titleLabel = header
				.append('label') //
				.className('treez-monitor-progress-title')											
				.text(title);		

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
				var currentDescription = monitor.description;
				if (currentDescription === '') {
					descriptionLabel.text('');
				} else {
					descriptionLabel.text(': ' + currentDescription);
				}

				//update progress
				var currentProgressInPercent = monitor.progressInPercent;
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

		var subMonitors = monitor.children;

		var div = parentSelection.append('div');

		var details = div.append('div'); //expandable for progress that has children (might be hidden)
			
			
		var collapsibleHeader = details.append('div')
									.className('treez-monitor-progress-collapsible-header');	
		
		var collapsibleSymbol = collapsibleHeader //
									.append('span') //
									.className('treez-monitor-progress-collapsible-symbol') //									
									.text('\u25BE ');

		var collapsibleContent = details
				.append('div') //
				.className('treez-monitor-progress-collapsible-content') //
				.classed('collapsed', true);
		
		collapsibleSymbol.onClick(() => {
			var isCollapsed = collapsibleContent.classed('collapsed');
			if (isCollapsed) {
				collapsibleContent.classed('collapsed', false);				
				collapsibleSymbol.text('\u25BE ');
			} else {
				collapsibleContent.classed('collapsed', true);				
				collapsibleSymbol.text('\u25B8 ');
			}
		});
		
		var nonExpandableHeader = div.append('div') //for progress that does not have children (might be hidden)
									 .className('treez-monitor-progress-collapsible-header');	

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
	
	getLoggingPanel(){
		return this.__loggingPanel;
	}


}
