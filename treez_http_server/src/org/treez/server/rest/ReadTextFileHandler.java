package org.treez.server.rest;

import java.nio.charset.MalformedInputException;
import java.nio.file.Files;
import java.nio.file.Path;

import com.sun.net.httpserver.HttpServer;

public class ReadTextFileHandler extends AbstractHttpQueryHandler {
		
	private ReadTextFileHandler(String urlPrefix) {
		super(urlPrefix);		
	}		
	
	public static void create(String urlPrefix, HttpServer server) {
		server.createContext(urlPrefix, new ReadTextFileHandler(urlPrefix));		
	}		

	protected String result(String filePath)  {	
		
		try {			
			return Files.readString(Path.of(filePath));	
		} catch(MalformedInputException exception) {
			return ERROR + "Please check the format of the text file. It has to be UTF8. " + exception;
		} catch(Exception exception) {
			return ERROR + exception;
		}   	
			
	}	
	
	
}
