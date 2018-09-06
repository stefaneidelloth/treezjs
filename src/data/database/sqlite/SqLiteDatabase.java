package org.treez.data.database.sqlite;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import org.treez.data.database.ResultSetProcessor;

public class SqLiteDatabase {

	//#region ATTRIBUTES

	private String filePath;

	//#end region

	//#region CONSTRUCTORS

	public SqLiteDatabase(String filePath) {
		this.filePath = filePath;
		checkConnection();

	}

	//#end region

	//#region METHODS

	private void checkConnection() {

		try {
			Class.forName("org.sqlite.JDBC");
		} catch (ClassNotFoundException driverException) {
			String message = "Could not establish SqLite database connection due to missing driver.";
			throw new IllegalStateException(message, driverException);
		}

		try (
				Connection connection = DriverManager
						.getConnection("jdbc:sqlite:" + filePath);) {} catch (SQLException exception) {
			String message = "Could not establish SqLite database connection to " + filePath;
			throw new IllegalStateException(message, exception);
		}

	}

	/**
	 * Executes a query that does not return a result
	 */
	public void execute(String query) {
		try (
				Connection connection = DriverManager.getConnection("jdbc:sqlite:" + filePath);
				Statement statement = connection.createStatement();) {
			statement.executeUpdate(query);
		} catch (SQLException exception) {
			String message = "Could execute query " + query;
			throw new IllegalStateException(message, exception);
		}
	}

	/**
	 * Executes a query and processes its ResultSet
	 */
	public void executeAndProcess(String query, ResultSetProcessor processor) {
		try (
				Connection connection = DriverManager.getConnection("jdbc:sqlite:" + filePath);
				Statement statement = connection.createStatement();) {
			ResultSet resultSet = statement.executeQuery(query);
			processor.process(resultSet);
		} catch (SQLException exception) {
			String message = "Could not execute and process query " + query;
			throw new IllegalStateException(message, exception);
		}
	}

	//#end region

	//#region ACCESSORS

	//#end region

}
