import { Router } from 'express';
import db from "../databases/connections.js";
const router = Router();


router.post("/api/createorder", async (req, res) => {

    const username = req.body.username;
    const existingUser = await db.collection("orders").findOne({ "username": username });
    try {
        if (!existingUser) {
            await db.collection("orders").insertOne(req.body);
        } else {
            const newData = req.body

            await db.collection("orders").updateOne(
                { "username": req.body.username },
                { $set: newData }
            );
        }
        res.status(200).send({ data: "All went well" })

    } catch (error) {
        console.log("Error: " + error);
        res.status(500).send({ data: "Nothing went well" })
    }
})




export default router;