import { Router } from 'express';
import db from "../databases/connections.js";
const router = Router();


router.post("/api/orders", async (req, res) => {

    const username = req.body.username;
    const round = req.body.round;
    const existingOrder = await db.collection("orders").findOne({ username, round });

    try {
        if (!existingOrder) {
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

router.get("/api/orders/:round", async (req, res) => {
    const round = req.params?.round

    try {
        const existingOrders = await db.collection("orders").find({ round }).toArray();
        if (existingOrders) {
            
            res.status(200).send({ data: existingOrders })
        } else {
            const existingProducts = await db.collection("products").find({ round }).toArray();
            res.status(200).send({ data: existingProducts, message: "No orders" })
        }

    } catch (error) {
        console.error("Error: " + error)
    }
})




export default router;