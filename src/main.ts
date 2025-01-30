import { app, BrowserWindow, ipcMain } from "electron";
import { loadFolderPath, selectFolder } from "./settings";
import { downloadAndExtractSite } from "./siteInstaller";

let mainWindow: BrowserWindow | null = null;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    // Open DevTools for debugging
    mainWindow.webContents.once("did-finish-load", () => {
        mainWindow?.webContents.openDevTools();
    });
    
    mainWindow.loadFile("src/index.html");

    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") app.quit();
    });
});

// Folder selection handlers
ipcMain.handle("select-folder", async () => await selectFolder());
ipcMain.handle("get-folder", () => loadFolderPath());

// Deploy site
ipcMain.on("deploy-site", downloadAndExtractSite);
