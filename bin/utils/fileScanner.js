import * as path from "path";
import { readdir, readFile, stat } from "fs/promises";
//import { FileStructure } from "../../types";
import { IGNORE_LIST } from '../constants.js';

import { statSync } from "fs";

const ENTRY_FILE_REGEX = /\.(module|routes|router|stack|construct)\.(ts|js|tsx|jsx)$/;

export const getAllFileAndFolders = async (dir = '', projectRoot = process.cwd()) => {
    try{
    const currentDir = path.join(projectRoot, dir);
    const allFiles = (await readdir(currentDir))
        .filter((file) => !IGNORE_LIST.includes(file));

    const folderStructurePromise = allFiles.flatMap(async file => {
        const filePath = path.join(currentDir, file);
        const relativePath = path.join(dir, file);
        const stats = await stat(filePath);
        const fileName  = file.replace(/\\/g,'/');
        const pathName = relativePath.replace(/\\/g,'/');
        if (!stats.isDirectory()) {
            const ext = path.extname(file).toLowerCase();
            const allowedExts = ['.js', '.ts', '.jsx', '.tsx', '.mjs', '.cjs'];
            const ignoredFiles = ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml'];

            if (ignoredFiles.includes(file) || !allowedExts.includes(ext) || file.endsWith('.min.js')) {
                return [];
            }

            let fileContent = await readFile(filePath, 'utf-8');
            fileContent = fileContent.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n');
            
            return {
                fileName,
                path: pathName,
                isDirectory: false,
                content: fileContent,
            }
        } else {
            const subFolders = await getAllFileAndFolders(relativePath, projectRoot);
            return [{
                fileName,
                path: pathName,
                isDirectory: true
            }, ...subFolders]
        }
    })
    return Promise.all(folderStructurePromise);
}
catch(err){
console.log("err",err) 
}
}



export const readFiles = async (dirPath, modulesToProcess= []) => {
    const files = await readdir(dirPath);

    for (const entry of files) {
        if (IGNORE_LIST.includes(entry)) continue;
        const entryPath = path.join(dirPath, entry);
        const relativeEntryPath = path.relative(process.cwd(), entryPath);
        const stats = statSync(entryPath);
        if (stats.isDirectory()) {
            const subFiles = await readdir(entryPath);
            const entryFile = subFiles.find(f => ENTRY_FILE_REGEX.test(f)
            );

            modulesToProcess.push({
                moduleName: entry,
                entryFile: entryFile ? path.join(relativeEntryPath, entryFile) : subFiles.map(f => path.join(relativeEntryPath, f)),
                manual: true
            });
        } else {
            modulesToProcess.push({
                moduleName: entry,
                entryFile: relativeEntryPath,
                manual: true
            });
        }
    }
    return modulesToProcess;
}

export function getFileNames(files, existingFiles = []) {
    for (let file of files) {
        if (Array.isArray(file)) {
            let currentFiles = getFileNames(file, []);
            existingFiles = [...existingFiles, ...currentFiles];
        } else {
           if (!file.isDirectory) {
                existingFiles = [...existingFiles, { fileName: file.fileName, path: file.path }];
            }
        }
    }
    return existingFiles;
}

export function getChangedFiles(files, swaggerFileName, changedFiles = [], existingFiles = []) {
    const projectRoot = process.cwd();
    for (let file of files) {
        if (Array.isArray(file)) {
           let currentFiles = getChangedFiles(file, swaggerFileName, changedFiles, []);
            existingFiles = [...existingFiles, ...currentFiles];
        } else {
           if (!file.isDirectory && file.path !== swaggerFileName) {
             if (!changedFiles.length || changedFiles.includes(path.resolve(projectRoot, file.path))) {
                    existingFiles = [...existingFiles, file];
                }
            }
        }
    }
    return existingFiles;
}