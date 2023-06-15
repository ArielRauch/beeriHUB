import { readdir } from 'fs';
import { extname, join } from 'path';
import * as fs from 'fs'

export const findFileWithExt = (directoryPath,ext) => {
    return new Promise((resolve, reject) => {
        readdir(directoryPath, (err, files) => {
            if (err) {
                reject('Unable to scan directory: ' + err);
            } 
            // Loop through all the files in the directory
            files.forEach((file) => {
                // Check if file is a .txt file
                if (extname(file) === "."+ext) {
                    resolve(join(directoryPath, file));
                }
            });
            reject('No .txt file found in directory');
        });
    });
};



export const deleteFolderRecursive = (path) => {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach((file) => {
      const curPath = `${path}/${file}`;
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath); // Recursively delete sub-folders
      } else {
        fs.unlinkSync(curPath); // Delete file
      }
    });
    fs.rmdirSync(path); // Delete empty folder
  }
}
