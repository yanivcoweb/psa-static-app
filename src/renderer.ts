const { ipcRenderer } = require("electron");

const folderBtn = document.getElementById("select-folder-btn")!;
const folderText = document.getElementById("selected-folder")!;
const deployBtn = document.getElementById("deploy-btn")!;
const statusText = document.getElementById("status")!;

// Load saved folder path on startup
async function loadFolder() {
    const savedFolder = await ipcRenderer.invoke("get-folder");
    folderText.textContent = savedFolder;
}

// Select folder
folderBtn.addEventListener("click", async () => {
    console.log("🖱️ Folder selection button clicked!"); // Debugging log
    const folder = await ipcRenderer.invoke("select-folder");
    if (folder) {
        console.log(`📂 Folder received from main process: ${folder}`); // Debugging log
        folderText.textContent = folder;
    }else{
        console.log("❌ No folder was selected."); // Debugging log
    }
});

// Deploy site
deployBtn.addEventListener("click", () => {
    statusText.textContent = "Deploying...";
    ipcRenderer.send("deploy-site");
});

// Update status message (Fix: Explicit types for event and message)
ipcRenderer.on("deploy-status", (_event: Electron.IpcRendererEvent, message: string) => {
    statusText.textContent = message;
});

// Load folder path when app starts
loadFolder();
