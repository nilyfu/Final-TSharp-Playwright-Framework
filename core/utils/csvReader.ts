import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export function readCSVFile<T>(fileName: string): T[] {

    const fullPath = path.join(process.cwd(),`test-data`,fileName);
    try {
        const fileContent = fs.readFileSync(fullPath, 'utf-8');
        const userdata = parse(fileContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
        });
        return userdata as T[];

    } catch (error) {
        console.error(`Error reading CSV file at ${fullPath}: ${(error as Error).message}`);
    return [];
    }
}
