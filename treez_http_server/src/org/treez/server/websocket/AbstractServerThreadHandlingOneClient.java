package org.treez.server.websocket;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.Socket;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Scanner;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.xml.bind.DatatypeConverter;

public abstract class AbstractServerThreadHandlingOneClient extends Thread {

	// #region ATTRIBUTES

	protected Socket client;

	protected InputStream clientInputStream;

	private OutputStream clientOutputStream;

	private Scanner scanner;

	protected boolean isRunning = false;
	
	protected static String ENCODING = "UTF-8"; //"cp1252";

	// #end region

	// #region CONSTRUCTORS

	public AbstractServerThreadHandlingOneClient(Socket client) {
		this.client = client;
	}

	// #end region

	// #region METHODS

	public void run() {
		isRunning = true;
		getInputStream();
		getOutputStream();
		doHandShakeToInitializeWebSocketConnection();
		init();
		observeClientInputStream();
	}

	protected abstract void init();

	public void terminate() {
		isRunning = false;
		scanner.close();
	}

	private void getInputStream() {
		try {
			clientInputStream = client.getInputStream();
		} catch (IOException exception) {
			throw new IllegalStateException("Could not connect to client input stream.", exception);
		}

	}

	private void getOutputStream() {
		try {
			clientOutputStream = client.getOutputStream();
		} catch (IOException exception) {
			throw new IllegalStateException("Could not connect to client input stream.", exception);
		}
	}

	protected void sendMessageToClient(String message) {
		try {
			clientOutputStream.write(encode(message));
			clientOutputStream.flush();
		} catch (IOException exception) {
			throw new IllegalStateException("Could not send message to client.", exception);
		}
	}

	private void doHandShakeToInitializeWebSocketConnection() {

		try {
			this.scanner = new Scanner(clientInputStream, ENCODING);
			String data = this.scanner.useDelimiter("\\r\\n\\r\\n").next();

			Matcher get = Pattern.compile("^GET").matcher(data);

			if (get.find()) {
				Matcher match = Pattern.compile("Sec-WebSocket-Key: (.*)").matcher(data);
				match.find();

				byte[] response = null;

				var messageDigest = MessageDigest.getInstance("SHA-1");

				var byteMessage = messageDigest
						.digest((match.group(1) + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11").getBytes(ENCODING));

				var stringMessage = DatatypeConverter.printBase64Binary(byteMessage);

				response = ("HTTP/1.1 101 Switching Protocols\r\n" + "Connection: Upgrade\r\n"
						+ "Upgrade: websocket\r\n" + "Sec-WebSocket-Accept: " + stringMessage + "\r\n\r\n")
								.getBytes(ENCODING);

				clientOutputStream.write(response, 0, response.length);
			} else {
				throw new IllegalStateException(
						"Hand shake did not work because initial data does no contain GET request: " + data);
			}

		} catch (IOException | NoSuchAlgorithmException exception) {
			throw new IllegalStateException("Could not connect to client input stream", exception);
		}
	}

	private void observeClientInputStream() {
		try {

			while (this.isRunning) {
				byte[] byteArray = new byte[1024];
				int length = clientInputStream.read(byteArray);
				if (length != -1) {

					var firstByte = byteArray[0];
					if (!(firstByte == -120)) {

						var message = decode(byteArray, length);
						
						var commandPostfix = "<#end#>";						
						message = message.split(commandPostfix)[0]; //removes possible ghost byte rubbish
						
						try {
							handleClientMessage(message);
						} catch (Exception exception) {
							throw new IllegalStateException("Could not handle client message" + message);
						}
					}

				}

				if (client.isClosed()) {
					terminate();
				}
				try {
					Thread.sleep(100);
				} catch (InterruptedException e) {
				}

			}
		} catch (java.net.SocketException socketException) {
			//nothing to do 
		} catch (IOException printException) {
			throw new IllegalStateException("Could not connect to client input stream", printException);
		}
	}

	protected void handleClientMessage(String message) {
		System.out.println(message);
	}

	protected static byte[] encode(String message) throws IOException {

		// Original source code for encoding:
		// https://stackoverflow.com/questions/8125507/how-can-i-send-and-receive-websocket-messages-on-the-server-side

		byte[] rawData = message.getBytes(ENCODING);

		int frameCount = 0;
		byte[] frame = new byte[10];

		frame[0] = (byte) 129;

		if (rawData.length <= 125) {
			frame[1] = (byte) rawData.length;
			frameCount = 2;
		} else if (rawData.length >= 126 && rawData.length <= 65535) {
			frame[1] = (byte) 126;
			int rawLength = rawData.length;
			frame[2] = (byte) ((rawLength >> 8) & (byte) 255);
			frame[3] = (byte) (rawLength & (byte) 255);
			frameCount = 4;
		} else {
			frame[1] = (byte) 127;
			int rawLength = rawData.length;
			frame[2] = (byte) ((rawLength >> 56) & (byte) 255);
			frame[3] = (byte) ((rawLength >> 48) & (byte) 255);
			frame[4] = (byte) ((rawLength >> 40) & (byte) 255);
			frame[5] = (byte) ((rawLength >> 32) & (byte) 255);
			frame[6] = (byte) ((rawLength >> 24) & (byte) 255);
			frame[7] = (byte) ((rawLength >> 16) & (byte) 255);
			frame[8] = (byte) ((rawLength >> 8) & (byte) 255);
			frame[9] = (byte) (rawLength & (byte) 255);
			frameCount = 10;
		}

		int bLength = frameCount + rawData.length;

		byte[] reply = new byte[bLength];

		int bLimit = 0;
		for (int i = 0; i < frameCount; i++) {
			reply[bLimit] = frame[i];
			bLimit++;
		}
		for (int i = 0; i < rawData.length; i++) {
			reply[bLimit] = rawData[i];
			bLimit++;
		}

		return reply;
	}

	protected static String decode(byte[] byteArray, int length) throws UnsupportedEncodingException {

		// Original source code for decoding:
		// https://stackoverflow.com/questions/8125507/how-can-i-send-and-receive-websocket-messages-on-the-server-side

		byte rLength = 0;
		int rMaskIndex = 2;
		int rDataStart = 0;
		// b[0] is always text in my case so no need to check;
		byte data = byteArray[1];
		byte operation = (byte) 127;
		rLength = (byte) (data & operation);

		if (rLength == (byte) 126)
			rMaskIndex = 4;
		if (rLength == (byte) 127)
			rMaskIndex = 10;

		byte[] masks = new byte[4];

		int j = 0;
		int i = 0;
		for (i = rMaskIndex; i < (rMaskIndex + 4); i++) {
			masks[j] = byteArray[i];
			j++;
		}

		rDataStart = rMaskIndex + 4;

		int messageLength = length - rDataStart;

		byte[] message = new byte[messageLength];

		for (i = rDataStart, j = 0; i < length; i++, j++) {
			message[j] = (byte) (byteArray[i] ^ masks[j % 4]);
		}
		return new String(message,ENCODING);

	}

}
