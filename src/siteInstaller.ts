import * as fs from "fs";
import * as https from "https";
import * as path from "path";
import { shell } from "electron";
import AdmZip = require("adm-zip");
import { loadFolderPath } from "./settings"; // Import folder selection logic

const zipUrl = "https://psa-simple-website.wpdd.co.il/simple_website.zip";

/**
 * Downloads and extracts the ZIP file to the selected folder.
 * Opens the index.html file in the browser.
 */
export function downloadAndExtractSite(event: any) {
    const installPath = loadFolderPath();

    if (installPath === "Not set") {
        event.reply("deploy-status", "Error: No installation folder selected.");
        return;
    }

    const zipPath = path.join(installPath, "simple_website.zip");

    // Step 1: Download ZIP file
    const file = fs.createWriteStream(zipPath);
    https.get(zipUrl, (response) => {
        response.pipe(file);
        file.on("finish", () => {
            file.close(() => {
                console.log("Download complete.");

                // Step 2: Extract ZIP file
                const zip = new AdmZip(zipPath);
                zip.extractAllTo(installPath, true);
                console.log("Extraction complete.");

                // Step 3: Open index.html
                const indexPath = path.join(installPath, "index.html");
                if (fs.existsSync(indexPath)) {
                    shell.openPath(indexPath);
                    event.reply("deploy-status", "Offline site deployed successfully!");
                } else {
                    event.reply("deploy-status", "Error: index.html not found!");
                }
            });
        });
    }).on("error", (err) => {
        console.error("Download failed:", err.message);
        event.reply("deploy-status", "Error downloading file.");
    });
}
