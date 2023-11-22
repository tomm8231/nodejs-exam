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

            // const counts = await db.collection("orders").aggregate([
            //     {
            //         $unwind: "$orderedItems"
            //     },
            //     {
            //         $group: {
            //             _id: "$orderedItems._id",
            //             count: {
            //                 $sum: "$orderedItems.quantity"
            //             }
            //         }
            //     }
            // ]).toArray()

            // const result = existingOrders.map(product => {
            //     const foundItem = counts.find(item => item._id = product._id);
            //     product.orderedItems.total_amount = foundItem ? foundItem.count : 0;
            //     return product;
            // });

            
            // vi har en liste med id  og count - counts
            // id referreer til et produkts id

            // Vi har en liste med produkts Produkter
            // const result = p.map( produkt => {
            //  const foundItem = counts.find( item._id =>  return counts._id === item._id)
            //  product.total_amount = foundItem.count
            //  return product
            // })

            // res.status(200).send({ data: result })


            const finalOrder = existingOrders[0].orderedItems.map( finalOrderItem => {

                let finalItemAmount = 0
                //go through each order, and only the item updated is the current one
                existingOrders.map( singleOrder =>{
                    
                    //find the item in each order, that matches the template item
                    const foundItem = singleOrder.orderedItems.find(item => item._id === finalOrderItem._id)
                    finalItemAmount += foundItem.quantity
                })
            
                finalOrderItem.quantity = finalItemAmount
                return finalOrderItem
            })
            
            res.status(200).send({ data: [finalOrder] })

        } else {
            const existingProducts = await db.collection("products").find({ round }).toArray();
            res.status(200).send({ data: existingProducts, message: "No orders" })
        }

    } catch (error) {
        console.error("Error: " + error)
    }
})




export default router;