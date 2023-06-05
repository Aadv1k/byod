import path from "node:path";
import fs from "node:fs";

import AdmZip from 'adm-zip';

import * as FileType from 'file-type';

import  CsvHandler from "./handlers/csv";

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

    // TODO: `handler.handle` is not typesafe
    async handle(filepath: string): Promise<any> {
        const ext = filepath.split(".").pop();
        switch (ext) {
                case "zip":
                  await this.handleZip(filepath);
                  break;
                case "csv":
                  let instance = new CsvHandler(",");
                  await instance.fromFile(filepath);
                  return instance;
                  break;
                case "xls":
                case "xlsx":
                  throw ".xls support not implemented";
                  break;
        }
    }
} 
