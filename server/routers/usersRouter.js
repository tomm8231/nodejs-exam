import {Router} from 'express'
import db from '../databases/connections.js'
const router = Router()

const userCollection = db.collection("users");


router.get("/api/users", async (req, res) => {
    const response = await userCollection.find({}).toArray()

    res.status(200).send({ data: response })
})

import { ObjectId } from 'mongodb';

router.delete("/api/users/:id", async (req, res) => {
    const { id } = req.params;
    console.log(id);

    const response = await userCollection.deleteOne({ _id: new ObjectId(id) });
    res.status(200).send({ data: response });
});


export default router