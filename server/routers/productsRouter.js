import { Router } from "express";
const router = Router();

import { getProductsCollection } from "../databases/read.js";

router.get("/products/:round", async (req, res) => {
    const round = req.params?.round
    const productsCollection = getProductsCollection;
    const allProducts = await productsCollection.find({ round }).toArray();

    res.send({ data: allProducts });
})

export default router;