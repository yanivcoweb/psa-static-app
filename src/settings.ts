import { app, dialog } from "electron";
import * as fs from "fs";
import * as path from "path";

const settingsFile = path.join(app.getPath("userData"), "settings.json");

// Load saved folder path
export function loadFolderPath(): string {
    if (fs.existsSync(settingsFile)) {
        const data = fs.readFileSync(settingsFile, "utf-8");
        try {
            return JSON.parse(data).installPath || "Not set";
        } catch {
            return "Not set";
        }
    }
    return "Not set";
}

// Save folder path
export function saveFolderPath(folderPath: string): void {
    const data = JSON.stringify({ installPath: folderPath }, null, 2);
    fs.writeFileSync(settingsFile, data, "utf-8");
}

// Show folder selection dialog and save selection
export async function selectFolder(): Promise<string | null> {
    console.log("🚀 Select Folder button clicked!"); // Debugging log
    const result = await dialog.showOpenDialog({ properties: ["openDirectory"] });
    if (!result.canceled && result.filePaths.length > 0) {
        const selectedFolder = result.filePaths[0];
        console.log(`✅ Selected Folder: ${selectedFolder}`); // Debugging log
        saveFolderPath(selectedFolder);
        return selectedFolder;
    }
    return null;
}
