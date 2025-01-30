import * as fs from "fs";
import * as path from "path";
import { app } from "electron";

const settingsFile = path.join(app.getPath("userData"), "settings.json");

interface Settings {
    installPath: string;
}

/**
 * Load saved folder path from settings.json
 */
export function loadFolderPath(): string {
    if (fs.existsSync(settingsFile)) {
        try {
            const data = JSON.parse(fs.readFileSync(settingsFile, "utf-8"));
            return data.installPath || "Not set";
        } catch (error) {
            console.error("Error reading settings:", error);
            return "Not set";
        }
    }
    return "Not set";
}

/**
 * Save the selected folder path to settings.json
 */
export function saveFolderPath(folderPath: string): void {
    const settings: Settings = { installPath: folderPath };
    fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2), "utf-8");
}
