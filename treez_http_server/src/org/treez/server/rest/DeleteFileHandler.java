package org.treez.server.rest;

import java.io.File;

import com.sun.net.httpserver.HttpServer;

public class DeleteFileHandler extends AbstractHttpQueryHandler {
		
	private DeleteFileHandler(String urlPrefix) {
		super(urlPrefix);		
	}		
	
	public static void create(String urlPrefix, HttpServer server) {
		server.createContext(urlPrefix, new DeleteFileHandler(urlPrefix));		
	}		

	//Deletes the given file if it exists
	//If the file has been successfully deleted or if the file does not exist
	//"#Succeeded" is returned. 
	//Otherwise an error message is returned. 
	protected String result(String filePath)  {	
		
		try {
			var file = new File(filePath);
			file.delete();			
			return SUCCEEDED; 
					
		} catch (Exception exception) {
			return ERROR + "Could not delete file '" + filePath + "'.\n" + exception.getMessage();
		}
		
	}	
	
	
}
