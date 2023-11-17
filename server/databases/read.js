import db from "./connections.js"

const allProducts = await db.products.find().toArray()

export default allProducts
