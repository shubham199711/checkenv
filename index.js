const fs = require('fs').promises;
const path = require('path');

const regex = /process\.env\.(\w+)/g;

async function findEnvKeysInFile(filePath) {
    const content = await fs.readFile(filePath, 'utf-8');
    const matches = content.matchAll(regex);
    const keys = [...matches].map(match => match[1]);
    return keys;
}

async function findEnvKeysInDirectory(dirPath) {
    const files = await fs.readdir(dirPath);
    let keys = new Set();
    for (const file of files) {
        const filePath = path.join(dirPath, file);
        if ((await fs.stat(filePath)).isDirectory()) {
            (await findEnvKeysInDirectory(filePath)).forEach(item => keys.add(item));
        } else if (filePath.endsWith('.ts') || filePath.endsWith('.js')) {
            (await findEnvKeysInFile(filePath)).forEach(item => keys.add(item));
        }
    }
    return keys;
}

async function checkEnv(__dirname) {
    let keys = await findEnvKeysInDirectory(__dirname);
    let errorOn = [];
    for (const iterator of keys) {
        if (!process.env[iterator]) {
            errorOn.push(iterator);
        }
    }
    if (errorOn.length) {
        throw new Error(`${errorOn} keys are not defined in .env`);
    }
}

module.exports = checkEnv;