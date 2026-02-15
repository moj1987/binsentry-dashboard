import { getBins} from '../../../lib/data'

export async function GET(){
    try{
        const bins = await getBins();
        return Response.json(bins);
    }catch(error){
        return Response.json( {error: 'Failed to fetch bins'}, {status: 500})
    }
}