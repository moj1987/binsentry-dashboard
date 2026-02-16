import { getInventory, addInventory, updateInventory, deleteInventory} from '../../../lib/data'

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

export async function PUT(request){
    try{
        const {id, ...updateData} = await request.json();
        if(!id){
            return Response.json({ error: 'Missing item id' }, { status: 400 });
        }

        const result = await updateInventory(id, updateData)

        if (!result.success){
            return Response.json({error: result.error}, {status:404})
        }

        return Response.json(result.data)
    }catch(error){
        return Response.json({error:'Failed to update inventory'}, {status:500})
    }
}


export async function DELETE(request){
    try{
        const {id} = await request.json();
        if(!id){
            return Response.json({ error: 'Missing item id' }, { status: 400 });
        }

        const result = await deleteInventory(id)

        if (!result.success){
            return Response.json({error: result.error}, {status:404})
        }

        return Response.json(result)
    }catch(error){
        return Response.json({error:'Failed to delete inventory'}, {status:500})
    }
}