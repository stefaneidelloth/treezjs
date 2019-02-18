package org.treez.app;

import java.util.Objects;

import javafx.application.Platform;
import javafx.beans.property.ReadOnlyObjectProperty;
import javafx.concurrent.Worker;
import javafx.concurrent.Worker.State;
import javafx.scene.control.Alert;
import javafx.scene.control.Alert.AlertType;
import javafx.scene.layout.StackPane;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebView;


public class JavaFxBrowser extends StackPane  {
	
	//#region ATTRIBUTES


	protected WebView webView;

	protected WebEngine engine;

	/**
	 * This runnable is executed after the initial loading of the browser has
	 * been finished. Put your custom code into this runnable.
	 */
	private Runnable loadingFinishedHook;

	protected Boolean enableDebugMode = false;	

	//#end region

	//#region CONSTRUCTORS

	public JavaFxBrowser(Runnable loadingFinishedHook, Boolean enableDebugMode) {
		this.loadingFinishedHook = loadingFinishedHook;
		this.enableDebugMode = enableDebugMode;
		initialize();
	}

	//#end region

	//#region METHODS

	private void initialize() {						
		
			webView = new WebView();			
			getChildren().add(webView);	
				
			engine = webView.getEngine();
			Objects.requireNonNull(engine);		
			engine.setJavaScriptEnabled(true);		
			engine.setOnAlert((eventArgs) -> {
				String message = eventArgs.getData();			
				showAlert(message);
			});
			
			injectFirebugAndRegisterLoadingFinishedHook();			
			
			engine.load("http://localhost:8080");

			//delete cookies
			java.net.CookieHandler.setDefault(new java.net.CookieManager());			

			//note: after asynchronous loading has been finished, the
			//loading finished hook will be executed.	

	}



	private void injectFirebugAndRegisterLoadingFinishedHook() {
		Worker<Void> loadWorker = engine.getLoadWorker();
		ReadOnlyObjectProperty<State> state = loadWorker.stateProperty();
		state.addListener((obs, oldState, newState) -> {

			boolean isSucceeded = (newState == Worker.State.SUCCEEDED);
			if (isSucceeded) {				
				
				if (enableDebugMode) {
					injectFireBug();
				}				
				
				if (loadingFinishedHook != null) {
					try {
						loadingFinishedHook.run();
					} catch (Exception exception) {
						String message = "Could not execute loading finished hook!";
						logError(message, exception);
					}
					
				}
			}

			boolean isFailed = (newState == Worker.State.FAILED);
			if (isFailed) {
				logError("Loading initial html page failed!");
			}

		});
	}
	
	private void logError(String message) {
		System.err.println(message);
	}
	
	private void logError(String message, Exception exception) {
		System.err.println(message);
		exception.printStackTrace();
	}	

	protected void injectFireBug() {
		// also see 
		// https://stackoverflow.com/questions/9398879/html-javascript-debugging-in-javafx-webview
		// and
		// https://getfirebug.com/firebug-lite.js#startOpened
		//
		String fireBugCommand = "if (!document.getElementById('FirebugLite')){"				
				+ "E = document['createElement' + 'NS'] && " 
				+ "document.documentElement.namespaceURI;E = E ? "
				+ "document['createElement' + 'NS'](E, 'script') : " 
				+ "document['createElement']('script');"
				+ "E['setAttribute']('id', 'FirebugLite');"
				+ "E['setAttribute']('src', 'https://getfirebug.com/firebug-lite.js#startOpened');"
				+ "E['setAttribute']('FirebugLite', '4');"					
				+ "(document['getElementsByTagName']('body')[0]).appendChild(E);"				
				+ "}";

		engine.executeScript(fireBugCommand);
	}

	

	public void showAlert(String message) {
		Runnable alertRunnable = () -> {
			Alert alert = new Alert(AlertType.INFORMATION);
			alert.setTitle("Alert");
			alert.setHeaderText(message);
			alert.showAndWait();
		};
		Platform.runLater(alertRunnable);
	}	

	//#end region	

}