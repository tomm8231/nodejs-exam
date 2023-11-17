import express from "express"
const app = express()

import allProducts from "./databases/read.js"

app.get("/", (req, res) => {
    res.send({data: allProducts})
})

const PORT = process.env.PORT || 8080

app.listen(PORT, (res, req) => {
    console.log("Server is running on port", PORT);
})