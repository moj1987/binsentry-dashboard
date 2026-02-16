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

export async function updateBin(id, updatedItem){
  try{
    const bins = await getBins();
    const index = bins.findIndex(item => item.id === id)
    
    if (index ===-1){
      return { success: false, error:'Item not found'};
    }
    
    bins[index] = { ...bins[index], ...updatedItem };

    const filePath = path.join(dataPath, 'bins.json')
    await fs.writeFile(filePath, JSON.stringify(bins, null, 2));

    return { success: true, data: bins[index] };
  } catch(error){
    console.error('Error updating bin:', error);
    return { success: false, error: error.message };
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

export async function updateInventory(id, updatedItem){
  try{
    const inventory = await getInventory();
    const index = inventory.findIndex(item => item.id === id)
    
    if (index ===-1){
      return { success: false, error:'Itemm not found'};
    }
    
    inventory[index] = { ...inventory[index], ...updatedItem };

    const filePath = path.join(dataPath, 'inventory.json')
    await fs.writeFile(filePath, JSON.stringify(inventory, null, 2));

    return { success: true, data: inventory[index] };
  } catch(error){
    console.error('Error updating inventory:', error);
    return { success: false, error: error.message };
  }
}


export async function deleteInventory(id){
  try{
    const inventory = await getInventory();
    const index = inventory.findIndex(item => item.id === id)
    
    if (index ===-1){
      return { success: false, error:'Itemm not found'};
    }
    
    const updatedInventory = inventory.filter(item => item.id !==id)

    const filePath = path.join(dataPath, 'inventory.json')
    await fs.writeFile(filePath, JSON.stringify(inventory, null, 2));

    return { success: true, message: 'Itme gone! Byeee' };
  } catch(error){
    console.error('Error deleting inventory:', error);
    return { success: false, error: error.message };
  }
}