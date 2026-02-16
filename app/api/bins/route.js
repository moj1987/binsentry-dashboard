import { getBins, updateBin} from '../../../lib/data'

export async function GET(){
    try{
        const bins = await getBins();
        return Response.json(bins);
    }catch(error){
        return Response.json( {error: 'Failed to fetch bins'}, {status: 500})
    }
}


export async function PUT(request){
    try{
        const {id, ...updateData} = await request.json();
        if(!id){
            return Response.json({ error: 'Missing item id' }, { status: 400 });
        }

        const result = await updateBin(id, updateData)

        if (!result.success){
            return Response.json({error: result.error}, {status:404})
        }

        return Response.json(result.data)
    }catch(error){
        return Response.json({error:'Failed to update bin'}, {status:500})
    }
}
