package org.treez.server.rest;

import java.io.File;

import javax.swing.JFileChooser;
import javax.swing.JFrame;

import com.sun.net.httpserver.HttpServer;

public class BrowseDirectoryPathHandler extends AbstractHttpQueryHandler {
	
	//#region ATTRIBUTES
	
	private static JFrame frame=null;
	
	//#end region
	

	//#region CONSTRUCTORS

	private BrowseDirectoryPathHandler(String urlPrefix) {
		super(urlPrefix);
	}

	//#end region

	//#region METHODS

	public static void create(String urlPrefix, HttpServer server) {
		server.createContext(urlPrefix, new BrowseDirectoryPathHandler(urlPrefix));
	}

	protected String result(String initialDirectory) {
		
		var dialog = new JFileChooser();
		dialog.setDialogTitle("Please select a directory:");
		dialog.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);

		if (initialDirectory != null) {
			dialog.setCurrentDirectory(new File(initialDirectory));
		}			
		
		dialog.showOpenDialog(getFrame());

		var file = dialog.getSelectedFile();
		if (file != null) {
			var path = file.getAbsolutePath();
			return path.replace("\\", "/");
		} else {
			return "";
		}
	}	
	
	//#end region
	
	//#region ACCESSORS
	
	private static JFrame getFrame() {
		if (frame == null) {			
			
			frame = new JFrame();
			frame.setIconImage(getDialogIcon());				
			
		}
		return frame;
	}
	
	//#end region
	
	

}
