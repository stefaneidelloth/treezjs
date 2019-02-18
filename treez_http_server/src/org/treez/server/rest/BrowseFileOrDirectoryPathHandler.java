package org.treez.server.rest;

import java.awt.Frame;
import java.io.File;

import javax.swing.JFileChooser;
import javax.swing.UIManager;

import com.sun.net.httpserver.HttpServer;

public class BrowseFileOrDirectoryPathHandler extends AbstractHttpQueryHandler {
	
	//
	

	//#region CONSTRUCTORS

	private BrowseFileOrDirectoryPathHandler(String urlPrefix) {
		super(urlPrefix);
	}

	//#end region

	//#region METHODS

	public static void create(String urlPrefix, HttpServer server) {
		server.createContext(urlPrefix, new BrowseFileOrDirectoryPathHandler(urlPrefix));
	}

	protected String result(String initialDirectory) {

		try {
			UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
		} catch (Exception e) {
			e.printStackTrace();
		}

		var fileDialog = new JFileChooser();
		fileDialog.setFileSelectionMode(JFileChooser.FILES_AND_DIRECTORIES);

		if (initialDirectory != null) {
			fileDialog.setCurrentDirectory(new File(initialDirectory));
		}

		var frame = new Frame();
		frame.setIconImage( getDialogIcon());		
		
		fileDialog.showOpenDialog(frame);

		var file = fileDialog.getSelectedFile();
		if (file != null) {
			var path = file.getAbsolutePath();
			return path.replace("\\", "/");
		} else {
			return "";
		}
	}	
	
	//#end region
	
	

}
