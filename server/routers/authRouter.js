import { Router } from "express"
import bcrypt from "bcrypt"
import { hashPassword, randomPassword } from '../encrypt/encryption.js';
import db from "../databases/connections.js";
import { adminCheck } from "../middelware/authMiddelware.js";
import { sendMail } from "../nodemailer/sendEmail.js";

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
        res.status(500).send({ data: "not logged in" })
    }
})

router.post("/auth/signup", adminCheck, async (req, res) => {
    const { name, email, staffNumber } = req.body
    const role = "USER"
    const existingUser = await userCollection.find({ staffNumber }).toArray()

    if (!existingUser[0]) {
        const password = await randomPassword()
        const hashedPassword = await hashPassword(password)
        const response = await userCollection.insertOne({ name, email, staffNumber, hashedPassword, role })
        const message = `Velkommen til luffelands staffbestilling. \nDin adgangskode er: ${password} \nDu kan ændre din adgangskode når du er logget ind.`
        sendMail(email, "Velkommen til luffelands staffbestilling", message )
        res.status(200).send({ data: ["User was created", response] })
    } else {
        res.status(500).send({ data: "User was not created: user already exists" })
    }

})

router.post("/auth/validateSession", async (req, res) => {
    const { currentUserId } = req.body
    let sessionId = ""
    if (req.session && req.session.user) {
        sessionId = req.session?.user.uid
    }

    if (currentUserId == sessionId) {
        res.status(200).send({ data: "Session validated" })
    } else {
        res.status(400).send({ data: "Session not validated" })

    }

})

router.get("/auth/logout", (req, res) => {
    delete req.session.user

    req.session.destroy(() => {
            res.status(200).send({ data: "Logged out" })
    })

})

export default router