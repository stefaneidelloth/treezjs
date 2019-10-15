package org.treez.server.rest;

import java.io.File;

import javax.swing.JFileChooser;
import javax.swing.JFrame;

import com.sun.net.httpserver.HttpServer;

public class BrowseFileOrDirectoryPathHandler extends AbstractHttpQueryHandler {

	// #region ATTRIBUTES

	private static JFrame frame = null;

	// #end region

	// #region CONSTRUCTORS

	private BrowseFileOrDirectoryPathHandler(String urlPrefix) {
		super(urlPrefix);
	}

	// #end region

	// #region METHODS

	public static void create(String urlPrefix, HttpServer server) {
		server.createContext(urlPrefix, new BrowseFileOrDirectoryPathHandler(urlPrefix));
		
		
		
	}

	protected String result(String initialDirectory) {

		var dialog = new JFileChooser();
		dialog.setDialogTitle("Please select a file or directory:");
		dialog.setFileSelectionMode(JFileChooser.FILES_AND_DIRECTORIES);

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

	// #end region

	// #region ACCESSORS

	private static JFrame getFrame() {
		if (frame == null) {			
			
			frame = new JFrame();
			frame.setIconImage(getDialogIcon());				
			
		}
		return frame;
	}

	// #end region

}
