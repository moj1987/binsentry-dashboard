import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: '.env.local' });
}

const dataPath = path.join(process.cwd(), 'data');

import { 
  DynamoDBClient, 
  ScanCommand,
  PutItemCommand,
  UpdateItemCommand,
  DeleteItemCommand
} from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

export async function getBins() {
  try {
    const command = new ScanCommand({ TableName: 'bins' });
    const response = await client.send(command);
    
    // Convert DynamoDB format to plain JSON
    return response.Items.map(item => ({
      id: item.id.S,
      name: item.name.S,
      level: parseInt(item.level.N),
      location: item.location.S,
      lastUpdated: item.lastUpdated.S
    }));
  } catch (error) {
    console.error('Error reading bins:', error);
    return [];
  }
}

export async function getInventory() {
  try {
    const command = new ScanCommand({ TableName: 'inventory' });
    const response = await client.send(command);
    
    // Convert DynamoDB format to plain JSON
    return response.Items.map(item => ({
      id: item.id.S,
      name: item.name.S,
      quantity: parseInt(item.quantity.N),
      binId: item.binId.S,
      type: item.type.S
    }));
  } catch (error) {
    console.error('Error reading inventory:', error);
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
    
    // Create updated item with DynamoDB format
    const dynamoUpdatedItem = {
      id: { S: id },
      name: { S: updatedItem.name },
      level: { N: updatedItem.level.toString() }, // Convert to string
      location: { S: updatedItem.location },
      lastUpdated: { S: updatedItem.lastUpdated }
    };
    
    const command = new UpdateItemCommand({
      TableName: 'bins',
      Key: { id: { S: id } },
      UpdateExpression: 'set #name = :name, #level = :level, #location = :location, #lastUpdated = :lastUpdated',
      ExpressionAttributeNames: {
        '#name': 'name',
        '#level': 'level', 
        '#location': 'location',
        '#lastUpdated': 'lastUpdated'
      },
      ExpressionAttributeValues: {
        ':name': { S: updatedItem.name },
        ':level': { N: updatedItem.level.toString() },
        ':location': { S: updatedItem.location },
        ':lastUpdated': { S: updatedItem.lastUpdated }
      }
    });
    
    await client.send(command);
    
    // Return as plain JSON
    const plainUpdatedItem = {
      id: id,
      name: updatedItem.name,
      level: updatedItem.level,
      location: updatedItem.location,
      lastUpdated: updatedItem.lastUpdated
    };
    
    return { success: true, data: plainUpdatedItem };
  } catch(error){
    console.error('Error updating bin:', error);
    return { success: false, error: error.message };
  }
}

export async function addInventory(item){
  try{
    const inventory = await getInventory();
    
    // Generate unique ID if not provided
    if (!item.id) {
      item.id = Date.now().toString();
    }
    
    // Format item for DynamoDB (all values must be strings)
    const dynamoItem = {
      id: { S: item.id },
      name: { S: item.name },
      quantity: { N: item.quantity.toString() }, // Convert to string
      binId: { S: item.binId },
      type: { S: item.type }
    };
    
    const command = new PutItemCommand({
      TableName: 'inventory',
      Item: dynamoItem
    });
    await client.send(command);
    
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
      return { success: false, error:'Item not found'};
    }
    
    // Create UpdateItem command with proper DynamoDB format
    const command = new UpdateItemCommand({
      TableName: 'inventory',
      Key: { id: { S: id } },
      UpdateExpression: 'set #name = :name, #quantity = :quantity, #binId = :binId, #type = :type',
      ExpressionAttributeNames: {
        '#name': 'name',
        '#quantity': 'quantity',
        '#binId': 'binId',
        '#type': 'type'
      },
      ExpressionAttributeValues: {
        ':name': { S: updatedItem.name },
        ':quantity': { N: updatedItem.quantity.toString() },
        ':binId': { S: updatedItem.binId },
        ':type': { S: updatedItem.type }
      }
    });
    
    await client.send(command);
    
    // Return the updated item in plain JSON format
    const updatedDynamoItem = {
      id: id,
      name: updatedItem.name,
      quantity: updatedItem.quantity,
      binId: updatedItem.binId,
      type: updatedItem.type
    };
    
    return { success: true, data: updatedDynamoItem };
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
      return { success: false, error:'Item not found'};
    }
    
    const command = new DeleteItemCommand({
      TableName: 'inventory',
      Key: { id: { S: id } }
    });
    
    await client.send(command);
    
    return { success: true, message: 'Item gone! Byeee' };
  } catch(error){
    console.error('Error deleting inventory:', error);
    return { success: false, error: error.message };
  }
}
