import * as fs from 'fs'
import * as pt from 'path';
import  decompress from 'decompress';
import * as chokidar from 'chokidar';
import dotenv from 'dotenv';
dotenv.config();
console.log('dotenv.config() has finished executing');


console.log("JJJJJ: " +process.env.BUCKETNAME );

import * as po from "./libs/processOrder.js";
import * as utils from "./libs/utils.js";

/*
const workPath = '/Users/arielrauch/Documents/Development/Customers/Beeri/beeriHUB';
const watchFolder = workPath + "/" + 'zipfiles';
const workFolder = workPath + "/" + 'working';
const doneFolder = workPath + "/" + 'done';
const errorFolder = workPath + "/" + 'error';
*/

const workPath = process.env.WORKFOLDER;
const watchFolder =process.env.WATCHFOLDER;
const workFolder = workPath + "/" + 'working';
const doneFolder = workPath + "/" + 'done';
const errorFolder = workPath + "/" + 'error';


// Example of a more typical implementation structure

// Initialize watcher.

const watcher = chokidar.watch(watchFolder,{
    persistent: true,
    ignoreInitial: true,
    //ignored: [ 'watch-folder/ignore-1.txt', 'watch-folder/ignore-2.txt' ],
    ignorePermissionErrors: false,
    interval: 100,
    binaryInterval: 300,
    disableGlobbing: false,
    enableBinaryInterval: true,
    useFsEvents: false,
    usePolling: false,
    atomic: true,
    followSymlinks: true,
    awaitWriteFinish: {
        stabilityThreshold: 2000,
        pollInterval: 100
    }
});

watcher.on('add',(path) => {

    console.log(path,'File Path .......'+pt.dirname(path));
    let filename = pt.basename(path);
    let zipfile = workFolder + "/" + filename;
    fs.rename(path, zipfile, function (err) {
        if (err) throw err
        console.log('Successfully renamed - AKA moved!')
        decompress(zipfile, workFolder)
            .then(async(files) => {
                //console.log(files);
                //fs.unlinkSync(zipfile);
                const orderBaseName = pt.parse(zipfile).name;
                let orderFolder = workFolder + "/" + orderBaseName;
                let poResp = await po.processOrder(orderFolder);
                let zipDest = "";
                console.log("************* poResp: " + poResp);
                if (poResp) {
                    zipDest = doneFolder + "/" + filename;
                } else {
                    zipDest = errorFolder + "/" + filename;
                }
                try {
                    fs.renameSync(zipfile, zipDest);
                    console.log('File moved successfully.');
                    utils.deleteFolderRecursive(orderFolder);
                } catch (err) {
                    console.error('Error renaming file:', err);
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }); 
})




