import Enum from './../../components/enum.js';

export default class DirectoryCleanupMode extends Enum {}
  
if(window.DirectoryCleanupMode){
	DirectoryCleanupMode = window.DirectoryCleanupMode;
} else {
	DirectoryCleanupMode.deleteFiles = new DirectoryCleanupMode('deleteFiles');                    
	DirectoryCleanupMode.deleteFilesAndSubDirectories = new DirectoryCleanupMode('deleteFilesAndSubDirectories');                    
	DirectoryCleanupMode.deleteDirectory = new DirectoryCleanupMode('deleteDirectory');                    
	
	window.DirectoryCleanupMode = DirectoryCleanupMode;
}