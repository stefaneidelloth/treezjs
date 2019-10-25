package org.demo;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;



public class Main {	
	
	private static String message = null;
	
	private static String outputFilePath = null;
	
	private static String logFilePath = null;
	
	//in order to export this demo as jar file
	//right click on project in package explrorer and
	//choose Export... => JAR file
	
	public static void main(String[] args) throws IOException {
		
		parseCommandLineArguments(args);
		
		if(message != null) {
			System.out.println(message);
		} else {
			message = "<Default message>";
		}
		
		if(outputFilePath != null) {
			File outputFile = new File(outputFilePath);

            // This will output the full path where the file will be written to...
            //System.out.println(outputFile.getCanonicalPath());

            try(var writer = new BufferedWriter(new FileWriter(outputFile))){
            	writer.write(message);
            };
            
		}
		
		if(logFilePath != null) {
			File logFile = new File(logFilePath);

            // This will output the full path where the file will be written to...
            //System.out.println(outputFile.getCanonicalPath());

            try(var writer = new BufferedWriter(new FileWriter(logFile))){
            	writer.write("Logged message: " + message);
            };
            
		}
				
		if(args.length<1) {			
			System.out.println("Please pass some arguments to org.demo.Main, e.g. -message \"Hello World\".");
		}
		
	}

	private static void parseCommandLineArguments(String[] args) {
		for(var index = 0; index < args.length; index++) {
			var arg = args[index];
			
			if(arg.equals("-message")) {
				if(args.length > index+1) {
					message = args[index+1];
				}
			}
			
			if(arg.equals("-outputFile")) {
				if(args.length > index+1) {
					outputFilePath = args[index+1];
				}
				
			}
			
			if(arg.equals("-logFile")) {
				if(args.length > index+1) {
					logFilePath = args[index+1];
				}
				
			}
			
		}
	}	
	
}
