package org.treez.server.websocket;

import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.net.Socket;

public class CommandLineServerThread extends AbstractServerThreadHandlingOneClient {

	static private boolean isCheckingConsoleOutput = false;

	private Process process;

	private PrintWriter printWriter;

	private InputStream outputStream;

	private InputStream errorStream;

	private String outputText;

	private String errorText;

	public CommandLineServerThread(Socket client) {
		super(client);
		initializeConsoleProcess();
	}

	@Override
	protected void init() {
		//sendMessageToClient("Hello from Server!");			
	}

	@Override
	protected void handleClientMessage(String message) {

		if (message == null | message.isEmpty()) {
			return;
		}

		System.out.println("Processing web socket command line command:" + message);

		var resultString = "Error";

		try {
			resultString = result(message);
		} catch (Exception exception) {
			throw new IllegalStateException("Could not execute command line command '" + message + "'", exception);
		}

	
		
		var prefix = message + "\r\n";
		if(resultString.startsWith(prefix)) {
			resultString = resultString.substring(prefix.length());
		}
		
		resultString = removeLastLine(resultString);
		resultString = removeLastLine(resultString);
		
		

		sendMessageToClient(resultString);
	}

	private String removeLastLine(String message) {
		
		var endIndex = message.lastIndexOf("\r");
		if(endIndex==-1) {
			return message;
		}
		return message.substring(0,endIndex);		
	}

	private String initializeConsoleProcess() {
		var runtime = Runtime.getRuntime();
		try {
			process = runtime.exec("cmd.exe");
		} catch (IOException e) {
			throw new IllegalStateException("Could not start command line cmd.exe");
		}

		try {
			//Connect to input, output and error stream
			printWriter = new PrintWriter(new BufferedWriter(new OutputStreamWriter(process.getOutputStream(),"UTF-8")), true);
			outputStream = process.getInputStream();
			errorStream = process.getErrorStream();
		} catch (Exception e) {
			throw new IllegalStateException("Could not connect to command line streams", e);
		}

		//wait a moment
		try {
			Thread.sleep(500);
		} catch (Exception e) {
			System.out.println("Waiting failed");
			System.exit(-1);
		}

		var output = getOutput();
		return output;
	}

	private String result(String request) throws IOException, InterruptedException {

		printWriter.println(request);

		String output = getOutput();

		System.out.println(output);

		return output;
	}

	private String getOutput() {

		String output = "";

		if (!isCheckingConsoleOutput) {

			//set global waitflag
			isCheckingConsoleOutput = true;
			//set variables
			int numberOfAvailableBytes = 1;
			int byteLength = 0;
			int errorByteLength = 0;
			boolean hasOutput = false;
			boolean hasError = false;
			outputText = "";
			errorText = "";

			int n1;
			int n2;
			int firstEndIndex;
			int secondEndIndex;

			try {
				while (numberOfAvailableBytes > 0) { //loop while console output contains data
					//set variables
					n1 = 0;
					n2 = 1;
					firstEndIndex = 0;
					secondEndIndex = 1;
					//Wait until available Bytes of output are constant
					while (n1 != n2) {	
						n1 = outputStream.available();
						Thread.sleep(50);
						n2 = outputStream.available();
					}
					//read octave output
					if (n2 > 0) {
						byte buffer[] = new byte[128];							
						int numberOfBytes = outputStream.read(buffer);
						outputText = outputText + new String(buffer,"UTF-8");
						byteLength = byteLength + numberOfBytes;
						hasOutput = true;
					}
					//Wait until available Bytes of error are constant
					while (firstEndIndex != secondEndIndex) {
						firstEndIndex = errorStream.available();
						Thread.sleep(50);
						secondEndIndex = errorStream.available();
					}
					//read errors
					if (secondEndIndex > 0) {
						byte buffer[] = new byte[128];
						int numberOfErrorBytes = errorStream.read(buffer);
						errorText = errorText + new String(buffer,"UTF-8");
						errorByteLength = errorByteLength + numberOfErrorBytes;
						hasError = true;
					}
					//check again if console has data in output streams
					numberOfAvailableBytes = outputStream.available();
					if (numberOfAvailableBytes == 0) {
						numberOfAvailableBytes = errorStream.available();
					}

				}

				if (hasOutput) {
					output += outputText.trim();
				}

				if (hasError) {
					output += "Error: " + errorText.trim();
				}

			} catch (Exception e) {
				System.out.println("Reading console output failed!");
				output += "Error: " + "Reading console output failed!";
			}

			isCheckingConsoleOutput = false;
		}

		return output;
	}

}
