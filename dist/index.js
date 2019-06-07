(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
}(function () { 'use strict';

    const fs = require('fs');
    const path = require('path');
    const { promisify } = require ('util');

    const readdir = promisify(fs.readdir);
    const access = promisify(fs.access);
    const fsStat = promisify(fs.stat);
    const readFile = promisify(fs.readFile);

    async function getFileType(fileFoldePath) {
        try {
            const stats = await fsStat(fileFoldePath);
            if (stats.isDirectory()) {
                return 'd';
            } else if (stats.isFile()) {
                return 'f';
            }
        } catch (error) {
            if (error.code !== 'ENOENT') {
                throw error;
            }         
        }
        return undefined;
    }

    async function readConfig(configPath) {
        let subConfig = {};

        // First try a file 
        try {
            if (configPath.endsWith('.json')) {
                let fType = await getFileType(configPath);
                if (fType === 'f') {
                    return JSON.parse(await readFile(configPath, 'UTF-8'));
                } else {
                    return undefined;
                }
            }

            let fType = await getFileType(configPath);
            if (fType === 'd') {
                let filePath = path.join(configPath, 'index.json');

                let fType = await getFileType(filePath);
                if (fType === 'f') {
                    subConfig = JSON.parse(await readFile(filePath, 'UTF-8'));
                }

                fType = await getFileType(configPath);
                const entries = await readdir(configPath);
                for (let i=0; i<entries.length; i++) {
                    if (entries[i] !== 'index.json') {
                        let name = entries[i];
                        if (name.endsWith('.json')) {
                            name = name.substring(0, name.length - '.json'.length);
                        }
                        
                        subConfig[name] = await readConfig(
                            path.join(configPath, entries[i])
                        );
                    }
                }
                return subConfig;
            } 
            
            filePath = `${configPath}.json`;
            fType = await getFileType(filePath);
            if (fType === 'f') {
                return JSON.parse(await readFile(filePath, 'UTF-8'));
            }
            
        } catch (error) {
            console.log(error);
        }
    }

    async function loadConfig(configPath) {
        console.log('reading:', configPath);
        return await readConfig(configPath);
    }

    async function test() {
        console.log(JSON.stringify(await loadConfig('example/config4'), null, 2));
    }

    test();

}));
