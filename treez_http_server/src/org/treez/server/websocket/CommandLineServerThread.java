package org.treez.server.websocket;

import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.net.Socket;
import java.sql.DriverManager;
import java.util.ArrayList;

public class CommandLineServerThread extends AbstractServerThreadHandlingOneClient {

	static private boolean isCheckingConsoleOutput = false;	
	
	static private String columnDelimiter = ",";
	
	static private String rowDelimiter = "\n";

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

		System.out.println("#Processing web socket command line command:\n" + message);
		
		

		printWriter.println(message);
		
		readAndHandleProcessOutput(message);
		
		while(process.isAlive()) {
			readAndHandleProcessOutput(message);
		}
		
		readAndHandleProcessOutput(message);
		
		var exitValue = process.exitValue();
		
		if(exitValue == 0) {
			sendFinishedToClient();
		} else {			
			sendFinishedErrorToClient("Process failed with exit value " + exitValue );
		}	
		
		initializeConsoleProcess();
		
	}
	
	@Override
	protected void handleClientQuery(String connectionString, String query) {
		System.out.println("#Processing web socket query");
		System.out.println(connectionString);
		System.out.println(query);		
		
		try(
			var connection = DriverManager.getConnection("jdbc:" + connectionString);
			var statement = connection.createStatement();
		){
			var hasResults = statement.execute(query);
			if(hasResults) {
				var resultSet = statement.getResultSet();
				
				 var metaData = resultSet.getMetaData();
				 var numberOfColumns = metaData.getColumnCount();
				 
				 var headers = new ArrayList<String>();
				 for (int columnIndex = 1; columnIndex <= numberOfColumns; columnIndex++) {					 
					 headers.add(metaData.getColumnLabel(columnIndex));					 
				 }
				 
				 var tableText = String.join(columnDelimiter, headers) + rowDelimiter;
				 				 				 
				 while (resultSet.next()) {
					 
					   var rowEntries = new ArrayList<String>();
				       for (int columnIndex = 1; columnIndex <= numberOfColumns; columnIndex++) {				          
				           var entry = resultSet.getObject(columnIndex);
				           if(entry!=null) {
				        	   rowEntries.add(entry.toString());
				           } else {
				        	   rowEntries.add("null");
				           }
				           
				       }
				       tableText += String.join(columnDelimiter, rowEntries) +  rowDelimiter;
				   }					
				
				//System.out.println("Query result:\n" + tableText);
				
				sendMessageToClient(tableText);	
			}
			
			
		} catch(Exception exception) {
			var message = "Could not execute database query '" + query 
					+ "' with connection string '" + connectionString + "'!";
			throw new IllegalStateException(message, exception);
		}          
	         
	}

	private void readAndHandleProcessOutput(String message) {
		
		var resultString = "";
		try {
			resultString = getOutputAndHandleErrors();
			if(resultString.isEmpty()) {
				return;
			}
			System.out.println("#Output:\n" +resultString);				
		} catch (Exception exception) {
			throw new IllegalStateException("Could not execute command line command '" + message + "'", exception);
		}

		resultString = postProcessProcessResult(message, resultString);	
		
		System.out.println("#Sending message to client:'" + resultString+ "'");
		sendMessageToClient(resultString);		
	}

	private String postProcessProcessResult(String message, String resultString) {
		var lineSeparator = System.getProperty("line.separator");
		
		var prefix = message + lineSeparator; //when running from within eclipse in debug mode
		if(resultString.startsWith(prefix)) {
			resultString = resultString.substring(prefix.length());
		}
				
		var simplePrefix = message; //when running with compiled jar from command line
		if(resultString.startsWith(simplePrefix)) {				
			resultString = resultString.substring(simplePrefix.length());
		}
								
		resultString =  removePromptLines(resultString).trim();
		return resultString;
	}

	private String removePromptLines(String message) {
		
		var endsWithPrompt = message.lastIndexOf(">") == message.length()-1;
		if(!endsWithPrompt) {
			return message;
		}
		
		var lineSeparator = System.getProperty("line.separator");
		
		var lines = message.split(lineSeparator);		
		var lastLine = lines[lines.length-1];
		
		var lastLineIsTag = lastLine.startsWith("<");
		if(lastLineIsTag) {
			return message;
		}
		
		var endIndex = message.lastIndexOf("\r");
		if(endIndex==-1) {
			return message;
		}
		
		var trimmedMessage = message.substring(0,endIndex);	
		return removePromptLines(trimmedMessage);		
	}

	private void initializeConsoleProcess() {
		var runtime = Runtime.getRuntime();
		try {
			process = runtime.exec("cmd.exe /k chcp 65001");
			
			
			
		} catch (IOException e) {
			throw new IllegalStateException("Could not start command line cmd.exe");
		}

		try {
			//Connect to input, output and error stream
			var outputStreamWriter = new OutputStreamWriter(process.getOutputStream(),ENCODING);
			printWriter = new PrintWriter(new BufferedWriter(outputStreamWriter), true);
			outputStream = process.getInputStream();
			errorStream = process.getErrorStream();
		} catch (Exception e) {
			throw new IllegalStateException("Could not connect to command line streams", e);
		}

		//wait a moment
		try {
			Thread.sleep(500);
		} catch (Exception e) {
			System.out.println("#Waiting failed");
			System.exit(-1);
		}

		@SuppressWarnings("unused")
		var initialOutput = getOutputAndHandleErrors();
		
	}

	

	private String getOutputAndHandleErrors() {

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
						outputText = outputText + new String(buffer,ENCODING);
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
						errorText = errorText + new String(buffer,ENCODING);
						errorByteLength = errorByteLength + numberOfErrorBytes;
						if(!errorText.isEmpty()) {
							hasError = true;
						}
						
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
					var text = errorText.trim();
					sendErrorToClient(text);					
				}

			} catch (Exception e) {
				System.out.println("#Reading console output failed!");
				sendErrorToClient("Reading console output failed!" + e.getMessage());				
			}

			isCheckingConsoleOutput = false;
		}

		return output;
	}	

}
