const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const AdmZip = require('adm-zip'); // Add this line

let mainWindow;

app.on('ready', () => {
    console.log('App is ready');
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false, // Allow `require` in the renderer process
            //Security Note
            //Enabling nodeIntegration and disabling contextIsolation can expose your app to security risks. For production apps, consider using preload scripts for secure communication between the main and renderer processes. For now, this approach is fine for development.
        },
    });

    mainWindow.loadFile('src/index.html');

    // Open developer tools after the window is fully loaded
    mainWindow.webContents.once('did-finish-load', () => {
        mainWindow.webContents.openDevTools();
    });

});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Listen for plugin installation event
ipcMain.on('install-plugin', (event, filePath) => {
    console.log('Received file path:', filePath);
    try {
        // Define extraction path
        const fileName = path.basename(filePath);
        const extractPath = path.join(app.getPath('userData'), 'plugins', path.basename(fileName, '.zip'));

        console.log('Extracting to path:', extractPath);

        // Ensure the directory exists
        if (!fs.existsSync(extractPath)) {
            fs.mkdirSync(extractPath, { recursive: true });
            console.log('Created plugins directory');
        }

        // Extract the .zip file
        const zip = new AdmZip(filePath);
        zip.extractAllTo(extractPath, true);

        console.log(`Extracted ${fileName} to ${extractPath}`);

        // Notify the renderer process
        event.reply('install-plugin-response', `Plugin ${fileName} extracted successfully to: ${extractPath}`);
    } catch (error) {
        console.error('Error extracting file:', error);
        event.reply('install-plugin-response', 'Failed to extract the plugin file.');
    }
});


