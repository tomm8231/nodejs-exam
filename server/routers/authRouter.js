import { Router } from "express"
import bcrypt from "bcrypt"
import db from "../databases/connections.js";

const router = Router()

const userCollection = db.collection("users");
const saltRounds = 15

router.post("/auth/login", async (req, res) => {
    const { username, password } = req.body
    const foundUser = await userCollection.find({ username }).toArray()

    const compareResult = await bcrypt.compare(password, foundUser[0].hashedPassword)

    if (compareResult) {
        res.status(200).send({ data: "logged in"})
    } else {
        res.status(500).send({ data: "not logged in"})
    }
})

router.post("/auth/createUser", async (req, res) => {
    const { username, password } = req.body
    const role = "USER"

    const existingUser = await userCollection.find({ username }).toArray()

    if (!existingUser[0]) {
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        const response = await userCollection.insertOne({ username, hashedPassword, role})

        res.status(200).send({ data: ["User was created", response] })
    } else {
        res.status(500).send({ data: "User was not created: user already exists" })
    }

})


export default router