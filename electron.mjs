import { app, BrowserWindow } from 'electron';
import path from 'path';
import isDev from 'electron-is-dev';

function createWindow() {
	const mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		fullscreen: false,
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
	});

	mainWindow.setMenu(null);
	mainWindow.maximize();

	// Load the loading screen initially
	mainWindow.loadURL('data:text/html,<html><body><h1>Loading...</h1></body></html>');

	// Load the actual content after the window is ready
	const urlToLoad = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, 'index.html')}`;

	mainWindow.webContents.on('did-finish-load', () => {
		// Only show the window after content is loaded
		mainWindow.webContents.executeJavaScript('document.body.innerHTML = "<div id=\'app\'></div>";');
		mainWindow.loadURL(urlToLoad);
	});

	mainWindow.on('ready-to-show', () => {
		// Show the window when the actual content is ready
		mainWindow.show();
	});
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});
