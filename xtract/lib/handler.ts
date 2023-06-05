import path from "node:path";
import fs from "node:fs";

import AdmZip from 'adm-zip';

import * as FileType from 'file-type';

function extractFirstFile(filePath: string, to: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const zip = new AdmZip(filePath);
    const zipEntries = zip.getEntries();

    if (zipEntries.length === 0) {
      reject(new Error('ZIP archive is empty.'));
      return;
    }

    const firstEntry = zipEntries[0];

    try {
      const ext = firstEntry.name.split(".").pop();
      let filename = path.join(to, "output" + "." + ext);
      fs.writeFileSync(filename, firstEntry.getData());
      resolve(filename);
    } catch (error) {
      reject(error);
    }
  });
}


export default class Handler {
    dir: string;

    constructor(dir: string) {
      this.dir = dir;
    }

    async handleZip(filepath: string) {
        const outfp = await extractFirstFile(filepath, this.dir);
        this.handle(outfp);
    }

    async handle(filepath: string) {
        const ext = filepath.split(".").pop();
        switch (ext) {
                case "zip":
                  await this.handleZip(filepath);
                  break;
                case "csv":
                  break;
        }
    }
} 
