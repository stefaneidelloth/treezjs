package org.treez.server.websocket;

import java.net.Socket;

public class WebSocketServer  extends AbstractWebSocketServer {

	
	public WebSocketServer(int portNumber)  {
		super(portNumber);
	}

	protected AbstractServerThreadHandlingOneClient createServerThread(Socket client) {
		return new CommandLineServerThread(client);
	}
	
}