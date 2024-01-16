import { Router } from "express" 
import db from "../database/connections.js" 
import { adminCheck } from '../middelware/authMiddelware.js' 

const router = Router() 

router.get("/api/rounds", async (req, res) => {

    const allRounds = await db.collection("orders").find({ softDeadline: { $exists: true } }).sort({ softDeadline: -1 }).toArray() 
    const roundList = allRounds.map((round) => round.round) 

    res.send({ data: roundList }) 
}) 

router.delete("/api/rounds/:round", adminCheck, async (req, res) => {
    const round = req.params.round 
    try{
        await db.collection("orders").deleteMany({ round: round }) 
        await db.collection("messages").deleteMany({ round: round }) 
        await db.collection("products").deleteMany({ round: round }) 
    
    } catch (error) {
        res.status(500).send({ error: "Error deleting round: ", error }) 
    }

    res.status(200).send({ data: "Round deleted" }) 

})

export default router 