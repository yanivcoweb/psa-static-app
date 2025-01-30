// src/adm-zip.d.ts
declare module 'adm-zip' {
    class AdmZip {
        constructor(zipPath?: string);
        extractAllTo(targetPath: string, overwrite: boolean): void;
        addLocalFile(filePath: string, zipPath?: string, fileName?: string): void;
        toBuffer(): Buffer;
        writeZip(targetFileName?: string): void;
    }

    export = AdmZip;
}
