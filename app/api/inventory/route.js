import { getInventory} from '../../../lib/data'

export async function GET(){
    try{
        const inventory = await getInventory();
        return Response.json(inventory);
    }catch(error){
        return Response.json( {error: 'Failed to fetch inventory'}, {status: 500})
    }
}