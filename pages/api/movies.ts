import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../lib/mongodb';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
  ) {
    const client = await clientPromise    
    const db = client.db(process.env.MONGODB_DB);

    switch (req.method) {
      case "POST":
        // let bodyObject = JSON.parse(req.body);
        // let myPost = await db.collection("posts").insertOne(bodyObject);
        // res.json(myPost.ops[0]);
        break;
      case "GET":
        const concerts = await db.collection("concerts").find({}).toArray()
        res.status(200).json({ concerts })
        break;
    }
}