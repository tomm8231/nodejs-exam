import { Router } from "express"
import bcrypt from "bcrypt"
import { hashPassword } from '../encrypt/encryption.js';
import db from "../databases/connections.js";

const router = Router()

const userCollection = db.collection("users");

router.post("/auth/login", async (req, res) => {
    const { staffNumber, password } = req.body
    const foundUser = await userCollection.find({ staffNumber }).toArray()

    const passwordMatch = await bcrypt.compare(password, foundUser[0].hashedPassword)


    if (passwordMatch) {

        req.session.user = {
            uid: foundUser[0].staffNumber,
            role: foundUser[0].role
          }

          res.status(200).send({ data: "logged in", userData: req.session.user })
    } else {
        res.status(500).send({ data: "not logged in"})
    }
})

router.post("/auth/signup", async (req, res) => {
    const { name, password, email, staffNumber } = req.body
    const role = "USER"

    const existingUser = await userCollection.find({ staffNumber }).toArray()

    if (!existingUser[0]) {
        const hashedPassword = await hashPassword(password)
        const response = await userCollection.insertOne({ name, email, staffNumber, hashedPassword, role})

        res.status(200).send({ data: ["User was created", response] })
    } else {
        res.status(500).send({ data: "User was not created: user already exists" })
    }

})


export default router