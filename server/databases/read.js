import db from "./connections.js";

const getProductsCollection = db.collection("products");
const getOrderRequestsCollection = db.collection("order_requests")

export {
    getProductsCollection,
    getOrderRequestsCollection
};
