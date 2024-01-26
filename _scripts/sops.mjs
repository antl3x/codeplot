#!/usr/bin/env zx

import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { $ } from 'zx/core';

console.log('1234')
// Parsing command-line arguments
const argv = yargs(hideBin(process.argv))
  .command('encrypt <target>', 'Encrypt the file or directory', (yargs) => {
    return yargs.positional('target', {
      describe: 'target file or directory to encrypt',
      type: 'string'
    });
  })
  .command('decrypt <target>', 'Decrypt the file or directory', (yargs) => {
    return yargs.positional('target', {
      describe: 'target file or directory to decrypt',
      type: 'string'
    });
  })
  .demandCommand(1)
  .help()
  .argv;

  
const mode = argv._[1];
const target = path.join(process.env.INIT_CWD, argv._[2]);


// Function to check if a file is non-empty
async function isNonEmptyFile(filePath) {
  const stats = await fs.stat(filePath);
  return stats.size > 0;
}

// Function to encrypt or decrypt a file
async function processFile(filePath, mode) {
  let tempFilePath;
  try {
    const extension = path.extname(filePath);
    const basename = path.basename(filePath, extension);
    const dirname = path.dirname(filePath);


    let newFilename;
    if (mode === 'encrypt') {
      newFilename = basename.includes('.dec') ? basename.replace('.dec', '.enc') + extension : `${basename}.enc${extension}`;
    } else {
      newFilename = basename.includes('.enc') ? basename.replace('.enc', '.dec') + extension : `${basename}.dec${extension}`;
    }


    const newFilePath = path.join(dirname, newFilename);
    tempFilePath = path.join(os.tmpdir(), path.basename(newFilePath));

    if (mode === 'encrypt') {
      await $`sops --config sops.yaml --encrypt ${filePath} > ${tempFilePath}`;
    } else {
      await $`sops --config sops.yaml --decrypt ${filePath} > ${tempFilePath}`;
    }

    // Check if the temporary file is non-empty
    if (await isNonEmptyFile(tempFilePath)) {
      await fs.rename(tempFilePath, newFilePath);
      console.log(`${mode}ed file: ${newFilePath}`);
    } else {
      throw new Error('Output file is empty. Operation aborted to prevent data loss.');
    }
  } catch (error) {
    console.error(`Failed to ${mode} file: ${filePath}`, error);
  } finally {
    // Clean up temporary file if it exists
    if (tempFilePath && await fs.stat(tempFilePath).catch(() => false)) {
      await fs.unlink(tempFilePath);
    }
  }
}

// Function to process a directory
async function processDirectory(directoryPath, mode) {
  try {
    const files = await fs.readdir(directoryPath);
    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      const stats = await fs.stat(filePath);
      if (stats.isFile()) {
        await processFile(filePath, mode);
      }
    }
  } catch (error) {
    console.error(`Failed to ${mode} directory: ${directoryPath}`, error);
  }
}

// Main execution
(async () => {
          
  try {

    const stats = await fs.stat(target);
    if (stats.isFile()) {
      await processFile(target, mode);
    } else if (stats.isDirectory()) {
      await processDirectory(target, mode);
    }
  } catch (error) {
    $`pnpm sops --help`
    console.error(`Error processing ${target}:`, error);
  }
})();
