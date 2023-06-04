import * as yauzl from "yauzl";
import path from "node:path";
import fs from "node:fs";

function unzip(zipFile: string, targetDirectory: string): Promise<void> {
  return new Promise((resolve, reject) => {
    yauzl.open(zipFile, { lazyEntries: true }, (err, zipfile) => {
      if (err) {
        reject(err);
        return;
      }

      zipfile.readEntry();
      zipfile.on('entry', (entry) => {
        const targetPath = `${targetDirectory}/${entry.fileName}`;
        console.log(targetPath);

        if (/\/$/.test(entry.fileName)) {
          // Directory entry
          fs.mkdirSync(targetPath, { recursive: true });
          zipfile.readEntry();
        } else {
          // File entry
          zipfile.openReadStream(entry, (err, readStream) => {
            if (err) {
              reject(err);
              return;
            }
            
            readStream.on('end', () => {
              zipfile.readEntry();
            });

            readStream.pipe(fs.createWriteStream(targetPath));
          });
        }
      });

      zipfile.on('end', () => {
        resolve();
      });

      zipfile.on('error', (err) => {
        reject(err);
      });
    });
  });
}

export default class Handler {
    public static async handleZip(filepath: string) {
        const parent = path.resolve(path.join(filepath, "../"));
        try {
            await unzip(filepath, parent);
        } catch (err) { throw err }
    }


    handle(filepath: string) {
        const ext = filepath.split(".").pop();
        switch (ext) {
                case "zip":
                  Handler.handleZip(filepath);
                  break;
        }
    }
} 
