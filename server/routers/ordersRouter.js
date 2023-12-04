import { Router } from 'express';
import db from "../databases/connections.js";
import { adminCheck } from '../middelware/authMiddelware.js';
const router = Router();


router.get("/api/orders", async (req, res) => {
// find all the names of differend rounds
    const rounds = await db.collection("orders").distinct("round")
    res.status(200).send({ data: rounds })

})


router.get("/api/orders/:round", async (req, res) => {
    const round = req.params?.round

    try {
        const existingOrders = await db.collection("orders").find({ round }).toArray();

        if (existingOrders) {

            const counts = await db.collection("orders").aggregate([
                {
                    $unwind: "$orderedItems"
                },
                {
                    $group: {
                        _id: "$orderedItems._id",
                        count: {
                            $sum: "$orderedItems.quantity"
                        }
                    }
                }
            ]).toArray()

            const result = existingOrders[0].orderedItems.map(product => {
                const foundItem = counts.find(item => item._id === product._id);
                product.quantity = foundItem ? foundItem.count : 0;
                return product;
            });

            res.status(200).send({ data: [result] })


            // const finalOrder = existingOrders[0].orderedItems.map( finalOrderItem => {

            //     let finalItemAmount = 0
            //     //go through each order, and only the item updated is the current one
            //     existingOrders.map( singleOrder =>{
                    
            //         //find the item in each order, that matches the template item
            //         const foundItem = singleOrder.orderedItems.find(item => item._id === finalOrderItem._id)
            //         finalItemAmount += foundItem.quantity
            //     })
            
            //     finalOrderItem.quantity = finalItemAmount
            //     return finalOrderItem
            // })
            
            // res.status(200).send({ data: [finalOrder] })

        } else {
            const existingProducts = await db.collection("products").find({ round }).toArray();
            res.status(200).send({ data: existingProducts, message: "No orders" })
        }

    } catch (error) {
        console.error("Error: " + error)
    }
})


router.get("/api/orders/:round/:staffNumber", async (req, res) => {
    const round = req.params?.round
    const staffNumber = req.params?.staffNumber

    try {
        const existingOrder = await db.collection("orders").find({ round, staffNumber }).toArray();
        
        if(existingOrder[0] ) {
            res.status(200).send({ data: existingOrder[0].orderedItems })
        } else {
            res.status(400).send({ data: "Not found" })
        }

    } catch (error) {
        console.log(error)
    }

})


router.post("/api/orders", async (req, res) => {

    // const staffNumber = req.body.staffNumber;
    const staffNumber = req.session.user?.uid;
    console.log(staffNumber)
    const round = req.body.round;
    const existingOrder = await db.collection("orders").findOne({ staffNumber, round });

    try {
        if (!existingOrder) {
            await db.collection("orders").insertOne(req.body);
        } else {
            const newData = req.body

            await db.collection("orders").updateOne(
                { "staffNumber": req.body.staffNumber },
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