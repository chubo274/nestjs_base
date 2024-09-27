import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from 'prisma/prisma.service';
import { Parser } from 'json2csv';
import * as fastcsv from 'fast-csv';

@Injectable()
export class CsvService {
  constructor(private readonly prisma: PrismaService) { }

  async importCsv(buffer: Buffer): Promise<any[]> {
    const records = [];

    return await new Promise<any[]>((resolve, reject) => {
      fastcsv
        .parseString(buffer.toString('utf-8'), { headers: true })
        .on('data', (row) => {
          records.push(row);
        })
        .on('end', async () => {
          resolve(records);
        })
        .on('error', (error) => reject(error));
    });
  }

  async exportCsv(fields: string[], records: any[]): Promise<string> { // value of fields need is key of value element in records
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(records);

    const filePath = path.resolve(__dirname, 'export.csv');
    fs.writeFileSync(filePath, csv);

    return filePath;
  }
}
