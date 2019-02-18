package org.treez.server.rest;

import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

public class ConsoleHandler implements HttpHandler {
		
	//#region ATTRIBUTES
	
	static private String URL_PREFIX = "/console";
	
	static private boolean CheckConsoleOutputWaitFlag = false;	

	private Process process;
	
	private PrintWriter printWriter;
	
	private InputStream outputStream;	
	
	private InputStream errorStream;
	
	private String outputText;
	
	private String errorText;	
	
	//#end region
	
	//#region CONSTRUCTORS

	private ConsoleHandler() {
		super();
		var initialOutput = initializeConsoleProcess();		
		System.out.println(initialOutput);		
	}
	
	//#end region
	
	//#region METHODS
	
	public static void create(HttpServer server) {
		server.createContext(URL_PREFIX, new ConsoleHandler());		
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
			printWriter = new PrintWriter(new BufferedWriter(new OutputStreamWriter(process.getOutputStream())),true);
			outputStream = process.getInputStream();
			errorStream = process.getErrorStream();			
		}catch (Exception e) {
			throw new IllegalStateException("Could not connect to command line streams", e);			
		}
		
		//wait a moment
		try{
				Thread.sleep(500);
		}catch(Exception e){
			System.out.println("Waiting failed");
			System.exit(-1);
		}			
		
		var output = getOutput();
		return output;
	}

	
	
	
	public void handle(HttpExchange httpExchange) throws IOException {
		
		String wholeUrlPath = httpExchange.getRequestURI().getPath();
	       
        if (! wholeUrlPath.startsWith(URL_PREFIX)) {
            throw new RuntimeException("Path is not in prefix - incorrect routing?");
        }
        String urlPath = wholeUrlPath.substring(URL_PREFIX.length()+1);
				
		var request = urlPath;		
		
		var resultString = "Error"; 
		
		try {
			resultString = result(request);
		} catch(Exception exception) {
			throw new IllegalStateException("Could not execute command line command '" + request + "'", exception);
		}
		

		var response = resultString.getBytes();
		httpExchange.sendResponseHeaders(200, response.length);
		
		var outputStream = httpExchange.getResponseBody();
		outputStream.write(response);
		outputStream.close();
	}

	private String result(String request) throws IOException, InterruptedException {		
			
		printWriter.println(request);		

		String output = getOutput();
		
		System.out.println(output);
		
		return output;
	}
	
		
	private String getOutput() {
		
		String output = "";
		
			if (!CheckConsoleOutputWaitFlag){ 
				
				//set global waitflag
				CheckConsoleOutputWaitFlag=true;					
				//set variables
				int numberOfAvailableBytes =1;					
				int byteLength=0;
				int errorByteLength=0;
				boolean hasOutput=false;
				boolean	hasError=false;
				outputText="";
				errorText="";	
				
				int n1;
				int n2;
				int firstEndIndex;
				int secondEndIndex;	
				
				try{
					while (numberOfAvailableBytes>0){ //loop while console output contains data
						//set variables
						n1=0;
						n2=1;							
						firstEndIndex=0;
						secondEndIndex=1;									
						//Wait until available Bytes of output are constant
						while(n1!=n2){
							n1 = outputStream.available();
							Thread.sleep(50);
							n2 = outputStream.available();						
						}
						//read octave output
						if (n2>0){
								byte buffer[] = new byte[128];
								int numberOfBytes = outputStream.read(buffer);								
								outputText = outputText + new String(buffer);
								byteLength=byteLength+numberOfBytes;							
								hasOutput = true;
						}
						//Wait until available Bytes of error are constant
						while(firstEndIndex!=secondEndIndex){
								firstEndIndex = errorStream.available();
								Thread.sleep(50);
								secondEndIndex = errorStream.available();
						}
						//read octave errors
						if (secondEndIndex>0){
								byte buffer[] = new byte[128];
								int numberOfErrorBytes= errorStream.read(buffer);
								errorText = errorText + new String(buffer);
								errorByteLength = errorByteLength+numberOfErrorBytes;								
								hasError=true;
						}						
						//check again if console has data in output streams
						numberOfAvailableBytes = outputStream.available();
						if (numberOfAvailableBytes==0){
							numberOfAvailableBytes = errorStream.available();
						}
						
					}																																
					
					
					if (hasOutput){							
                        output+= outputText.trim();							
					}					
					
					
					if (hasError){							
						output+="Error: " + errorText.trim();	
					}					
					
				}catch (Exception e) {
					System.out.println("Reading console output failed!");					
					output+="Error: " + "Reading console output failed!";					
				} 
			
			 CheckConsoleOutputWaitFlag=false;	
			}
			
			
			return output;
		}

	
	
	
	

}
