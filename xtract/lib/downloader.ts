import axios from 'axios';

import fs from 'node:fs';
import os from "node:os"
import path from "node:path";
import crypto from "node:crypto";

export default class Downloader {
    tmpdir: string;

    constructor(dirname?: string) {
        let cur = ".byod-data" ?? dirname;
        this.tmpdir = path.join(os.tmpdir(), cur);
        try {
            fs.mkdirSync(this.tmpdir)
        } catch {}
    }

    async download(url: string): Promise<string> {
        const response =  await axios({
            url: url,
            method: "GET",
            responseType: "arraybuffer"
        })


        let mime = response.headers["content-type"];
        let ext;

        switch (mime) {
            case "application/zip":
                ext = ".zip";
                break;
            case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                ext = ".xls"
                break;
             case "text/csv":
                ext = ".csv";
                break;
        }

        let filename = `${crypto.randomBytes(32)}${ext}`;
        let destpath = path.join(this.tmpdir, filename);

        const data = Buffer.from(response.data, 'binary');
        fs.writeFileSync(destpath, data);  
        return destpath;
    }

    clean() {
        fs.rmdirSync(this.tmpdir, {
            recursive: true
        });
    }

}
