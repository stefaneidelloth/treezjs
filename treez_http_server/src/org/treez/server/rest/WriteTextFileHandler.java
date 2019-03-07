package org.treez.server.rest;

import java.nio.file.Files;
import java.nio.file.Paths;

import com.sun.net.httpserver.HttpServer;

public class WriteTextFileHandler extends AbstractHttpQueryHandler {

	private WriteTextFileHandler(String urlPrefix) {
		super(urlPrefix);
	}

	public static void create(String urlPrefix, HttpServer server) {
		server.createContext(urlPrefix, new WriteTextFileHandler(urlPrefix));
	}

	protected String result(String filePathAndText) {

		try {
			var parts = filePathAndText.split("<#Separator#>");
			var filePath = parts[0];
			var text = parts[1];

			Files.writeString(Paths.get(filePath), text);
			return SUCCEEDED;

		} catch (Exception exception) {
			return ERROR + "Cold not write text file.\n" + exception.getMessage();
		}

	}

}
