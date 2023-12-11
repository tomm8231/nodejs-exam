import { Router } from "express";
import db from "../databases/connections.js";
const router = Router();


router.get("/api/rounds", async (req, res) => {
    const allRounds = await db.collection("products").distinct("round")

    res.send({ data: allRounds });
});




export default router;