package org.treez.server;

import java.net.InetSocketAddress;

import javax.swing.JFrame;
import javax.swing.UIManager;

import org.treez.server.rest.BrowseDirectoryPathHandler;
import org.treez.server.rest.BrowseFileOrDirectoryPathHandler;
import org.treez.server.rest.BrowseFilePathHandler;
import org.treez.server.rest.StaticFileHandler;
import org.treez.server.websocket.WebSocketServer;

import com.sun.net.httpserver.HttpServer;

public class TreezServer {

	//#region ATTRIBUTES

	private static int fileServerPortNumber = 8080;

	private static int consoleSocketPortNumber = 8001;

	//#end region

	//#region CONSTRUCTORS

	public TreezServer() {

	}

	//#end region

	//#region METHODS

	public static void main(String[] args) throws Exception {
	
	    setLookAndFeel();

		var httpServer = HttpServer.create(new InetSocketAddress(fileServerPortNumber), 0);

		StaticFileHandler.create("/", httpServer);
		BrowseFilePathHandler.create("/browseFilePath", httpServer);
		BrowseDirectoryPathHandler.create("/browseDirectoryPath", httpServer);
		BrowseFileOrDirectoryPathHandler.create("/browseFileOrDirectoryPath", httpServer);

		startHttpServer(httpServer);

		new WebSocketServer(consoleSocketPortNumber);
	}

	private static void setLookAndFeel() {
		try {
			var systemLookAndFeel = UIManager.getSystemLookAndFeelClassName();
			UIManager.setLookAndFeel(systemLookAndFeel);	
			JFrame.setDefaultLookAndFeelDecorated(true);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
	}

	private static void startHttpServer(HttpServer httpServer) {
		httpServer.setExecutor(null); // creates a default executor
		httpServer.start();
		System.out.println("Started http server on port " + fileServerPortNumber);
	}

	//#end region

}