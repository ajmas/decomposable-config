'use strict';

const fs = require('fs');
const path = require('path');
const { promisify } = require ('util');

const readdir = promisify(fs.readdir);
const fsStat = promisify(fs.stat);
const readFile = promisify(fs.readFile);

const suffix = '.json';

/**
 * Provides a version fs.stat that only throws an exception
 * if there is a failure other than 'file or folder does not exist'.
 *
 * If a file or folder does exist, then undefined is returned.
 *
 * @param {*} fileFoldePath
 */
async function getFileStats(fileFoldePath) {
    try {
        return await fsStat(fileFoldePath);
    } catch (error) {
        if (error.code !== 'ENOENT') {
            throw error;
        }
    }
}

/**
 * Deal with the possible permutations of basePath
 *
 * @param {*} basePath
 */
async function readJsonFile(basePath) {
    if (basePath.endsWith(suffix)) {
        let stats = await getFileStats(basePath);
        if (stats && stats.isFile()) {
            return JSON.parse(await readFile(basePath, 'UTF-8'));
        }
    }

    let filePath = basePath + suffix;
    let stats = await getFileStats(filePath);
    if (stats && stats.isFile()) {
        return JSON.parse(await readFile(filePath, 'UTF-8'));
    }
}


async function readConfig(configPath) {
    let subConfig;

    // See if config path is a file. If so, then we consider it
    // to have no file system based children
    subConfig = await readJsonFile(configPath);
    if (subConfig) {
        return subConfig;
    }

    subConfig = {};

    // Lets see if configPath exists and is a folder
    // If so, then read the config from there
    let stats = await getFileStats(configPath);
    if (stats && stats.isDirectory()) {

        // if it contains an index file, then use that as the base
        // structure of the object
        subConfig = await readJsonFile(path.join(configPath, 'index'));

        if (!subConfig) {
            subConfig = {};
        }

        // look to see if there are any entries that could be used
        // to create the sub structure.
        const entries = await readdir(configPath);
        for (let i=0; i<entries.length; i++) {
            // handle all entries, except 'index.*'
            if (!entries[i].startsWith('index.')) {
                let name = entries[i];

                if (name.endsWith(suffix)) {
                    name = name.substring(0, name.length - suffix.length);
                }

                subConfig[name] = await readConfig(
                    path.join(configPath, entries[i])
                );
            }
        }
        return subConfig;
    }
}

module.exports = { readConfig };
