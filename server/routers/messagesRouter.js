import { Router } from "express"
import db from "../databases/connections.js"

const router = Router()

router.get("/api/messages", async (req, res) => {

    const messages = await db.collection("messages").find().sort({ date: -1 }).toArray()

    res.send({ data: messages })
}) 

export default router