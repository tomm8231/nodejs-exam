import {Router} from 'express'
import db from '../databases/connections.js'
import { adminCheck } from '../middelware/authMiddelware.js';
import { hashPassword, comparePassword } from '../encrypt/encryption.js';

const router = Router()

const userCollection = db.collection("users");

router.get("/api/users", adminCheck, async (req, res) => {
    const response = await userCollection.find({}).toArray()

    res.status(200).send({ data: response })
})

router.get("/api/users/:staffNumber", async (req, res) => {
    const staffNumber = req.session.user.uid

    const response = await userCollection.findOne({ staffNumber });
    res.status(200).send({ data: response });
});


router.delete("/api/users/:staffNumber", adminCheck, async (req, res) => {
    const staffNumber = req.params.staffNumber;

    const response = await userCollection.deleteOne({ staffNumber });
    res.status(200).send({ data: response });
});

router.put("/api/users/password", async (req, res) => {

    const { oldPassWord, newPassWord } = req.body;
    const staffNumber = req.session.user.uid

    const user = await userCollection.findOne({ staffNumber })

    const match = await comparePassword(oldPassWord, user.hashedPassword)

    if (match) {
        const hashedPassWord = await hashPassword(newPassWord)
        await userCollection.updateOne({ staffNumber }, { $set: { hashedPassword: hashedPassWord} })
        res.status(200).send({ data: "Password updated" })
    } else {
        res.status(401).send({ data: "Passwords does not match" })
    }


})

router.put("/api/users/:staffnumber", adminCheck, async (req, res) => {
    const staffNumber = req.params.staffnumber;
    const { name, email } = req.body;

    const response = await userCollection.updateOne(
        { staffNumber },
        {
            $set: {
                name,
                email,
            },
        }
    );
    res.status(200).send({ data: response });
});

export default router
