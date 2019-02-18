package org.treez.app;

import javafx.application.Application;
import javafx.scene.Scene;
import javafx.stage.Stage;

public class JavaFxApplication extends Application {

    @Override
    public void start(Stage stage) {
       
        var browser = new JavaFxBrowser(()->{
        	System.out.println("browser init finished");
        }, true);
        
        Scene scene = new Scene(browser, 1000, 800);
        stage.setScene(scene);
        stage.show();
    }

    public static void main(String[] args) {
        launch();
    }

}