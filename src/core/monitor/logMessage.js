export default class LogMessage {
	
	get stackTrace(){
		
		var lines = this.__stackTrace.split('\n');
		
		var htmlContent = '';
		
		for(var line of lines){

			var parts = line.split('(http');

			if(parts.length ===1){
				htmlContent = htmlContent + parts[0] + '<br>';
			} else {
				var title = '<span>' + parts[0] + '</span>';

				var location = 'http' + parts[1].substring(0, parts[1].length-1);

				var separatorIndex = location.lastIndexOf(':');

				var columnNumberString = location.substring(separatorIndex+1);

				location = location.substring(0, separatorIndex);

				separatorIndex = location.lastIndexOf(':');

				var lineNumberString = location.substring(separatorIndex+1);

				var url = location.substring(0, separatorIndex);

				var shortUrl = url.replace('http://localhost:8080','');

				shortUrl = shortUrl.replace('http://localhost:8888/files','');

				var shortLocation = shortUrl + ':' + lineNumberString + ':' + columnNumberString;

				var openCommand = "'start notepad++ ." + shortUrl + " -n" + lineNumberString+ " -c" + columnNumberString + "'"
				
				var link = '<a onclick="window.treezTerminal.execute('+ openCommand +')">' + shortLocation + '</a>';

				htmlContent = htmlContent + title + link + '<br>';
			}
			
			
			
		}
		
		return htmlContent;
	}

	constructor(text, level, stackTrace){
		this.time = Date.now();
		this.text = text;
		this.level = level;
		this.color = this.__determineColor(level);
		this.__stackTrace = stackTrace;
		
	}	
	
	
	__determineColor(level){
		switch(level){
		case 'info':
			return 'black';			
		case 'warn':
			return 'orange';
		case 'error':
			return 'red';		
		}
	}

}
