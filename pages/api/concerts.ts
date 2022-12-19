import { ObjectId } from 'mongodb';
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
        const bodyObjectPost = JSON.parse(req.body);
        let created = await db.collection("concerts").insertOne(bodyObjectPost);
        res.json({ concert: created });
        break;
      case "PUT":
        const bodyObjectPut = JSON.parse(req.body);
        await db.collection("concerts").updateOne({_id: req.query.id}, { $set: bodyObjectPut}, {upsert: true});
        res.status(200).json({ updated: true });
        break;
      case "GET":
        const concerts = await db.collection("concerts").find({}).toArray()
        res.status(200).json({ concerts })
        break;
      case "DELETE":
        console.log(await db.collection("concerts").find({}).toArray())
        const oid = new ObjectId(req.query.id as string)
        const deleted = await db.collection("concerts").deleteOne({_id: ObjectId.isValid(req.query.id as string) ? oid: req.query.id})
        if (deleted.deletedCount === 0) {
          const retried = await db.collection("concerts").deleteOne({_id: req.query.id})
          res.status(404).json({ deleted: retried.deletedCount, retried: true })
        }
        res.status(200).json({ deleted: true })
    }
}
