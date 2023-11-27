import {Router} from 'express'
import db from '../databases/connections.js'
import { hashPassword } from '../encrypt/encryption.js';
const router = Router()

const userCollection = db.collection("users");

router.post("/api/users", async (req, res) => {
    const { username, password, email, membernumber } = req.body
    const role = "USER"

    const existingUser = await userCollection.find({ username }).toArray()

    if (!existingUser[0]) {
        const hashedPassword = await hashPassword(password)
        const response = await userCollection.insertOne({ username, email, membernumber, hashedPassword, role})

        res.status(200).send({ data: ["User was created", response] })
    } else {
        res.status(500).send({ data: "User was not created: user already exists" })
    }

})


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