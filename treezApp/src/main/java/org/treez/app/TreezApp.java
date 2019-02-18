package org.treez.app;

import java.net.InetSocketAddress;

import com.sun.net.httpserver.HttpServer;

public class TreezApp {

	public static void main(final String[] args) throws Exception {
		
		var fileServerPortNumber = 8080;
		HttpServer server = HttpServer.create(new InetSocketAddress(fileServerPortNumber), 0);						
		StaticFileHandler.create(server);
		server.setExecutor(null); // creates a default executor
		server.start();
		
		JavaFxApplication.main(args);
	}

}
