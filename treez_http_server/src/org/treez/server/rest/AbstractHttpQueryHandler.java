package org.treez.server.rest;

import java.awt.image.BufferedImage;
import java.io.IOException;

import javax.imageio.ImageIO;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

public abstract class AbstractHttpQueryHandler implements HttpHandler {
	
	//#region ATTRIBUTES
	
	private String urlPrefix;
	
	private static BufferedImage dialogIcon=null;
	
	//#end region
		
		
	//#region CONSTRUCTORS

	protected AbstractHttpQueryHandler(String urlPrefix) {
		this.urlPrefix=urlPrefix;	
	}
	
	//#end region
	
	//#region METHODS
	
	
	public void handle(HttpExchange httpExchange) throws IOException {		
		
		validateRequest(httpExchange);
		
		var query = httpExchange.getRequestURI().getQuery();	
       		
        var resultString = result(query);		

		sendResponse(httpExchange, resultString);
	}

	private void validateRequest(HttpExchange httpExchange) {
		String wholeUrlPath = httpExchange.getRequestURI().getPath();
	       
        if (! wholeUrlPath.startsWith(getUrlPrefix())) {
            throw new RuntimeException("Path is not in prefix - incorrect routing?");
        }
	}	

	

	abstract String result(String query);
	
	private void sendResponse(HttpExchange httpExchange, String resultString) throws IOException {
		
		httpExchange.getResponseHeaders().set("Content-Type", "text/plain; charset=utf-8");	
		
		var response = resultString.getBytes("UTF-8");
		httpExchange.sendResponseHeaders(200, response.length);
		
		var outputStream = httpExchange.getResponseBody();
		outputStream.write(response);
		outputStream.close();
	}	
	
	//#end region
	
	//#region ACCESSORS
	
	protected String getUrlPrefix() {
		return urlPrefix;
	};
	
	protected static BufferedImage getDialogIcon() {		
		if(dialogIcon==null) {
			try {
				var url = ClassLoader.getSystemResource("tree.png");
				dialogIcon= ImageIO.read(url);
			
			} catch (IOException e) {				
				e.printStackTrace();
			}
		}		
		return dialogIcon;		
	}
	
	//#end region

}
