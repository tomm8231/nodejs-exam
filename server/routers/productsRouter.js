import { Router } from "express";
import db from "../databases/connections.js";
import { checkAuth } from "../middelware/authMiddelware.js";
const router = Router();


router.get("/api/products/:round", async (req, res) => {
    const round = req.params?.round;
    const allProducts = await db.collection("products").find({ round }).toArray();

    res.send({ data: allProducts });
});




export default router;