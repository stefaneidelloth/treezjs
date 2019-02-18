package org.treez.server.websocket;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.ArrayList;
import java.util.List;

public abstract class AbstractWebSocketServer {

	// #region ATTRIBUTES

	private boolean isRunning = true;

	private ServerSocket serverSocket;

	private List<AbstractServerThreadHandlingOneClient> serverThreads;

	// #end region

	// #region CONSTRUCTORS

	public AbstractWebSocketServer(int portNumber) {
		createServerSocket(portNumber);
		System.out.println("Started web socket server on port " + portNumber);
		handleClients();
	}

	// #end region

	// #region METHODS

	

	private void createServerSocket(int portNumber) {

		try {
			serverSocket = new ServerSocket(portNumber);
		} catch (IOException exception) {
			throw new IllegalStateException("Could not create socket", exception);
		}
		/*
		 * char[] storepass = "newpass".toCharArray(); char[] keypass =
		 * "wshr.ut".toCharArray(); String storename = "newstore";
		 * 
		 * try { SSLContext context = SSLContext.getInstance("TLS"); KeyManagerFactory
		 * kmf = KeyManagerFactory.getInstance("SunX509"); FileInputStream fin = new
		 * FileInputStream(storename); KeyStore ks = KeyStore.getInstance("JKS");
		 * ks.load(fin, storepass);
		 * 
		 * kmf.init(ks, keypass); context.init(kmf.getKeyManagers(), null, null);
		 * SSLServerSocketFactory ssf = context.getServerSocketFactory();
		 * 
		 * socket = ssf.createServerSocket(portNumber); } catch(Exception exception) {
		 * throw new IllegalStateException("Could not create socket", exception); }
		 */
	}

	private void handleClients() {
		serverThreads = new ArrayList<>();

		while (isRunning) {
			System.out.println("Waiting for client to connect...");
			Socket clientSocket = waitForClient();
			System.out.println("Connected to client.");
			var serverThread = createServerThread(clientSocket);
			serverThreads.add(serverThread);
			serverThread.start();
			
			var threadIterator = serverThreads.iterator();

			while (threadIterator.hasNext()) {
			    var thread = threadIterator.next();			    
			    if (!thread.isAlive()) {
			    	threadIterator.remove();
				}		   
			}
			
		}
	}
	
	protected abstract AbstractServerThreadHandlingOneClient createServerThread(Socket clientSocket);

	public void terminate() {
		this.isRunning = false;

		serverThreads.forEach((thread) -> {
			thread.terminate();
		});
	}

	private Socket waitForClient() {
		Socket clientSocket;
		try {
			clientSocket = serverSocket.accept(); // waits until a client connects
		} catch (IOException waitException) {
			throw new IllegalStateException("Could not wait for client connection", waitException);
		}
		return clientSocket;
	}

	// #end region
}