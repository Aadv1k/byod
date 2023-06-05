import { promises as fs } from 'fs';
import * as csv from 'fast-csv';

export default class {
  delem: string;
  csvData: Array<Array<string>>;

  constructor(delem?: string) {
    this.delem = delem ?? ',';
    this.csvData = [];
  }

  async fromFile(filepath: string): Promise<void> {
    const fileContent = await fs.readFile(filepath, 'utf-8');
    return new Promise<void>((resolve, reject) => {
      csv
        .parseString(fileContent, {
          headers: false,
          delimiter: this.delem,
        })
        .on('data', (row: Array<string>) => {
          this.csvData.push(row);
        })
        .on('error', (error: Error) => {
          reject(error);
        })
        .on('end', () => {
          resolve();
        });
    });
  }

  dropColumn(name: string) {
    const columnIndex = this.getColumnIndex(name);
    if (columnIndex !== -1) {
      this.csvData.forEach(row => {
        row.splice(columnIndex, 1);
      });
    }
  }

  addColumn(name: string, col: Array<string>) {
    this.csvData.forEach((row, index) => {
      if (index < col.length) {
        row.push(col[index]);
      } else {
        row.push('');
      }
    });
  }

  async toString(): Promise<string> {
     let str = await csv.writeToString(this.csvData, {
        headers: false,
        delimiter: this.delem,
      });

      return str;
  }

  private getColumnIndex(name: string): number {
    const headerRow = this.csvData[0];
    return headerRow.findIndex(column => column === name);
  }
}
