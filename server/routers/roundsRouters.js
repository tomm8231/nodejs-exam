import { Router } from "express";
import db from "../databases/connections.js";
const router = Router();


router.get("/api/rounds", async (req, res) => {

    const allRounds = await db.collection("orders").find({ softDeadline: { $exists: true } }).sort({ softDeadline: -1 }).toArray();
    const roundList = allRounds.map((round) => round.round);

    res.send({ data: roundList });
});




export default router;