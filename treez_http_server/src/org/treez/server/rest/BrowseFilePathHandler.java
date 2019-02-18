package org.treez.server.rest;

import java.awt.FileDialog;

import javax.swing.JFrame;

import com.sun.net.httpserver.HttpServer;

public class BrowseFilePathHandler extends AbstractHttpQueryHandler {
		
	//#region ATTRIBUTES
	
	private static JFrame frame=null;
	
	//#end region
	
	
	//#region CONSTRUCTORS

	private BrowseFilePathHandler(String urlPrefix) {
		super(urlPrefix);		
	}
	
	//#end region
	
	//#region METHODS
	
	public static void create(String urlPrefix, HttpServer server) {
		server.createContext(urlPrefix, new BrowseFilePathHandler(urlPrefix));		
	}		

	protected String result(String initialDirectory)  {			
		
		var fileDialog = new FileDialog(getFrame(), "Choose a file", FileDialog.LOAD);
		fileDialog.setIconImage(getDialogIcon());
		
		if (initialDirectory!=null) {
			fileDialog.setDirectory(initialDirectory);
		}
		
		fileDialog.setAlwaysOnTop(true);	
		fileDialog.setLocationByPlatform(true);
		fileDialog.setVisible(true);	
				
		var file = fileDialog.getFile();
		if(file != null) {
			var directory = fileDialog.getDirectory();
			var path =  directory + file;
			return path.replace("\\", "/");
		} else {
			return "";
		}			
	}	
	
	//#end region
	
	//#region ACCESSORS
	
	private static JFrame getFrame() {
		
		if(frame==null) {
			frame = new JFrame();
			frame.setAlwaysOnTop(true);
	        frame.setLocationByPlatform(true);
		}
		return frame;
	}
	
	//#end region

}
