import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../lib/mongodb';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
  ) {
    const client = await clientPromise    
    const db = client.db(process.env.MONGODB_DB);
        
    switch (req.method) {
      case "GET":
        const musicians = await db.collection("musicians").find({}).toArray()
        res.status(200).json({ musicians })
        break;
    }
}