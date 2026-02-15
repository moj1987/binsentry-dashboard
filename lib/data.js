import fs from 'fs/promises';
import path from 'path';

const dataPath = path.join(process.cwd(), 'data');

export async function getBins() {
  try {
    const filePath = path.join(dataPath, "bins.json");
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch(error){
    console.error('Error reading bins:', error)
    return [];
  }
}
