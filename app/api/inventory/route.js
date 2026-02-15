import { getInventory, addInventory} from '../../../lib/data'

export async function GET(){
    try{
        const inventory = await getInventory();
        return Response.json(inventory);
    }catch(error){
        return Response.json( {error: 'Failed to fetch inventory'}, {status: 500})
    }
}

export async function POST(request) {
   try{
        const newItem = await request.json();
        
        // Validate required fields
        if (!newItem.binId || !newItem.feedType || !newItem.quantity) {
        return Response.json(
            { error: 'Missing required fields: binId, feedType, quantity' },
            { status: 400 }
        );
        }

         // Create new inventory item with ID and timestamp
        const inventoryItem = {
        id: `inv-${Date.now()}`, 
        binId: newItem.binId,
        feedType: newItem.feedType,
        quantity: newItem.quantity,
        entryDate: new Date().toISOString(),
        notes: newItem.notes || ''
        };
        await addInventory(inventoryItem)
        return Response.json(inventoryItem, {status: 201});
    } catch(error) {
         return Response.json(
             { error: 'Failed to create inventory item' },
             { status: 500 }
        );
    }
}