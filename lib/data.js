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

export async function getInventory() {
  try {
    const filePath = path.join(dataPath, "inventory.json");
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch(error){
    console.error('Error reading inventory:', error)
    return [];
  }
}

export async function addInventory(item){
  try{
    const inventory = await getInventory();
    inventory.push(item);

    const filePath = path.join(dataPath, 'inventory.json')
    await fs.writeFile(filePath, JSON.stringify(inventory, null, 2));

    return item;
  } catch(error){
    console.error('Error adding inventory:', error);
    return { success: false, error: error.message };
  }
}