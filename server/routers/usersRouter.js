import {Router} from 'express'
import db from '../databases/connections.js'
const router = Router()

const userCollection = db.collection("users");

router.post('/api/users', async (req, res) => {
    const {username, password} = req.body
    const role = "USER"

    const existingUser = await userCollection.findOne({ username, password })

    if (!existingUser) {
        await userCollection.insertOne({username, password, role} )
        res.status(200).send({data: "User created"})
    } else {
        res.status(500).send({data: "User already exists"})
    }
})

export default router