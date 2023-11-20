import { db } from "./connections.js";

const getProductsCollection = db.collection("products");


export {
    getProductsCollection
};
