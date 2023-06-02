// Take input in, cache it, return output

import { CACHE_DIR } from "./const";
import { md5 } from "./utils";

import fs from "node:fs";
import path from "node:path";

export default class Cache {
  cacheDir: string;
   
  constructor(cacheDir?: string) {
    this.cacheDir = path.join(__dirname, cacheDir ?? CACHE_DIR);
     if (!fs.existsSync(this.cacheDir))
         fs.mkdirSync(this.cacheDir);
  }

  cache(id: string, data: any): string {
    const hid = md5(id);
    const filename = `byod-${hid}.json`;
    const filepath = path.join(this.cacheDir, filename);

    try {
        fs.writeFileSync(filepath, JSON.stringify(data));
        return filename;
    } catch (error) {
        console.error("[ERROR] CACHE was unable to write file", error)
        return "";
    }
  }

  get(id: string): any {
    const hid = md5(id);
    const filename = `byod-${hid}.json`;
    const filepath = path.join(this.cacheDir, filename);

    try {
        const data = JSON.parse(fs.readFileSync(filepath, "utf-8"));
        return data;
    } catch (error) {
        return [];
    }
  }
}
