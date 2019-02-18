const { app, BrowserWindow } = require('electron')
const { protocol } = require( 'electron' )
const nfs = require( 'fs' )
const npjoin = require( 'path' ).join
const es6Path = npjoin( __dirname, 'www' )

protocol.registerStandardSchemes( [ 'es6' ] )

function createWindow () { 

 protocol.registerBufferProtocol( 'es6', ( req, cb ) => {
    nfs.readFile(
      npjoin( es6Path, req.url.replace( 'es6://', '' ) ),
      (e, b) => { cb( { mimeType: 'text/javascript', data: b } ) }
    )
  })
  
  let win = new BrowserWindow({ 
	  width: 800, 
	  height: 600, 
	  nodeIntegration: true,
	  webPreferences: { webSecurity: false }	  
  }) 
  win.loadFile('index.html')
  win.webContents.openDevTools()  
  win.on('closed', () => { win = null })  
  
}

app.on('ready', createWindow)